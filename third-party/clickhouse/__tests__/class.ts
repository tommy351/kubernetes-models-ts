import { describe, it, expect, beforeEach } from "vitest";
import { ClickHouseInstallation } from "../gen/clickhouse.altinity.com/v1/ClickHouseInstallation";

describe("ClickHouseInstallation", () => {
  let installation: ClickHouseInstallation;

  beforeEach(() => {
    installation = new ClickHouseInstallation({
      metadata: {
        name: "simple-01"
      },
      spec: {
        configuration: {
          clusters: [{ name: "simple" }],
          users: {
            "test_user/password_sha256_hex":
              "10a6e6cc8311a3e2bcc09bf6c199adecd5dd59408c343e926b129c4914f3cb01",
            "test_user/networks/ip": ["0.0.0.0/0"]
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(installation).toHaveProperty(
      "apiVersion",
      "clickhouse.altinity.com/v1"
    );
  });

  it("should set kind", () => {
    expect(installation).toHaveProperty("kind", "ClickHouseInstallation");
  });

  it("validate", () => {
    expect(() => installation.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(installation.toJSON()).toEqual({
      apiVersion: "clickhouse.altinity.com/v1",
      kind: "ClickHouseInstallation",
      metadata: {
        name: "simple-01"
      },
      spec: {
        configuration: {
          clusters: [{ name: "simple" }],
          users: {
            "test_user/password_sha256_hex":
              "10a6e6cc8311a3e2bcc09bf6c199adecd5dd59408c343e926b129c4914f3cb01",
            "test_user/networks/ip": ["0.0.0.0/0"]
          }
        }
      }
    });
  });
});
