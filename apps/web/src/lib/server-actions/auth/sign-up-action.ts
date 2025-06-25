import { writeFetch } from '@/lib/utils/fetch-utils'
import { redirect } from 'next/navigation'
import type { ActionState } from '../../../types/form'
import {
  type SignUpFormValues,
  signUpSchema,
} from '../../schemas/auth/sign-up-schema'

/**
 * ユーザー登録サーバーアクション
 * フォームデータを受け取り、バックエンドAPIを呼び出してユーザーを作成します
 */
export async function signUpAction(
  _prevState: ActionState<void, SignUpFormValues> | undefined,
  formData: FormData,
): Promise<ActionState<void, SignUpFormValues>> {
  try {
    // フォームデータを取得
    const rawData = {
      name: formData.get('name')?.toString() || '',
      email: formData.get('email')?.toString() || '',
      password: formData.get('password')?.toString() || '',
      confirmPassword: formData.get('confirmPassword')?.toString() || '',
    }

    // バリデーション実行
    const parseResult = signUpSchema.safeParse(rawData)

    if (!parseResult.success) {
      return {
        success: false,
        error: {
          message: '入力内容に誤りがあります',
          fields: parseResult.error.flatten().fieldErrors,
        },
        values: rawData,
      }
    }

    const validatedData = parseResult.data

    // バックエンドAPIを呼び出し（サーバーサイド用環境変数を使用）
    await writeFetch<
      Omit<SignUpFormValues, 'confirmPassword'>,
      { token: string }
    >({
      path: '/auth/signup',
      method: 'POST',
      inputBody: {
        name: validatedData.name,
        email: validatedData.email,
        password: validatedData.password,
      },
    })
  } catch (error) {
    console.error('Sign up action error:', error)
    return {
      success: false,
      error: {
        message:
          'システムエラーが発生しました。しばらく時間をおいて再度お試しください。',
      },
      values: {
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        confirmPassword: formData.get('confirmPassword') as string,
      },
    }
  }

  redirect('/sign-in?success=true')
}
