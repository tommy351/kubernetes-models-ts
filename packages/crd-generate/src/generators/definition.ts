import {
  Definition,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  GroupVersionKind,
  Import,
  OutputFile
} from "@kubernetes-models/generate";
import { formatComment } from "@kubernetes-models/string-util";

function getFieldType(key: string[]): string | undefined {
  if (key.length === 1 && key[0] === "metadata") {
    return "IObjectMeta";
  }
}

function generateDefinition(
  gvk: GroupVersionKind,
  def: Definition
): OutputFile {
  const apiVersion = getAPIVersion(gvk);
  const className = gvk.kind;
  const interfaceName = `I${className}`;
  const imports: Import[] = [];
  const interfaceContent = generateInterface(def.schema, {
    includeDescription: true,
    getFieldType
  });
  const { properties = {}, required = [] } = def.schema;
  let classContent = "{\n";

  for (const key of Object.keys(properties)) {
    const modifier = required.includes(key) ? "" : "?";
    const quotedKey = JSON.stringify(key);

    classContent += `${quotedKey}${modifier}: ${interfaceName}[${quotedKey}];\n`;
  }

  classContent += `
static apiVersion: ${interfaceName}["apiVersion"] = ${JSON.stringify(
    apiVersion
  )};
static kind: ${interfaceName}["kind"] = ${JSON.stringify(gvk.kind)};

constructor(data?: ModelData<${interfaceName}>) {
  super({
    apiVersion: ${className}.apiVersion,
    kind: ${className}.kind,
    ...data
  } as ${interfaceName});
}
}
`;
  let comment = "";

  imports.push({
    name: "IObjectMeta",
    path: "kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta"
  });

  imports.push({
    name: "addSchema",
    path: "kubernetes-models/_schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta"
  });

  imports.push({
    name: "Model",
    path: "@kubernetes-models/base"
  });

  imports.push({
    name: "ModelData",
    path: "@kubernetes-models/base"
  });

  imports.push({
    name: "register",
    path: "@kubernetes-models/validate"
  });

  if (def.schema.description) {
    comment = formatComment(def.schema.description, {
      deprecated: /^deprecated/i.test(def.schema.description)
    });
  }

  return {
    path: `${apiVersion}/${className}.ts`,
    content: `${generateImports(imports)}

const schemaId = ${JSON.stringify(def.schemaId)};
const schema = ${JSON.stringify(def.schema, null, "  ")};

${comment}export interface ${interfaceName} ${interfaceContent}

${comment}export class ${className} extends Model<${interfaceName}> implements ${interfaceName} ${classContent}

Model.setSchema(${className}, schemaId, () => {
  addSchema();
  register(schemaId, schema);
});
`
  };
}

const generateDefinitions: Generator = async (definitions) => {
  const output: OutputFile[] = [];

  for (const def of definitions) {
    const gvks = def.gvk;

    if (gvks && gvks.length) {
      output.push(generateDefinition(gvks[0], def));
    }
  }

  return output;
};

export default generateDefinitions;
