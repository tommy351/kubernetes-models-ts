const QUOTES = `'"`;

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

export function unquote(s: string): string {
  const first = s[0];
  if (QUOTES.indexOf(first) === -1) return s;
  if (s[s.length - 1] !== first) return s;

  return s.substring(1, s.length - 1);
}

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
