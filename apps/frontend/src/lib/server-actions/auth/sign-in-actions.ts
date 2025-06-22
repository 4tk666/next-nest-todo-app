'use server'

import {
  type SignInFormValues,
  signInSchema,
} from '@/lib/schemas/auth/sign-in-schema'
import type { ActionState } from '@/types/form'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * サインインのサーバーアクション
 * APIを呼び出してユーザー認証を行い、JWTトークンをクッキーに設定します
 */
export async function signInAction(
  formData: FormData,
): Promise<ActionState<void, SignInFormValues>> {
  // FormDataから値を取得
  const rawData = {
    username: formData.get('username')?.toString() || '',
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
    const response = await fetch(`${process.env.API_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: validationResult.data.username,
        password: validationResult.data.password,
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => null)

      return {
        success: false,
        error: {
          message: errorData?.message || 'サインインに失敗しました',
        },
        values: rawData,
      }
    }

    const data = await response.json()

    // JWTトークンをクッキーに設定（HttpOnly、Secure）
    const cookieStore = await cookies()
    cookieStore.set('auth-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24, // 1日有効
      path: '/',
    })
  } catch (error) {
    console.error('Sign in error:', error)
    return {
      success: false,
      error: {
        message:
          'サインインに失敗しました。ネットワーク接続を確認してください。',
      },
      values: rawData,
    }
  }

  // 成功時はホームページにリダイレクト
  redirect('/')
}
