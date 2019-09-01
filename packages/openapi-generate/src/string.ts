import {
  upperFirst,
  camelCase,
  trimPrefix
} from "@kubernetes-models/string-util";

export function getClassName(s: string): string {
  return upperFirst(camelCase(s, ".-"));
}

export function getInterfaceName(s: string): string {
  return "I" + getClassName(s);
}

export function getShortClassName(s: string): string {
  const arr = s.split(".");
  return arr[arr.length - 1];
}

export function getShortInterfaceName(s: string): string {
  return "I" + getShortClassName(s);
}

export function trimRefPrefix(ref: string): string {
  return trimPrefix(ref, "#/definitions/");
}
