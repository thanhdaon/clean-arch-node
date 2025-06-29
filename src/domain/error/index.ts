export class NotFoundError extends Error {
  constructor({ id, entity }: { id: string; entity: string }) {
    super(`${entity} not found: ${id}`);
  }
}

export class BadRequestError extends Error {
  constructor(message: string) {
    super(message);
  }
}
