'use server'

import {
  type SignInFormValues,
  signInSchema,
} from '@/lib/schemas/auth/sign-in-schema'
import { publicFetch } from '@/lib/utils/fetch/public-fetch'
import type { ActionState } from '@/types/form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

/**
 * サインインのサーバーアクション
 * APIを呼び出してユーザー認証を行い、JWTトークンをクッキーに設定します
 */
export async function signInAction(
  formData: FormData,
): Promise<ActionState<void, SignInFormValues>> {
  // FormDataから値を取得
  const rawData = {
    email: formData.get('email')?.toString() || '',
    password: formData.get('password')?.toString() || '',
  }

  // バリデーション
  const validationResult = signInSchema.safeParse(rawData)
  if (!validationResult.success) {
    return {
      success: false,
      error: {
        message: '入力内容に誤りがあります',
        fields: validationResult.error.flatten().fieldErrors,
      },
      values: rawData,
    }
  }

  try {
    // バックエンドAPIを呼び出し（サーバーサイド用環境変数を使用）
    const response = await publicFetch<SignInFormValues, { token: string }>({
      path: '/auth/signin',
      method: 'POST',
      inputBody: {
        email: validationResult.data.email,
        password: validationResult.data.password,
      },
      validateOutput: z.object({
        token: z.string(),
      }),
    })

    // JWTトークンをクッキーに設定（HttpOnly、Secure）
    const cookieStore = await cookies()
    cookieStore.set('auth-token', response.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1日有効
      path: '/',
    })
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: {
          message: error.message,
        },
        values: rawData,
      }
    }

    // 予期しないエラーの場合
    return {
      success: false,
      error: {
        message:
          '予期しないエラーが発生しました。しばらく時間をおいて再度お試しください。',
      },
      values: rawData,
    }
  }

  // 成功時はホームページにリダイレクト
  redirect('/profile')
}
