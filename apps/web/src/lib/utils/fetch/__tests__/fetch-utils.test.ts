import { cookies } from 'next/headers'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  addQueryParams,
  buildApiUrl,
  buildApiUrlWithQuery,
  extractJsonResponse,
  validateTemplateResponse,
} from '../fetch-utils'

// Next.jsのcookies関数をモック化
vi.mock('next/headers', () => ({
  cookies: vi.fn(),
}))

// グローバルなfetch関数をモック化
global.fetch = vi.fn()

describe('fetch-utils', () => {
  beforeEach(() => {
    // 各テスト前にモックをリセット
    vi.clearAllMocks()
  })

  describe('validateTemplateResponse', () => {
    it('有効なレスポンス形式を正しく検証する', () => {
      const validData = { data: { id: 1, name: 'test' } }
      const result = validateTemplateResponse(validData)
      expect(result).toEqual(validData)
    })

    it('スキーマは追加プロパティを除去する', () => {
      // Zodスキーマは定義されていないプロパティを除去する
      const dataWithExtra = { data: 'test', invalidField: 'extra' }
      const result = validateTemplateResponse(dataWithExtra)
      // 追加プロパティは除去されるため、dataのみが残る
      expect(result).toEqual({ data: 'test' })
      expect(result).not.toHaveProperty('invalidField')
    })

    it('dataフィールドが存在しない場合エラーを投げる', () => {
      // dataフィールドが存在しない場合、refineによりエラーになる
      const invalidData = { invalidField: 'test' }
      expect(() => validateTemplateResponse(invalidData)).toThrow(
        'レスポンス形式が正しくありません',
      )
    })

    it('無効なレスポンス形式の場合エラーを投げる', () => {
      // nullやundefinedなど、明らかに無効なデータをテスト
      expect(() => validateTemplateResponse(null)).toThrow(
        'レスポンス形式が正しくありません',
      )
      expect(() => validateTemplateResponse(undefined)).toThrow(
        'レスポンス形式が正しくありません',
      )
      expect(() => validateTemplateResponse('invalid string')).toThrow(
        'レスポンス形式が正しくありません',
      )
    })
  })

  describe('buildApiUrl', () => {
    it('パスが/で始まらない場合、正しくURLを構築する', () => {
      // 環境変数を一時的に設定
      process.env.API_BASE_URL = 'http://localhost:4000'

      const result = buildApiUrl('users')
      expect(result).toBe('http://localhost:4000/users')
    })

    it('パスが/で始まる場合、正しくURLを構築する', () => {
      process.env.API_BASE_URL = 'http://localhost:4000'

      const result = buildApiUrl('/users')
      expect(result).toBe('http://localhost:4000/users')
    })

    it('API_BASE_URLが設定されていない場合、デフォルトURLを使用する', () => {
      // 環境変数を一時的に未定義に設定
      const originalValue = process.env.API_BASE_URL
      process.env.API_BASE_URL = ''

      const result = buildApiUrl('auth/login')
      expect(result).toBe('http://localhost:4000/auth/login')

      // 元の値を復元
      process.env.API_BASE_URL = originalValue
    })

    it('カスタムAPIベースURLを正しく処理する', () => {
      process.env.API_BASE_URL = 'https://api.example.com'

      const result = buildApiUrl('users/profile')
      expect(result).toBe('https://api.example.com/users/profile')
    })
  })

  describe('extractJsonResponse', () => {
    it('正常なレスポンスを正しく処理する', async () => {
      // 正常なレスポンスのモック
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          data: { id: 1, name: 'テストユーザー' },
        }),
      } as unknown as Response

      const result = await extractJsonResponse(mockResponse)

      expect(result.body).toEqual({
        data: { id: 1, name: 'テストユーザー' },
      })
      expect(result.response).toBe(mockResponse)
    })

    it('エラーレスポンスを正しく処理する', async () => {
      // エラーレスポンスのモック（dataフィールドを含む）
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          data: null, // dataフィールドを追加
          error: {
            code: 'VALIDATION_ERROR',
            messages: ['ユーザー名は必須です', 'パスワードが短すぎます'],
          },
        }),
      } as unknown as Response

      await expect(extractJsonResponse(mockResponse)).rejects.toThrow(
        'ユーザー名は必須です、パスワードが短すぎます',
      )
    })

    it('エラーメッセージがない場合のデフォルトメッセージを表示する', async () => {
      // エラーメッセージなしのレスポンスのモック（dataフィールドを含む）
      const mockResponse = {
        ok: false,
        json: vi.fn().mockResolvedValue({
          data: null, // dataフィールドを追加
          error: {
            code: 'UNKNOWN_ERROR',
          },
        }),
      } as unknown as Response

      await expect(extractJsonResponse(mockResponse)).rejects.toThrow(
        '不明なエラーが発生しました',
      )
    })

    it('dataフィールドが存在しない場合エラーを投げる', async () => {
      // dataフィールドが存在しない場合、refineによりエラーになる
      const mockResponse = {
        ok: true,
        json: vi.fn().mockResolvedValue({
          invalidField: 'invalid data',
          // dataフィールドが存在しない
        }),
      } as unknown as Response

      // validateTemplateResponseでエラーが投げられる
      await expect(extractJsonResponse(mockResponse)).rejects.toThrow(
        'レスポンス形式が正しくありません',
      )
    })

    it('JSONパースエラーを正しく処理する', async () => {
      // JSONパースエラーのモック
      const mockResponse = {
        ok: true,
        json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
      } as unknown as Response

      await expect(extractJsonResponse(mockResponse)).rejects.toThrow(
        'Invalid JSON',
      )
    })
  })

  describe('addQueryParams', () => {
    it('単一のクエリパラメータを正しく追加する', () => {
      const url = 'https://api.example.com/search'
      const query = { q: 'apple' }

      const result = addQueryParams(url, query)

      expect(result).toBe('https://api.example.com/search?q=apple')
    })

    it('複数のクエリパラメータを正しく追加する', () => {
      const url = 'https://api.example.com/stocks'
      const query = {
        symbol: 'AAPL',
        metric: 'price',
        limit: '10',
      }

      const result = addQueryParams(url, query)

      expect(result).toBe(
        'https://api.example.com/stocks?symbol=AAPL&metric=price&limit=10',
      )
    })

    it('空のクエリオブジェクトの場合、元のURLを返す', () => {
      const url = 'https://api.example.com/data'
      const query = {}

      const result = addQueryParams(url, query)

      expect(result).toBe('https://api.example.com/data')
    })

    it('既存のクエリパラメータがあるURLに追加する', () => {
      const url = 'https://api.example.com/search?existing=value'
      const query = { new: 'param' }

      const result = addQueryParams(url, query)

      expect(result).toBe(
        'https://api.example.com/search?existing=value&new=param',
      )
    })

    it('特殊文字を含むクエリパラメータを正しくエンコードする', () => {
      const url = 'https://api.example.com/search'
      const query = {
        q: 'hello world',
        special: 'test@example.com',
      }

      const result = addQueryParams(url, query)

      expect(result).toBe(
        'https://api.example.com/search?q=hello+world&special=test%40example.com',
      )
    })

    it('日本語文字を含むクエリパラメータを正しくエンコードする', () => {
      const url = 'https://api.example.com/search'
      const query = {
        q: '株式検索',
        company: 'テスト会社',
      }

      const result = addQueryParams(url, query)

      expect(result).toBe(
        'https://api.example.com/search?q=%E6%A0%AA%E5%BC%8F%E6%A4%9C%E7%B4%A2&company=%E3%83%86%E3%82%B9%E3%83%88%E4%BC%9A%E7%A4%BE',
      )
    })
  })

  describe('buildApiUrlWithQuery', () => {
    beforeEach(() => {
      // 各テスト前に環境変数を設定
      process.env.API_BASE_URL = 'http://localhost:4000'
    })

    it('パスとクエリパラメータを組み合わせてURLを構築する', () => {
      const result = buildApiUrlWithQuery({
        path: '/finnhub/search',
        params: { q: 'AAPL' },
      })

      expect(result).toBe('http://localhost:4000/finnhub/search?q=AAPL')
    })

    it('複数のクエリパラメータを正しく処理する', () => {
      const result = buildApiUrlWithQuery({
        path: '/api/stocks',
        params: {
          symbol: 'AAPL',
          metric: 'price',
          limit: '10',
        },
      })

      expect(result).toBe(
        'http://localhost:4000/api/stocks?symbol=AAPL&metric=price&limit=10',
      )
    })

    it('空のparamsオブジェクトの場合、クエリパラメータなしのURLを返す', () => {
      const result = buildApiUrlWithQuery({
        path: '/api/data',
        params: {},
      })

      expect(result).toBe('http://localhost:4000/api/data')
    })

    it('パスがスラッシュで始まらない場合も正しく処理する', () => {
      const result = buildApiUrlWithQuery({
        path: 'search/stocks',
        params: { q: 'microsoft' },
      })

      expect(result).toBe('http://localhost:4000/search/stocks?q=microsoft')
    })

    it('無効な値を持つパラメータを除外する', () => {
      const result = buildApiUrlWithQuery({
        path: '/filter',
        params: {
          valid: 'keep',
          empty: '',
        },
      })

      expect(result).toBe('http://localhost:4000/filter?valid=keep')
    })
  })
})
