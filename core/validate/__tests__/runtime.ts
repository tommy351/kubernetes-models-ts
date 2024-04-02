import execa from "execa";
import { fileURLToPath } from "url";
import { describe, it, expect } from "vitest";
import equal from "../runtime/equal.js";
import { parseJson } from "../runtime/parseJson.js";
import quote from "../runtime/quote.js";
import Re2 from "../runtime/re2.js";
import RealRe2 from "re2";
import timestamp from "../runtime/timestamp.js";
import ucs2length from "../runtime/ucs2length.js";
import uri from "../runtime/uri.js";

// We import the runtime files from another Node.js process because vitest will
// try to resolve ESM imports, and we can't test the actual behavior of runtime
// files in Node.js ESM environment.
async function execFixture(name: string): Promise<unknown> {
  const { stdout } = await execa.node(
    fileURLToPath(new URL(`../__fixtures__/${name}.mjs`, import.meta.url))
  );
  return JSON.parse(stdout);
}

describe("equal", () => {
  it("CJS", () => {
    expect(equal(1, 1)).toBe(true);
    expect(equal(1, 2)).toBe(false);
  });

  it("ESM", async () => {
    const result = await execFixture("equal");
    expect(result).toEqual([true, false]);
  });
});

describe("parseJson", () => {
  it("CJS", () => {
    const data = { foo: "bar" };
    expect(parseJson(JSON.stringify(data), 0)).toEqual(data);
  });

  it("ESM", async () => {
    const result = await execFixture("parseJson");
    expect(result).toEqual([{ foo: "bar" }, 123, "foo"]);
  });
});

describe("quote", () => {
  it("CJS", () => {
    expect(quote("foo")).toBe(`"foo"`);
  });

  it("ESM", async () => {
    const result = await execFixture("quote");
    expect(result).toBe(`"foo"`);
  });
});

describe("re2", () => {
  it("CJS", () => {
    expect(new Re2("foo")).toEqual(new RealRe2("foo"));
  });

  it("ESM", async () => {
    const result = await execFixture("re2");
    expect(result).toBe("foo");
  });
});

describe("timestamp", () => {
  it("CJS", () => {
    expect(timestamp("2024-01-01T00:00:00Z", false)).toBe(true);
  });

  it("ESM", async () => {
    const result = await execFixture("timestamp");
    expect(result).toBe(true);
  });
});

describe("ucs2length", () => {
  it("CJS", () => {
    expect(ucs2length("foo")).toBe(3);
    expect(ucs2length("💩")).toBe(1);
  });

  it("ESM", async () => {
    const result = await execFixture("ucs2length");
    expect(result).toEqual([3, 1]);
  });
});

describe("uri", () => {
  it("cjs", () => {
    expect(uri.parse("https://example.com/foo")).toEqual({
      host: "example.com",
      path: "/foo",
      reference: "absolute",
      scheme: "https"
    });
  });

  it("ESM", async () => {
    const result = await execFixture("uri");
    expect(result).toEqual({
      host: "example.com",
      path: "/foo",
      reference: "absolute",
      scheme: "https"
    });
  });
});
