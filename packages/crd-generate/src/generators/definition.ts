import {
  Definition,
  generateImports,
  generateInterface,
  Generator,
  getAPIVersion,
  GroupVersionKind,
  Import,
  OutputFile,
  transformSchema
} from "@kubernetes-models/generate";
import { formatComment, trimSuffix } from "@kubernetes-models/string-util";

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
  let classContent = generateInterface(def.schema, {
    getFieldType(key) {
      if (key.length === 1) {
        return `${interfaceName}${JSON.stringify(key)}`;
      }
    }
  });
  let comment = "";

  classContent =
    trimSuffix(classContent, "}") +
    `
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

  imports.push({
    name: "IObjectMeta",
    path: "kubernetes-models/apimachinery/pkg/apis/meta/v1/ObjectMeta"
  });

  imports.push({
    name: "addSchema",
    path: "kubernetes-models/z-schemas/IoK8sApimachineryPkgApisMetaV1ObjectMeta"
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

  const schema = transformSchema(def.schema);

  return {
    path: `${apiVersion}/${className}.ts`,
    content: `${generateImports(imports)}

const schemaId = ${JSON.stringify(def.schemaId)};
const schema = ${JSON.stringify(schema, null, "  ")};

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
