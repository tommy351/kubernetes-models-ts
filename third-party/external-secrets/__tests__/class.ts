import { ExternalSecret } from "../gen/external-secrets.io/v1beta1/ExternalSecret";

describe("ExternalSecret", () => {
  let secret: ExternalSecret;

  beforeEach(() => {
    secret = new ExternalSecret({
      metadata: {
        name: "example"
      },
      spec: {
        refreshInterval: "1h",
        secretStoreRef: {
          name: "secret-store-sample",
          kind: "SecretStore"
        },
        target: {
          name: "secret-to-be-created",
          creationPolicy: "Owner"
        },
        data: [
          {
            secretKey: "secret-key-to-be-managed",
            remoteRef: {
              key: "provider-key",
              version: "provider-key-version",
              property: "provider-key-property"
            }
          }
        ],
        dataFrom: [
          {
            extract: { key: "remote-key-in-the-provider" }
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(secret).toHaveProperty("apiVersion", "external-secrets.io/v1beta1");
  });

  it("should set kind", () => {
    expect(secret).toHaveProperty("kind", "ExternalSecret");
  });

  it("should set metadata", () => {
    expect(secret.metadata).toEqual({ name: "example" });
  });

  it("toJSON", () => {
    expect(secret.toJSON()).toEqual({
      apiVersion: "external-secrets.io/v1beta1",
      kind: "ExternalSecret",
      metadata: {
        name: "example"
      },
      spec: {
        refreshInterval: "1h",
        secretStoreRef: {
          name: "secret-store-sample",
          kind: "SecretStore"
        },
        target: {
          name: "secret-to-be-created",
          creationPolicy: "Owner"
        },
        data: [
          {
            secretKey: "secret-key-to-be-managed",
            remoteRef: {
              key: "provider-key",
              version: "provider-key-version",
              property: "provider-key-property"
            }
          }
        ],
        dataFrom: [
          {
            extract: { key: "remote-key-in-the-provider" }
          }
        ]
      }
    });
  });
});
