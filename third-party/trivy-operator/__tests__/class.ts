import { describe, it, expect } from "vitest";
import { VulnerabilityReport } from "../gen/aquasecurity.github.io/v1alpha1/VulnerabilityReport.js";
import { ConfigAuditReport } from "../gen/aquasecurity.github.io/v1alpha1/ConfigAuditReport.js";

describe("VulnerabilityReport", () => {
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
      registry: {
        server: "index.docker.io",
      },
      artifact: {
        repository: "library/nginx",
        tag: "1.16",
      },
      os: {
        family: "debian",
        name: "10.3",
      },
      summary: {
        criticalCount: 1,
        highCount: 2,
        mediumCount: 3,
        lowCount: 4,
        unknownCount: 0,
        noneCount: 0,
      },
      vulnerabilities: [
        {
          vulnerabilityID: "CVE-2020-1234",
          resource: "openssl",
          installedVersion: "1.1.1d-0+deb10u3",
          fixedVersion: "1.1.1d-0+deb10u4",
          publishedDate: "2020-05-01T00:00:00Z",
          lastModifiedDate: "2020-05-02T00:00:00Z",
          severity: "HIGH",
          title: "Sample vulnerability",
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(report).toHaveProperty(
      "apiVersion",
      "aquasecurity.github.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(report).toHaveProperty("kind", "VulnerabilityReport");
  });

  it("validate", () => {
    expect(() => report.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(report.toJSON()).toEqual({
      apiVersion: "aquasecurity.github.io/v1alpha1",
      kind: "VulnerabilityReport",
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
        registry: {
          server: "index.docker.io",
        },
        artifact: {
          repository: "library/nginx",
          tag: "1.16",
        },
        os: {
          family: "debian",
          name: "10.3",
        },
        summary: {
          criticalCount: 1,
          highCount: 2,
          mediumCount: 3,
          lowCount: 4,
          unknownCount: 0,
          noneCount: 0,
        },
        vulnerabilities: [
          {
            vulnerabilityID: "CVE-2020-1234",
            resource: "openssl",
            installedVersion: "1.1.1d-0+deb10u3",
            fixedVersion: "1.1.1d-0+deb10u4",
            publishedDate: "2020-05-01T00:00:00Z",
            lastModifiedDate: "2020-05-02T00:00:00Z",
            severity: "HIGH",
            title: "Sample vulnerability",
          },
        ],
      },
    });
  });
});

describe("ConfigAuditReport", () => {
  const report = new ConfigAuditReport({
    metadata: {
      name: "replicaset-nginx-6d4cf56db6",
      namespace: "default",
    },
    report: {
      updateTimestamp: "2024-01-01T00:00:00Z",
      scanner: {
        name: "Trivy",
        vendor: "Aqua Security",
        version: "0.50.0",
      },
      summary: {
        criticalCount: 0,
        highCount: 1,
        mediumCount: 0,
        lowCount: 2,
      },
      checks: [
        {
          checkID: "KSV001",
          title: "Process can elevate its own privileges",
          severity: "MEDIUM",
          category: "Kubernetes Security Check",
          success: false,
          messages: ["Container should not allow privilege escalation"],
        },
      ],
    },
  });

  it("should set apiVersion", () => {
    expect(report).toHaveProperty(
      "apiVersion",
      "aquasecurity.github.io/v1alpha1",
    );
  });

  it("should set kind", () => {
    expect(report).toHaveProperty("kind", "ConfigAuditReport");
  });

  it("validate", () => {
    expect(() => report.validate()).not.toThrow();
  });
});
