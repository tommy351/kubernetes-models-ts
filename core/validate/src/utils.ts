export function getDefault<T>(value: any): T {
  return value.__esModule ? value.default : value;
}
