import { validate } from "@kubernetes-models/validate";
import { TypeMeta } from "./meta";

const SCHEMA_ID = Symbol("SCHEMA_ID");
const ADD_SCHEMA = Symbol("ADD_SCHEMA");

export type ModelData<T> = T extends TypeMeta ? Omit<T, keyof TypeMeta> : T;

export type ModelConstructor<T> = new (data?: ModelData<T>) => Model<T>;

export class Model<T> {
  /** @internal */
  private [SCHEMA_ID]?: string;

  /** @internal */
  private [ADD_SCHEMA]?: () => void;

  public constructor(data?: ModelData<T>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public toJSON(): any {
    return this;
  }

  public validate(): void {
    const id = this[SCHEMA_ID];
    if (!id) return;

    if (typeof this[ADD_SCHEMA] === "function") {
      this[ADD_SCHEMA]();
    }

    validate(id, this);
  }
}

export function setSchema<T>(
  ctor: ModelConstructor<T>,
  id: string,
  addSchema: () => void
): void {
  ctor.prototype[SCHEMA_ID] = id;
  ctor.prototype[ADD_SCHEMA] = addSchema;
}
