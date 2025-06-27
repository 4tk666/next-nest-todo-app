import { cookies } from 'next/headers'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  buildApiUrl,
  extractJsonResponse,
  getAuthToken,
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
        'レスポンス形式が正しくありません'
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
        'レスポンス形式が正しくありません'
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

  describe('getAuthToken', () => {
    it('有効なトークンが存在する場合、トークンを返す', async () => {
      // cookiesモックの設定
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({
          value: 'valid-token-123',
        }),
      }

      vi.mocked(cookies).mockResolvedValue(
        mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
      )

      const result = await getAuthToken()

      expect(result).toBe('valid-token-123')
      expect(mockCookieStore.get).toHaveBeenCalledWith('auth-token')
    })

    it('トークンが存在しない場合、エラーを投げる', async () => {
      // トークンが存在しない場合のモック
      const mockCookieStore = {
        get: vi.fn().mockReturnValue(undefined),
      }

      vi.mocked(cookies).mockResolvedValue(
        mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
      )

      await expect(getAuthToken()).rejects.toThrow(
        '認証トークンが見つかりません',
      )
    })

    it('トークンの値が空の場合、エラーを投げる', async () => {
      // トークンの値が空の場合のモック
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({
          value: '',
        }),
      }

      vi.mocked(cookies).mockResolvedValue(
        mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
      )

      await expect(getAuthToken()).rejects.toThrow(
        '認証トークンが見つかりません',
      )
    })

    it('クッキーオブジェクトにvalueプロパティがない場合、エラーを投げる', async () => {
      // valueプロパティがないクッキーオブジェクトのモック
      const mockCookieStore = {
        get: vi.fn().mockReturnValue({
          name: 'auth-token',
          // valueプロパティなし
        }),
      }

      vi.mocked(cookies).mockResolvedValue(
        mockCookieStore as unknown as Awaited<ReturnType<typeof cookies>>,
      )

      await expect(getAuthToken()).rejects.toThrow(
        '認証トークンが見つかりません',
      )
    })
  })
})
