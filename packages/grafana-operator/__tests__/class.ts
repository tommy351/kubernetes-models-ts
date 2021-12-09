import { Grafana } from "../gen/integreatly.org/v1alpha1/Grafana";
import { GrafanaDashboard } from "../gen/integreatly.org/v1alpha1/GrafanaDashboard";
import { GrafanaDataSource } from "../gen/integreatly.org/v1alpha1/GrafanaDataSource";

describe("Grafana", () => {
  let grafana: Grafana;

  beforeEach(() => {
    grafana = new Grafana({
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

describe("GrafanaDashboard", () => {
  let dashboard: GrafanaDashboard;

  beforeEach(() => {
    dashboard = new GrafanaDashboard({
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

describe("GrafanaDataSource", () => {
  let source: GrafanaDataSource;

  beforeEach(() => {
    source = new GrafanaDataSource({
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
