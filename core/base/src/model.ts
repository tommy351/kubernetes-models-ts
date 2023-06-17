import { TypeMeta } from "./meta";

export type ModelData<T> = T extends TypeMeta ? Omit<T, keyof TypeMeta> : T;

export type ModelConstructor<T> = new (data?: ModelData<T>) => Model<T>;

export abstract class Model<T> {
  public constructor(data?: ModelData<T>) {
    if (data) {
      Object.assign(this, data);
    }
  }

  public toJSON(): any {
    return { ...this };
  }

  public abstract validate(): void;
}
