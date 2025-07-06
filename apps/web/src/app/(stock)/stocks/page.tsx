'use client'

import { ErrorBanner } from '@/components/ui/error-banner'
import { Input } from '@/components/ui/input'
import { EXCHANGE_NAMES } from '@/constants/stock-constants'
import { useAuthSWR } from '@/lib/hooks/use-auth-swr'
import { useDebounce } from '@/lib/hooks/use-debounce'
import {
  type StockSearchResponse,
  stockSearchResponseSchema,
} from '@ai-job-interview/packages/schemas/stocks/stock-schemas'
import { clsx } from 'clsx'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { FiDollarSign, FiSearch, FiTrendingUp } from 'react-icons/fi'

export default function StocksPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const deferredQuery = useDebounce<string>(query, 900)

  const { data, error, isLoading } = useAuthSWR<StockSearchResponse>({
    path: '/stocks/search',
    validateOutput: stockSearchResponseSchema,
    params: { search: deferredQuery },
    isFetch: deferredQuery !== '',
  })

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-2">
            <FiTrendingUp className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">株式検索</h1>
          </div>
          <p className="text-gray-600">
            株式銘柄を検索して詳細情報を確認できます
          </p>
        </div>
      </div>

      {/* メインコンテンツ */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 検索セクション */}

        {/* 使用方法の説明 */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-[30px]">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">使用方法</h3>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">1.</span>
              <span>
                上の検索ボックスに株式銘柄のシンボル（例:
                AAPL）や企業名を入力してください
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">2.</span>
              <span>検索結果が自動的に表示されます（300ms の遅延後）</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-600 font-bold">3.</span>
              <span>検索結果をクリックすると詳細画面に遷移します</span>
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg p-6 mb-8">
          {error  && (
            <ErrorBanner message={error.message} className="mt-0 mb-4" />
          )}

          <div className="relative">
            <label
              htmlFor="stock-search"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              株式銘柄を検索
            </label>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiSearch className="h-5 w-5 text-gray-400" />
              </div>

              <Input
                id="stock-search"
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="例: AAPL, MSFT, GOOGL..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                autoComplete="off"
              />

              {/* ローディング表示 */}
              {isLoading && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-3 border-blue-600" />
                </div>
              )}
            </div>
            {data?.results && data?.results.length > 0 ? (
              <div
                className={clsx(
                  'mt-[10px]',
                  'max-h-[400px] overflow-y-auto',
                  'border border-gray-200 rounded-md shadow-md',
                )}
              >
                {data.results.map((stock, index) => (
                  <button
                    key={`${index}_${stock.ticker}`}
                    type="button"
                    onClick={() =>
                      router.push(`/stocks/${stock.ticker.toLowerCase()}`)
                    }
                    className={clsx(
                      'w-full text-left px-4 py-3 hover:bg-gray-50',
                      'border-b border-gray-100 last:border-b-0',
                      'transition-colors duration-150',
                      'cursor-pointer',
                    )}
                  >
                    <div className="flex items-center justify-between gap-[10px]">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <FiDollarSign className="h-4 w-4 text-green-600 shrink-0" />
                          <span className="font-medium text-gray-900">
                            {stock.name || stock.ticker}
                          </span>
                        </div>
                        {/* 市場情報を表示 */}
                        <div className="flex items-center gap-3 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <span className="font-medium">{stock.ticker}:</span>
                            <span>
                              {EXCHANGE_NAMES[stock.primary_exchange ?? ''] ??
                                '取引先不明'}
                            </span>
                          </span>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-xs text-gray-400">
                            詳細を見る
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-3 text-sm text-gray-500">
                検索結果が見つかりません
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
