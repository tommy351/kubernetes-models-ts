import { basename, dirname, extname, join, relative, resolve } from "path";
import * as ts from "typescript";
import yargs from "yargs";
import { access, readFile, writeFile } from "./fs";
import { set } from "./object";
import { camelCase, trimPrefix, unquote, upperFirst } from "./string";
import { hasModifier } from "./ts";

interface IModelTree {
  [key: string]: IModelTree | string;
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
const classNameMap = new Map<string, string>();

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

  const moduleName = classNameMap.get(upperFirst(trimPrefix(modulePath, "./")));
  if (!moduleName) return node;

  const sourceName = classNameMap.get(
    upperFirst(basename(sf.fileName, extname(sf.fileName)))
  );
  if (!sourceName) return node;

  const sourcePath = getOutputPath(sourceName);
  const targetPath = getOutputPath(moduleName);
  let relativePath = relative(dirname(sourcePath), targetPath);

  if (!relativePath.startsWith(".")) {
    relativePath = "./" + relativePath;
  }

  return ts.createImportDeclaration(
    node.decorators,
    node.modifiers,
    node.importClause,
    ts.createLiteral(relativePath)
  );
}

function transformClass(
  ctx: ts.TransformationContext,
  sf: ts.SourceFile,
  node: ts.ClassDeclaration
) {
  const className = node.name && node.name.getText();
  if (!className) return;

  const name = classNameMap.get(className);
  if (!name) return;

  const shortName = name.split(".").pop();
  if (!shortName) return;

  const classMembers: ts.ClassElement[] = [];
  const interfaceMembers: ts.TypeElement[] = [];
  const interfaceName = "I" + className;

  // Pick properties from the class
  ts.forEachChild(node, n => {
    if (!ts.isPropertyDeclaration(n)) return;
    if (hasModifier(n, ts.SyntaxKind.StaticKeyword)) return;

    classMembers.push(n);

    interfaceMembers.push(
      ts.createPropertySignature(
        n.modifiers,
        n.name,
        n.questionToken,
        n.type,
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

              return ts.createExpressionStatement(
                ts.createBinary(
                  ts.createElementAccess(ts.createThis(), memberName),
                  ts.SyntaxKind.EqualsToken,
                  ts.createElementAccess(classCtorData, memberName)
                )
              );
            })
          )
        )
      ])
    )
  );

  // Add toJSON method
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
        ts.createReturn(
          ts.createObjectLiteral(
            interfaceMembers.map(member => {
              const memberName = ts.createStringLiteral(
                unquote((member.name && member.name.getText()) as string)
              );

              return ts.createPropertyAssignment(
                memberName,
                ts.createElementAccess(ts.createThis(), memberName)
              );
            })
          )
        )
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

async function writeIndexFile(tree: IModelTree, name: string) {
  const outputPath = join(getOutputPath(name), "index.ts");
  const output = Object.keys(tree).reduce((acc: string[], key) => {
    if (typeof tree[key] === "string") {
      return [...acc, `export * from './${key}';`];
    }

    return [
      ...acc,
      `import * as ${key} from './${key}';`,
      `export { ${key} };`
    ];
  }, []);

  await writeFile(outputPath, output.join("\n"));
  console.log("Generated:", outputPath);
}

async function main() {
  // Read OpenAPI spec
  const spec = JSON.parse(await readFile(argv.file, "utf8"));

  for (const key of Object.keys(spec.definitions)) {
    const className = getClassName(key);
    const modelPath = getModelPath(key);

    try {
      await access(modelPath);
      set(modelTree, trimPrefix(key, "io.k8s."), key);
      classNameMap.set(className, key);
    } catch (err) {
      // ignore errors
    }
  }

  await walkModelTree(modelTree);
}

main().catch(err => {
  console.error(err);
});
