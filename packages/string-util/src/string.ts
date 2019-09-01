export function upperFirst(s: string): string {
  return s[0].toUpperCase() + s.substring(1);
}

export function lowerFirst(s: string): string {
  return s[0].toLowerCase() + s.substring(1);
}

export function camelCase(input: string, chars: string): string {
  let output = "";
  let upper = false;

  for (const s of input) {
    if (chars.includes(s)) {
      upper = true;
    } else {
      output += upper ? s.toUpperCase() : s;
      upper = false;
    }
  }

  return output;
}

export function trimPrefix(s: string, prefix: string): string {
  if (s.substring(0, prefix.length) === prefix) {
    return s.substring(prefix.length);
  }

  return s;
}

export function trimSuffix(s: string, suffix: string): string {
  const end = s.length - suffix.length;

  if (s.substring(end) === suffix) {
    return s.substring(0, end);
  }

  return s;
}
