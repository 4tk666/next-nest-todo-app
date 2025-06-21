import { z } from 'zod'

/**
 * ユーザーログイン用のZodスキーマ
 * メールアドレスとパスワードのバリデーションを行います
 */
export const signInUserSchema = z.object({
  email: z
    .string({ required_error: 'メールアドレスは必須です' })
    .email('正しいメールアドレスを入力してください')
    .max(255, 'メールアドレスは255文字以内で入力してください'),

  password: z
    .string({ required_error: 'パスワードは必須です' })
    .min(1, 'パスワードを入力してください')
    .max(255, 'パスワードは255文字以内で入力してください'),
})

/**
 * loginUserSchemaから推論されるTypeScript型
 */
export type SignInUserDto = z.infer<typeof signInUserSchema>
