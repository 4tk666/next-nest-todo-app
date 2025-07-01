import { SuccessBanner } from '@/components/ui/success-banner'
import { SignInForm } from '@/features/auth/sign-in-form'
import clsx from 'clsx'

type Props = {
  searchParams: Promise<{ success?: string }>
}

export default async function SignInPage({ searchParams }: Props) {
  // 検索パラメータから成功メッセージを取得
  const { success } = await searchParams

  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 border">
        <div className={clsx('text-center', success && 'mb-4')}>
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
        </div>

        {success && (
          <SuccessBanner
            title="サインアップが完了しました！"
            message="ご登録の情報でログインしてください。"
          />
        )}

        <SignInForm />
      </div>
    </div>
  )
}
