import timestamp from "../runtime/timestamp.mjs";
process.stdout.write(JSON.stringify(timestamp("2024-01-01T00:00:00Z", false)));
