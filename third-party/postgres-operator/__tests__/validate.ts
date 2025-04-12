import { describe, it, expect } from "vitest";
import { postgresql } from "../gen/acid.zalan.do/v1/postgresql";

describe("postgresql", () => {
  describe("JavaScript RegExp", () => {
    function createManifest(value: string): postgresql {
      return new postgresql({
        spec: {
          teamId: "",
          volume: {
            size: "1Gi"
          },
          numberOfInstances: 2,
          users: {},
          databases: {},
          postgresql: { version: "16" },
          resources: {
            requests: { cpu: value }
          }
        }
      });
    }

    it("valid", () => {
      const value = createManifest("100m");
      expect(() => value.validate()).not.toThrow();
    });

    it("invalid", () => {
      const value = createManifest("foo");
      expect(() => value.validate()).toThrow(
        `data/spec/resources/requests/cpu must match pattern "^(\\d+m|\\d+(\\.\\d{1,3})?)$"`
      );
    });
  });

  describe("RE2", () => {
    function createManifest(value: string): postgresql {
      return new postgresql({
        spec: {
          teamId: "",
          volume: {
            size: "1Gi"
          },
          numberOfInstances: 2,
          users: {},
          databases: {},
          postgresql: { version: "16" },
          maintenanceWindows: [value]
        }
      });
    }

    it("valid", () => {
      const value = createManifest("01:00-06:00");
      expect(() => value.validate()).not.toThrow();
    });

    it("invalid", () => {
      const value = createManifest("foo");
      expect(() => value.validate()).toThrow(
        `data/spec/maintenanceWindows/0 must match pattern "^\\ *((Mon|Tue|Wed|Thu|Fri|Sat|Sun):(2[0-3]|[01]?\\d):([0-5]?\\d)|(2[0-3]|[01]?\\d):([0-5]?\\d))-((Mon|Tue|Wed|Thu|Fri|Sat|Sun):(2[0-3]|[01]?\\d):([0-5]?\\d)|(2[0-3]|[01]?\\d):([0-5]?\\d))\\ *$"`
      );
    });
  });
});
