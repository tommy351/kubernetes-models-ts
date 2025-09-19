# @kubernetes-models/clickhouse

[ClickHouse Kubernetes Operator](https://github.com/Altinity/clickhouse-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/clickhouse
```

## Usage

```js
import { ClickHouseInstallation } from "@kubernetes-models/clickhouse/clickhouse.altinity.com/v1/ClickHouseInstallation";

// Create a new installation
const installation = new ClickHouseInstallation({
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

// Validate against JSON schema
installation.validate();
```

## License

MIT
