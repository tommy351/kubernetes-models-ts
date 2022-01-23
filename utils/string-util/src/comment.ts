export function formatComment(
  content: string,
  props: { [key: string]: boolean } = {}
): string {
  let output = "/**\n";

  for (const line of content.split("\n")) {
    output +=
      " * " + line.replace(/\*/g, "\\*").replace(/\*\//g, "*\\/") + "\n";
  }

  for (const key of Object.keys(props)) {
    if (props[key]) output += ` * @${key}\n`;
  }

  output += " */\n";
  return output;
}

export function stripComment(s: string): string {
  return s.replace(/\/\*{2}[\s\S]+?\*\//g, "");
}
