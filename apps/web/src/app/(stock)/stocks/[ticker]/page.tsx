import { getStockDetail } from '@/features/stocks/api/fetch-stock-detail'

type StockDetailPageProps = {
  params: Promise<{ ticker: string }>
}

/**
 * 株式詳細ページコンポーネント
 * 指定されたティッカーシンボルの株式詳細情報をサーバーサイドで取得し表示します
 */
export default async function StockDetailPage({
  params,
}: StockDetailPageProps) {
  const { ticker } = await params

  const stockDetail = await getStockDetail(ticker)

  // その他のエラーの場合はエラーページを表示
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <h2>詳細</h2>
        </div>
      </div>
    </div>
  )
}
