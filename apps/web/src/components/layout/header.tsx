import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { SignOutButton } from '@/features/auth/components/sign-out-button'
import { clsx } from 'clsx'
import { cookies } from 'next/headers'
import Link from 'next/link'
import { LinkButton } from '../ui/link-button'

export async function Header() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)

  return (
    <header className="bg-white shadow fixed top-0 left-0 w-full z-50">
      <div className={clsx('max-w-7xl mx-auto', 'px-4 sm:px-6 lg:px-8')}>
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-xl font-bold text-gray-800">
                NextTemplate
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <div className="flex space-x-4">
              {token ? (
                <>
                  <LinkButton href="/profile" variant="outline">
                    プロフィール
                  </LinkButton>
                  <SignOutButton />
                </>
              ) : (
                <>
                  <LinkButton href="/sign-in" variant="outline">
                    ログイン
                  </LinkButton>
                  <LinkButton href="/sign-up" variant="primary">
                    新規登録
                  </LinkButton>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
