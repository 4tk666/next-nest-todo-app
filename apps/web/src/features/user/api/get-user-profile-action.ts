'use server'

import { authenticatedReadFetch } from '@/lib/utils/fetch/auth-fetch'
import {
  type UserProfile,
  userProfileSchema,
} from '@ai-job-interview/packages/schemas/user/profile'

/**
 * 現在ログイン中のユーザーのプロフィール情報を取得する
 * JWTトークンを使用してバックエンドAPIからユーザー情報を取得します
 *
 * @returns ユーザープロフィール情報
 * @throws 認証エラーまたはユーザーが見つからない場合
 */
export async function getUserProfileAction(): Promise<UserProfile> {
  return authenticatedReadFetch<UserProfile>({
    path: '/user/profile',
    validateOutput: userProfileSchema,
  })
}
