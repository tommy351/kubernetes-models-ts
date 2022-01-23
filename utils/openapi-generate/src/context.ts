import { Definition, getAPIVersion } from "@kubernetes-models/generate";
import { trimPrefix } from "@kubernetes-models/string-util";
import { identity } from "lodash";
import { getShortClassName } from "./string";

function getIdPrefix(id: string): string {
  return id.split(".").slice(0, -1).join(".");
}

export interface Context {
  getDefinitionPath(id: string): string;
  externalAPIMachinery?: boolean;
}

export interface ContextOptions {
  rewriteDefinitionPath?(path: string): string;
  externalAPIMachinery?: boolean;
}

export function buildContext(
  definitions: readonly Definition[],
  { rewriteDefinitionPath = identity, externalAPIMachinery }: ContextOptions
): Context {
  const apiVersionMap = new Map<string, string>();

  for (const def of definitions) {
    if (def.gvk?.length === 1) {
      const idPrefix = getIdPrefix(def.schemaId);
      const apiVersion = getAPIVersion(def.gvk?.[0]);
      const existingValue = apiVersionMap.get(idPrefix);

      if (existingValue && existingValue !== apiVersion) {
        throw new Error(
          `API version of "${idPrefix}" has already been set as ${existingValue}, but the definition ID "${def.schemaId}" has different API version "${apiVersion}"`
        );
      }

      apiVersionMap.set(idPrefix, apiVersion);
    }
  }

  return {
    externalAPIMachinery,
    getDefinitionPath(id) {
      const apiVersion = apiVersionMap.get(getIdPrefix(id));

      if (apiVersion) {
        return `${apiVersion}/${getShortClassName(id)}.ts`;
      }

      const path = trimPrefix(id, "io.k8s.").split(".").join("/") + ".ts";

      return rewriteDefinitionPath(path);
    }
  };
}
