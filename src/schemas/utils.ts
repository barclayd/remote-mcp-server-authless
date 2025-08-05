import { z } from 'zod';

export const nullishObject = <T extends z.ZodRawShape>(shape: T) => {
  const nullishShape = {} as {
    [K in keyof T]: z.ZodOptional<z.ZodNullable<T[K]>>;
  };

  for (const key in shape) {
    nullishShape[key] = shape[key].nullish();
  }

  return z.object(nullishShape);
};
