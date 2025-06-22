import type { NextRequest } from 'next/server'

// ミドルウェア関数
export async function middleware(request: NextRequest) {}

// マッチャー設定 - 適用対象のルートを指定
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
