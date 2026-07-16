import { randomUUID } from "crypto";

export class UuidGenerator {
  generate(): string {
    return randomUUID();
  }
}
