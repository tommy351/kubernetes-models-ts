export function exportDefault<T>(mod: T): T {
  return (mod as any).default ?? mod;
}
