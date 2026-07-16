export class NotFoundError extends Error {
  resource: string;
  id: string;

  constructor(resource: string, id: string) {
    super(`${resource} no encontrado`);
    this.name = "NotFoundError";
    this.resource = resource;
    this.id = id;
  }
}
