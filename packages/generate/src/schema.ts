export function collectRefs(data: any): readonly string[] {
  const refs = Object.keys(data).map((key) => {
    const val = data[key];

    if (key === "$ref" && typeof val === "string") {
      return [val];
    }

    if (typeof val === "object" && !Array.isArray(val)) {
      return collectRefs(val);
    }

    return [];
  });

  return refs.reduce((acc, x) => acc.concat(x), [] as string[]);
}
