import { z } from 'zod'

export const addSchema = z.object({
  color: z.string().min(1, 'Provide Color Hex Code Please'),
  quote: z
    .string()
    .min(5, 'Description must be at least 5 characters'),
})
