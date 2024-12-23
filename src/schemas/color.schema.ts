import { z } from "zod";

export const addSchema = z.object({
  color: z
    .string()
    .min(1, 'Color is required') ,
  quote: z.string().min(1, 'Quote is required'),
})