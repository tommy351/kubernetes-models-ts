import { parentPort } from "node:worker_threads";
import { compileSchema, type CompileSchemaTask } from "./schema.js";

interface WorkerRequest extends CompileSchemaTask {
  id: number;
}

if (!parentPort) {
  throw new Error("Schema worker must run in a worker thread");
}

async function handleMessage({
  id,
  schema,
  refs,
}: WorkerRequest): Promise<void> {
  try {
    parentPort?.postMessage({
      id,
      code: await compileSchema(schema, refs),
    });
  } catch (err) {
    const error = err as Error;

    parentPort?.postMessage({
      id,
      error: {
        message: error.message,
        name: error.name,
        stack: error.stack,
      },
    });
  }
}

parentPort.on("message", (message: WorkerRequest) => {
  void handleMessage(message);
});
