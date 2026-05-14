## @kubernetes-models/trivy-operator

[Trivy Operator](https://github.com/aquasecurity/trivy-operator) models.

## Installation

Install with npm.

```sh
npm install @kubernetes-models/trivy-operator
```

## Usage

```js
import { VulnerabilityReport } from "@kubernetes-models/trivy-operator/aquasecurity.github.io/v1alpha1/VulnerabilityReport";

// Create a new VulnerabilityReport
const report = new VulnerabilityReport({
  metadata: {
    name: "replicaset-nginx-6d4cf56db6-nginx",
    namespace: "default",
  },
  report: {
    updateTimestamp: "2024-01-01T00:00:00Z",
    scanner: {
      name: "Trivy",
      vendor: "Aqua Security",
      version: "0.50.0",
    },
    registry: { server: "index.docker.io" },
    artifact: { repository: "library/nginx", tag: "1.16" },
    os: { family: "debian", name: "10.3" },
    summary: {
      criticalCount: 0,
      highCount: 0,
      mediumCount: 0,
      lowCount: 0,
      unknownCount: 0,
      noneCount: 0,
    },
    vulnerabilities: [],
  },
});

// Validate against JSON schema
report.validate();
```

## License

MIT
