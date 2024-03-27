import { describe, it, expect, beforeEach } from "vitest";
import { Grafana } from "../gen/grafana.integreatly.org/v1beta1/Grafana";
import { GrafanaDashboard } from "../gen/grafana.integreatly.org/v1beta1/GrafanaDashboard";
import { GrafanaDatasource } from "../gen/grafana.integreatly.org/v1beta1/GrafanaDatasource";

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

describe("GrafanaDashboard", () => {
  let dashboard: GrafanaDashboard;

  beforeEach(() => {
    dashboard = new GrafanaDashboard({
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

describe("GrafanaDataSource", () => {
  let source: GrafanaDatasource;

  beforeEach(() => {
    source = new GrafanaDatasource({
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
