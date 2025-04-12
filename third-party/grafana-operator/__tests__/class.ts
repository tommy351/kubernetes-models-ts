import { describe, it, expect, beforeEach } from "vitest";
import { Grafana as GrafanaV4 } from "../gen/integreatly.org/v1alpha1/Grafana";
import { GrafanaDashboard as GrafanaDashboardV4 } from "../gen/integreatly.org/v1alpha1/GrafanaDashboard";
import { GrafanaDataSource as GrafanaDataSourceV4 } from "../gen/integreatly.org/v1alpha1/GrafanaDataSource";

import { Grafana as GrafanaV5 } from "../gen/grafana.integreatly.org/v1beta1/Grafana";
import { GrafanaDashboard as GrafanaDashboardV5 } from "../gen/grafana.integreatly.org/v1beta1/GrafanaDashboard";
import { GrafanaDatasource as GrafanaDatasourceV5 } from "../gen/grafana.integreatly.org/v1beta1/GrafanaDatasource";

describe("GrafanaV4", () => {
  let grafana: GrafanaV4;

  beforeEach(() => {
    grafana = new GrafanaV4({
      metadata: { name: "example" },
      spec: {
        config: {
          log: {
            mode: "console",
            level: "error"
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(grafana).toHaveProperty("apiVersion", "integreatly.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(grafana).toHaveProperty("kind", "Grafana");
  });

  it("validate", () => {
    expect(() => grafana.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(grafana.toJSON()).toEqual({
      apiVersion: "integreatly.org/v1alpha1",
      kind: "Grafana",
      metadata: { name: "example" },
      spec: {
        config: {
          log: {
            mode: "console",
            level: "error"
          }
        }
      }
    });
  });
});

describe("GrafanaDashboardV4", () => {
  let dashboard: GrafanaDashboardV4;

  beforeEach(() => {
    dashboard = new GrafanaDashboardV4({
      metadata: { name: "example" },
      spec: {
        json: JSON.stringify({
          title: "Simple Dashboard"
        }),
        plugins: [{ name: "grafana-piechart-panel", version: "1.5.0" }]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(dashboard).toHaveProperty("apiVersion", "integreatly.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(dashboard).toHaveProperty("kind", "GrafanaDashboard");
  });

  it("validate", () => {
    expect(() => dashboard.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(dashboard.toJSON()).toEqual({
      apiVersion: "integreatly.org/v1alpha1",
      kind: "GrafanaDashboard",
      metadata: { name: "example" },
      spec: {
        json: JSON.stringify({
          title: "Simple Dashboard"
        }),
        plugins: [{ name: "grafana-piechart-panel", version: "1.5.0" }]
      }
    });
  });
});

describe("GrafanaDataSourceV4", () => {
  let source: GrafanaDataSourceV4;

  beforeEach(() => {
    source = new GrafanaDataSourceV4({
      metadata: { name: "example" },
      spec: {
        name: "middleware.yaml",
        datasources: [
          {
            name: "Prometheus",
            type: "prometheus",
            access: "proxy",
            url: "http://prometheus:9090",
            isDefault: true,
            version: 1,
            editable: true
          }
        ]
      }
    });
  });

  it("should set apiVersion", () => {
    expect(source).toHaveProperty("apiVersion", "integreatly.org/v1alpha1");
  });

  it("should set kind", () => {
    expect(source).toHaveProperty("kind", "GrafanaDataSource");
  });

  it("validate", () => {
    expect(() => source.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(source.toJSON()).toEqual({
      apiVersion: "integreatly.org/v1alpha1",
      kind: "GrafanaDataSource",
      metadata: { name: "example" },
      spec: {
        name: "middleware.yaml",
        datasources: [
          {
            name: "Prometheus",
            type: "prometheus",
            access: "proxy",
            url: "http://prometheus:9090",
            isDefault: true,
            version: 1,
            editable: true
          }
        ]
      }
    });
  });
});

describe("GrafanaV5", () => {
  let grafana: GrafanaV5;

  beforeEach(() => {
    grafana = new GrafanaV5({
      metadata: { name: "example" },
      spec: {
        config: {
          log: {
            mode: "console",
            level: "error"
          }
        }
      }
    });
  });

  it("should set apiVersion", () => {
    expect(grafana).toHaveProperty(
      "apiVersion",
      "grafana.integreatly.org/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(grafana).toHaveProperty("kind", "Grafana");
  });

  it("validate", () => {
    expect(() => grafana.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(grafana.toJSON()).toEqual({
      apiVersion: "grafana.integreatly.org/v1beta1",
      kind: "Grafana",
      metadata: { name: "example" },
      spec: {
        config: {
          log: {
            mode: "console",
            level: "error"
          }
        }
      }
    });
  });
});

describe("GrafanaDashboardV5", () => {
  let dashboard: GrafanaDashboardV5;

  beforeEach(() => {
    dashboard = new GrafanaDashboardV5({
      metadata: { name: "example" },
      spec: {
        json: JSON.stringify({
          title: "Simple Dashboard"
        }),
        plugins: [{ name: "grafana-piechart-panel", version: "1.5.0" }],
        instanceSelector: {}
      }
    });
  });

  it("should set apiVersion", () => {
    expect(dashboard).toHaveProperty(
      "apiVersion",
      "grafana.integreatly.org/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(dashboard).toHaveProperty("kind", "GrafanaDashboard");
  });

  it("validate", () => {
    expect(() => dashboard.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(dashboard.toJSON()).toEqual({
      apiVersion: "grafana.integreatly.org/v1beta1",
      kind: "GrafanaDashboard",
      metadata: { name: "example" },
      spec: {
        json: JSON.stringify({
          title: "Simple Dashboard"
        }),
        plugins: [{ name: "grafana-piechart-panel", version: "1.5.0" }],
        instanceSelector: {}
      }
    });
  });
});

describe("GrafanaDatasourceV5", () => {
  let source: GrafanaDatasourceV5;

  beforeEach(() => {
    source = new GrafanaDatasourceV5({
      metadata: { name: "example" },
      spec: {
        datasource: {
          name: "Prometheus",
          type: "prometheus",
          access: "proxy",
          url: "http://prometheus:9090",
          isDefault: true,
          editable: true
        },
        instanceSelector: {}
      }
    });
  });

  it("should set apiVersion", () => {
    expect(source).toHaveProperty(
      "apiVersion",
      "grafana.integreatly.org/v1beta1"
    );
  });

  it("should set kind", () => {
    expect(source).toHaveProperty("kind", "GrafanaDatasource");
  });

  it("validate", () => {
    expect(() => source.validate()).not.toThrow();
  });

  it("toJSON", () => {
    expect(source.toJSON()).toEqual({
      apiVersion: "grafana.integreatly.org/v1beta1",
      kind: "GrafanaDatasource",
      metadata: { name: "example" },
      spec: {
        datasource: {
          name: "Prometheus",
          type: "prometheus",
          access: "proxy",
          url: "http://prometheus:9090",
          isDefault: true,
          editable: true
        },
        instanceSelector: {}
      }
    });
  });
});
