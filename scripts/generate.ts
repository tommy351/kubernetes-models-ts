import {
  basename,
  dirname,
  extname,
  join,
  relative,
  resolve,
  posix
} from "path";
import * as ts from "typescript";
import yargs from "yargs";
import { access, readFile, writeFile } from "./fs";
import { set } from "./object";
import { camelCase, trimPrefix, unquote, upperFirst } from "./string";
import { hasModifier } from "./ts";

interface IModelTree {
  [key: string]: IModelTree | string;
}

interface IKubernetesMeta {
  name: string;
  group?: string;
  kind?: string;
  version?: string;
}

const { argv } = yargs
  .option("file", {
    description: "Path of OpenAPI spec",
    required: true
  })
  .option("model", {
    description: "Path of the model folder",
    required: true
  })
  .option("output", {
    description: "Output path",
    required: true
  });

const modelDir = resolve(argv.model);
const outputDir = resolve(argv.output);

const modelTree: IModelTree = {};
const classMetaMap = new Map<string, IKubernetesMeta>();

function getFileName(s: string) {
  return camelCase(s, ".");
}

function getClassName(s: string) {
  return upperFirst(camelCase(s, "."));
}

function getModelPath(name: string) {
  return join(modelDir, getFileName(name) + ".ts");
}

function getOutputPath(name: string) {
  return join(outputDir, ...trimPrefix(name, "io.k8s.").split("."));
}

async function walkModelTree(tree: IModelTree, prefix: string = "") {
  await writeIndexFile(tree, prefix);

  for (const key of Object.keys(tree)) {
    const child = tree[key];

    if (typeof child === "string") {
      await writeClassFile(child);
    } else {
      await walkModelTree(child, prefix + key + ".");
    }
  }
}

async function writeClassFile(name: string) {
  const sourcePath = getModelPath(name);
  const sourceText = await readFile(sourcePath, "utf8");
  const sourceFile = ts.createSourceFile(
    sourcePath,
    sourceText,
    ts.ScriptTarget.ES2015,
    true,
    ts.ScriptKind.TS
  );
  const printer = ts.createPrinter();
  const result = ts.transform(sourceFile, [transform]);
  const output = printer.printFile(result.transformed[0] as ts.SourceFile);
  const outputPath = getOutputPath(name) + ".ts";

  await writeFile(outputPath, output);
  console.log("Generated:", outputPath);
}

function transform(ctx: ts.TransformationContext) {
  return (sf: ts.SourceFile) => {
    function visit(node: ts.Node): ts.Node {
      if (ts.isImportDeclaration(node)) {
        return transformImport(ctx, sf, node);
      }

      if (ts.isClassDeclaration(node)) {
        return (
          (transformClass(ctx, sf, node) as any) ||
          ts.createNotEmittedStatement(node)
        );
      }

      return node;
    }

    return ts.visitEachChild(sf, visit, ctx);
  };
}

function transformImport(
  ctx: ts.TransformationContext,
  sf: ts.SourceFile,
  node: ts.ImportDeclaration
) {
  const modulePath = unquote(node.moduleSpecifier.getText());
  if (!modulePath.startsWith("./")) return node;

  const moduleMeta = classMetaMap.get(upperFirst(trimPrefix(modulePath, "./")));
  if (!moduleMeta) return node;

  const sourceMeta = classMetaMap.get(
    upperFirst(basename(sf.fileName, extname(sf.fileName)))
  );
  if (!sourceMeta) return node;

  const sourcePath = getOutputPath(sourceMeta.name);
  const targetPath = getOutputPath(moduleMeta.name);
  let relativePath = relative(dirname(sourcePath), targetPath).replace(
    /\\/g,
    posix.sep
  );

  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }

  return ts.createImportDeclaration(
    node.decorators,
    node.modifiers,
    transformIdentifier(ctx, node.importClause), // ts.visitEachChild(node.importClause, visitImportClause(ctx), ctx),
    ts.createLiteral(relativePath)
  );
}

function transformIdentifier<T extends ts.Node>(
  ctx: ts.TransformationContext,
  root?: T
) {
  function visit(node: ts.Node): ts.Node {
    // Add "I" prefix to identifiers
    if (ts.isIdentifier(node)) {
      const name = node.getText();

      if (classMetaMap.has(name)) {
        return ts.createIdentifier("I" + name);
      }
    }

    return ts.visitEachChild(node, visit, ctx);
  }

  return ts.visitEachChild(root, visit, ctx);
}

function transformClass(
  ctx: ts.TransformationContext,
  sf: ts.SourceFile,
  node: ts.ClassDeclaration
) {
  const className = node.name && node.name.getText();
  if (!className) return;

  const meta = classMetaMap.get(className);
  if (!meta) return;

  const shortName = meta.name.split(".").pop();
  if (!shortName) return;

  const classMembers: ts.ClassElement[] = [];
  const interfaceMembers: ts.TypeElement[] = [];
  const interfaceName = "I" + className;

  // Pick properties from the class
  ts.forEachChild(node, n => {
    if (!ts.isPropertyDeclaration(n)) return;
    if (hasModifier(n, ts.SyntaxKind.StaticKeyword)) return;

    const propertyType = transformIdentifier(ctx, n.type);

    classMembers.push(createClassProperty(meta, n, propertyType));

    interfaceMembers.push(
      ts.createPropertySignature(
        n.modifiers,
        n.name,
        n.questionToken,
        propertyType,
        n.initializer
      )
    );
  });

  const classCtorData = ts.createIdentifier("data");

  // Add constructor
  classMembers.push(
    ts.createConstructor(
      undefined,
      undefined,
      [
        ts.createParameter(
          undefined,
          undefined,
          undefined,
          classCtorData,
          ts.createToken(ts.SyntaxKind.QuestionToken),
          ts.createIdentifier(interfaceName) as any,
          undefined
        )
      ],
      ts.createBlock([
        ts.createIf(
          classCtorData,
          ts.createBlock(
            interfaceMembers.map(member => {
              const memberName = ts.createStringLiteral(
                unquote((member.name && member.name.getText()) as string)
              );
              const thisAccess = ts.createElementAccess(
                ts.createThis(),
                memberName
              );
              const dataAccess = ts.createElementAccess(
                classCtorData,
                memberName
              );

              return ts.createIf(
                ts.createBinary(
                  dataAccess,
                  ts.SyntaxKind.ExclamationEqualsEqualsToken,
                  ts.createIdentifier("undefined")
                ),
                ts.createBlock([
                  ts.createExpressionStatement(
                    ts.createBinary(
                      thisAccess,
                      ts.SyntaxKind.EqualsToken,
                      dataAccess
                    )
                  )
                ])
              );
            })
          )
        )
      ])
    )
  );

  // Add toJSON method
  const toJSONOutput = ts.createIdentifier("output");

  classMembers.push(
    ts.createMethod(
      undefined,
      undefined,
      undefined,
      "toJSON",
      undefined,
      undefined,
      [],
      undefined,
      ts.createBlock([
        ts.createVariableStatement(
          undefined,
          ts.createVariableDeclarationList(
            [
              ts.createVariableDeclaration(
                toJSONOutput,
                ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword),
                ts.createObjectLiteral()
              )
            ],
            ts.NodeFlags.Const
          )
        ),
        ...interfaceMembers.map(member => {
          const memberName = ts.createStringLiteral(
            unquote((member.name && member.name.getText()) as string)
          );
          const memberAccess = ts.createElementAccess(
            ts.createThis(),
            memberName
          );

          return ts.createIf(
            ts.createBinary(
              memberAccess,
              ts.SyntaxKind.ExclamationEqualsEqualsToken,
              ts.createIdentifier("undefined")
            ),
            ts.createBlock([
              ts.createExpressionStatement(
                ts.createBinary(
                  ts.createElementAccess(toJSONOutput, memberName),
                  ts.SyntaxKind.EqualsToken,
                  memberAccess
                )
              )
            ])
          );
        }),
        ts.createReturn(toJSONOutput)
      ])
    )
  );

  return ts.createNodeArray([
    // Declare the interface
    ts.createInterfaceDeclaration(
      node.decorators,
      node.modifiers,
      interfaceName,
      node.typeParameters,
      node.heritageClauses,
      interfaceMembers
    ),
    // Declare the class
    ts.createClassDeclaration(
      node.decorators,
      node.modifiers,
      className,
      node.typeParameters,
      [
        ...(node.heritageClauses || []),
        ts.createHeritageClause(ts.SyntaxKind.ImplementsKeyword, [
          ts.createExpressionWithTypeArguments(undefined, ts.createIdentifier(
            interfaceName
          ) as any)
        ])
      ],
      classMembers
    ),
    // Export aliases
    ts.createExportDeclaration(
      undefined,
      undefined,
      ts.createNamedExports([
        ts.createExportSpecifier(interfaceName, "I" + shortName),
        ts.createExportSpecifier(className, shortName)
      ])
    )
  ]);
}

function createClassProperty(
  meta: IKubernetesMeta,
  node: ts.PropertyDeclaration,
  typeNode?: ts.TypeNode
) {
  const name = unquote(node.name.getText());
  let { initializer } = node;

  // Set default value of "apiVersion" and "kind" properties
  switch (name) {
    case "apiVersion":
      const apiVersion = getAPIVersion(meta);
      if (apiVersion) initializer = ts.createLiteral(apiVersion);
      break;

    case "kind":
      const kind = getAPIKind(meta);
      if (kind) initializer = ts.createLiteral(kind);
      break;
  }

  return ts.createProperty(
    node.decorators,
    node.modifiers,
    node.name,
    node.questionToken,
    typeNode,
    initializer
  );
}

function getAPIVersion({ group, version }: IKubernetesMeta) {
  if (!version) return;
  if (!group) return version;
  return `${group}/${version}`;
}

function getAPIKind(meta: IKubernetesMeta) {
  return meta.kind;
}

async function writeIndexFile(tree: IModelTree, name: string) {
  const outputPath = join(getOutputPath(name), "index.ts");
  const output = Object.keys(tree).reduce((acc: string[], key) => {
    if (typeof tree[key] === "string") {
      return [...acc, `export * from "./${key}";`];
    }

    return [
      ...acc,
      `import * as ${key} from "./${key}";`,
      `export { ${key} };`
    ];
  }, []);

  await writeFile(outputPath, output.join("\n"));
  console.log("Generated:", outputPath);
}

function getKubernetesGroupVersionKind(def: any) {
  const data = def["x-kubernetes-group-version-kind"];

  if (Array.isArray(data)) {
    return data[0];
  }

  return data;
}

async function main() {
  // Read OpenAPI spec
  const spec = JSON.parse(await readFile(argv.file, "utf8"));

  for (const key of Object.keys(spec.definitions)) {
    const className = getClassName(key);
    const modelPath = getModelPath(key);
    const def = spec.definitions[key];

    try {
      await access(modelPath);
      set(modelTree, trimPrefix(key, "io.k8s."), key);
      classMetaMap.set(className, {
        ...getKubernetesGroupVersionKind(def),
        name: key
      });
    } catch (err) {
      // ignore errors
    }
  }

  await walkModelTree(modelTree);
}

main().catch(err => {
  console.error(err);
});
