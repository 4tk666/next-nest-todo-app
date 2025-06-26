import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { AUTH_TOKEN_KEY } from './constants/auth-token-key'
import { ROUTES } from './constants/routes'

// 認証なしでもアクセス可能なパス
const publicPaths: string[] = [ROUTES.SIGN_IN, ROUTES.SIGN_UP]

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
  if (!!token && (path === ROUTES.SIGN_IN || path === ROUTES.SIGN_UP)) {
    return NextResponse.redirect(new URL(ROUTES.PROFILE, request.url))
  }
  // 認証不要パスの場合はそのまま続行
  if (isExcludedPath(path) || isPublicPath(path)) {
    return NextResponse.next()
  }

  // 認証されていない場合はログインにリダイレクト
  if (!token) {
    return NextResponse.redirect(new URL(ROUTES.SIGN_IN, request.url))
  }

  // それ以外の場合は続行
  return NextResponse.next()
}

// マッチャー設定 - 適用対象のルートを指定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
