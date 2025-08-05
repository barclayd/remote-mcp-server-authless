import { z } from 'zod';

export const nullableObject = <T extends z.ZodRawShape>(shape: T) => {
  const nullableShape = {} as { [K in keyof T]: z.ZodNullable<T[K]> };

  for (const key in shape) {
    nullableShape[key] = shape[key].nullable();
  }

  return z.object(nullableShape);
};
