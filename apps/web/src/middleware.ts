
import { DEFAULT_LOGIN_REDIRECT } from '@/constants/routes'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_KEY } from './constants/auth-token-key'

// 認証なしでもアクセス可能なパス
const publicPaths = ['/sign-in', '/sign-up']

const isPublicPath = (path: string) => publicPaths.includes(path)

// 認証不要のパスを判定する関数
//　'.'は静的ファイルを示す
const isExcludedPath = (path: string) => path.includes('.')

// ミドルウェア関数
export async function middleware(request: NextRequest) {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)

  const path = request.nextUrl.pathname

  // 認証済みでログインページにアクセスした場合はリダイレクト
  if (!!token && (path === '/sign-in' || path === '/sign-up')) {
    return NextResponse.redirect(new URL(DEFAULT_LOGIN_REDIRECT, request.url))
  }
  // 認証不要パスの場合はそのまま続行
  if (isExcludedPath(path) || isPublicPath(path)) {
    return NextResponse.next()
  }

  // 認証されていない場合はログインにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL('/sign-in', request.url))
  }

  // それ以外の場合は続行
  return NextResponse.next()
}

// マッチャー設定 - 適用対象のルートを指定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
