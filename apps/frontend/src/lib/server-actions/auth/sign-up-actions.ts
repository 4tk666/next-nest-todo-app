'use server'

import { redirect } from 'next/navigation'
import { signIn } from '../../../auth'
import type { ActionState } from '../../../types/form'
import { prisma } from '../../prisma'
import {
  type SignUpFormValues,
  signUpSchema,
} from '../../schemas/auth/sign-up-schema'
import { hashPassword } from '../../utils/auth-utils'

export async function signUpAction(
  formData: FormData,
): Promise<ActionState<void, SignUpFormValues>> {
  // 入力値を保持
  const values = {
    name: formData.get('name')?.toString() ?? '',
    email: formData.get('email')?.toString() ?? '',
    password: formData.get('password')?.toString() ?? '',
    confirmPassword: formData.get('confirmPassword')?.toString() ?? '',
  }

  // zodでバリデーション
  const validationResult = signUpSchema.safeParse(values)

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors
    return {
      success: false,
      error: {
        message: 'バリデーションエラーが発生しました',
        fields: errors,
      },
      values,
    }
  }

  try {
    // ユーザーが既に存在するか確認
    const existingUser = await prisma.user.findUnique({
      where: { email: values.email },
    })

    if (existingUser) {
      return {
        success: false,
        error: {
          message: 'このメールアドレスは既に登録されています',
        },
        values: validationResult.data,
      }
    }

    // パスワードをハッシュ化
    const hashedPassword = await hashPassword(values.password)

    // 新規ユーザーの作成
    const user = await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        password: hashedPassword,
      },
    })

    // 元のパスワード（平文）を使用してサインイン
    await signIn('credentials', {
      username: user.email,
      password: values.password, // ハッシュ化前のパスワードを使用
      redirect: false,
    })
  } catch (error) {
    return {
      success: false,
      error: {
        message: '登録中にエラーが発生しました',
      },
    }
  }

  redirect('/')
}
