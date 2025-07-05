'use server'


import { serverAuthenticatedReadFetch } from '@/lib/utils/fetch/server/server-auth-fetch'
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
  return serverAuthenticatedReadFetch<UserProfile>({
    path: '/user/profile',
    validateOutput: userProfileSchema,
  })
}
