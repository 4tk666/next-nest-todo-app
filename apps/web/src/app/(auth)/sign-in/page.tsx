import { SignInForm } from '@/features/auth/sign-in-form'

export default function SignInPage() {
  return (
    <div className="flex justify-center items-center h-full">
      <div className="relative w-full max-w-md rounded-lg bg-white p-8 border">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-gray-900">
            アカウントにサインイン
          </h2>
        </div>

        <SignInForm />
      </div>
    </div>
  )
}
