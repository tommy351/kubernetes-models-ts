export function set(obj: any, key: string, value: any) {
  const dot = key.indexOf(".");

  if (dot === -1) {
    obj[key] = value;
    return obj;
  }

  const firstKey = key.substring(0, dot);
  const restKey = key.substring(dot + 1);

  obj[firstKey] = obj[firstKey] || {};
  set(obj[firstKey], restKey, value);

  return obj;
}
