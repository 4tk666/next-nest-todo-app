'use client'

export default function ErrorPage() {
  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl text-gray-800">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4">エラーが発生しました</h1>
        <p className="mb-4">
          申し訳ありませんが、予期しないエラーが発生しました。
        </p>
        <p>しばらくしてからもう一度お試しください。</p>
      </div>
    </div>
  )
}
