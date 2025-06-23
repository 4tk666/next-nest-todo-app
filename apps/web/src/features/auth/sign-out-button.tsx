import { Button } from '@/components/elements/button'
import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

async function handleSignOut() {
  'use server'
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)
  if (!token) return

  cookieStore.delete(AUTH_TOKEN_KEY)
  redirect('/sign-in')
}

export async function SignOutButton() {
  return (
    <form action={handleSignOut}>
      <Button type="submit" variant="outline">
        ログアウト
      </Button>
    </form>
  )
}
