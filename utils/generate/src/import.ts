export interface Import {
  name: string;
  alias?: string;
  path: string;
}

export function generateImports(imports: readonly Import[]): string {
  const importMap = new Map<string, Set<string>>();

  for (const { path, name, alias } of imports) {
    let names = importMap.get(path);

    if (!names) {
      names = new Set<string>();
      importMap.set(path, names);
    }

    if (alias) {
      names.add(`${name} as ${alias}`);
    } else {
      names.add(name);
    }
  }

  return [...importMap.entries()]
    .map(
      ([path, names]) =>
        `import { ${[...names].join(", ")} } from ${JSON.stringify(path)};`
    )
    .join("\n");
}
