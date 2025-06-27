import z from 'zod'

export const templateResponseSchema = z.object({
  data: z.unknown().refine(val => val !== undefined, {
    message: "dataフィールドは必須です"
  }),
  error: z
    .object({
      code: z.string(),
      messages: z.array(z.string()).optional(),
    })
    .optional(),
})

export type TemplateResponse = z.infer<typeof templateResponseSchema>
