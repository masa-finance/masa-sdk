import type { MasaInterface } from "./masa-interface";

export abstract class MasaBase {
  public constructor(protected readonly masa: MasaInterface) {}
}
