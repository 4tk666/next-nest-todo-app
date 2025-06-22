import { z } from 'zod'

/**
 * ユーザー作成用のZodスキーマ
 * メールアドレス、パスワード、名前（オプション）のバリデーションを行います
 */
export const createUserSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須です' })
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),

  password: z
    .string({ required_error: 'パスワードは必須です' })
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(255, 'パスワードは255文字以内で入力してください')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'パスワードは英大文字、英小文字、数字をそれぞれ1文字以上含む必要があります',
    ),

  name: z.string().max(255, '名前は255文字以内で入力してください').optional(),
})

/**
 * createUserSchemaから推論されるTypeScript型
 */
export type CreateUserDto = z.infer<typeof createUserSchema>
