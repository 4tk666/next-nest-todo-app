import { AUTH_TOKEN_KEY } from '@/constants/auth-token-key'
import { getUserProfileAction } from '@/lib/server-actions/user/get-user-profile-action'
import { clsx } from 'clsx'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/**
 * プロフィールページの読み込み中表示コンポーネント
 */
export default async function ProfilePage() {
  const cookieStore = await cookies()
  const token = cookieStore.get(AUTH_TOKEN_KEY)

  if (!token?.value) {
    redirect('/sign-in')
  }

  const profile = await getUserProfileAction()

  return (
    <div
      className={clsx(
        'bg-white rounded-lg shadow',
        'border border-gray-200',
        'p-6 text-gray-900',
      )}
    >
      <h1 className="text-2xl font-bold mb-4">プロフィール</h1>
      <div
        className={clsx(
          'bg-white rounded-lg shadow',
          'border border-gray-200',
          'p-6',
        )}
      >
        {/* プロフィールヘッダー */}
        <div className={clsx('flex items-center', 'mb-6')}>
          <div>
            <h2 className={clsx('text-2xl font-bold text-gray-900', 'mb-1')}>
              {profile.name || '名前未設定'}
            </h2>
            <p className="text-gray-600">{profile.email}</p>
          </div>
        </div>

        {/* プロフィール詳細情報 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ユーザーID */}

          {/* メールアドレス */}
          <div className={clsx('border border-gray-200 rounded-lg', 'p-4')}>
            <h3 className={clsx('text-sm font-medium text-gray-500', 'mb-2')}>
              メールアドレス
            </h3>
            <p className="text-gray-900">{profile.email}</p>
          </div>

          {/* 最終更新日 */}
          <div className={clsx('border border-gray-200 rounded-lg', 'p-4')}>
            <h3 className={clsx('text-sm font-medium text-gray-500', 'mb-2')}>
              最終更新日
            </h3>
            <p className="text-gray-900">{profile.updatedAt}</p>
          </div>
        </div>

        {/* ドキュメントアップロードセクション */}
        <div className="mt-8">
          {/* <DocumentUploadSection /> */}
        </div>
      </div>
    </div>
  )
}
