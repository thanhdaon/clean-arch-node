export type ID = {
  newId: () => string;
  isValidId: (id: string) => boolean;
};
