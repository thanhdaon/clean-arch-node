import type { ZodSchema } from "~/ports/http/types";

export const jsonContent = <T extends ZodSchema>(
  schema: T,
  description: string = ""
) => {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
};

export const jsonContentRequired = <T extends ZodSchema>(
  schema: T,
  description: string = ""
) => {
  return {
    ...jsonContent(schema, description),
    required: true,
  };
};
