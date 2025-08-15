'use client'

import { Button } from '@/components/ui/button'
import { TabsComponent } from '@/components/ui/tabs'
import type { ProjectDetail } from '@next-nest-todo-app/packages/schemas/project/project-schema'
import clsx from 'clsx'
import { useState } from 'react'
import {
  MdCalendarToday,
  MdDescription,
  MdPerson,
  MdSchedule,
} from 'react-icons/md'

type ProjectDetailProps = {
  projectDetail: ProjectDetail
}

/**
 * プロジェクト詳細コンポーネント
 * プロジェクトの詳細情報を表示するコンポーネントです
 */
export function ProjectDetailComponent({ projectDetail }: ProjectDetailProps) {
  const [activeTab, setActiveTab] = useState<string>('overview')

  // タブの定義
  const tabItems = [
    { value: 'overview', label: '概要' },
    { value: 'list', label: 'リスト' },
    { value: 'board', label: 'ボード' },
    { value: 'timeline', label: 'タイムライン' },
    { value: 'dashboard', label: 'ダッシュボード' },
  ]

  return (
    <div
      className={clsx(
        'border-b-[0.5px] border-[#808080]',
        'px-[20px] py-[15px]',
      )}
    >
      <h2 className="text-[20px] mb-[10px]">{projectDetail.name}</h2>
      <div>
        <TabsComponent
          items={tabItems}
          value={activeTab}
          onValueChange={setActiveTab}
        >
          {/* メインコンテンツ */}
          <div
            className={clsx(
              'mx-auto max-w-7xl',
              'py-5',
            )}
          >
            <div className={clsx('grid grid-cols-1 lg:grid-cols-3', 'gap-8')}>
              {/* 左側カラム */}
              <div className={clsx('lg:col-span-2', 'space-y-6')}>
                {/* プロジェクトの説明 */}
                <div
                  className={clsx(
                    'rounded-lg border border-gray-200',
                    'bg-white',
                    'p-6',
                  )}
                >
                  <h2
                    className={clsx(
                      'text-lg font-semibold text-gray-900',
                      'mb-4',
                    )}
                  >
                    プロジェクトの説明
                  </h2>
                  <p className={clsx('text-gray-600', 'mb-4')}>
                    {projectDetail.description}
                  </p>
                </div>

                {/* プロジェクトでの役割 */}
                <div
                  className={clsx(
                    'rounded-lg border border-gray-200',
                    'bg-white',
                    'p-6',
                  )}
                >
                  <h2
                    className={clsx(
                      'text-lg font-semibold text-gray-900',
                      'mb-4',
                    )}
                  >
                    プロジェクトでの役割
                  </h2>
                  <div
                    className={clsx(
                      'flex items-center justify-between',
                      'mb-4',
                    )}
                  >
                    <div className={clsx('flex items-center space-x-3')}>
                      <div
                        className={clsx(
                          'flex items-center justify-center',
                          'w-8 h-8',
                          'rounded-full',
                          'bg-yellow-500 text-white',
                          'text-sm font-medium',
                        )}
                      >
                        {'テスト'}
                      </div>
                      <span className={clsx('text-red-600 font-medium')}>
                        {'テスト'}
                      </span>
                    </div>
                    <Button variant="outline">
                      <MdPerson className="w-4 h-4 mr-2" />
                      メンバーを追加
                    </Button>
                  </div>
                </div>

                {/* 主な参考資料 */}
                <div
                  className={clsx(
                    'rounded-lg border border-gray-200',
                    'bg-white',
                    'p-6',
                  )}
                >
                  <h2
                    className={clsx(
                      'text-lg font-semibold text-gray-900',
                      'mb-4',
                    )}
                  >
                    主な参考資料
                  </h2>
                  <div
                    className={clsx(
                      'border-2 border-dashed border-gray-300',
                      'rounded-lg',
                      'p-8',
                      'text-center',
                    )}
                  >
                    <MdDescription
                      className={clsx(
                        'mx-auto h-12 w-12',
                        'text-gray-400',
                        'mb-4',
                      )}
                    />
                    <p className={clsx('mb-4')}>
                      プロジェクトの要旨や関連資料を保ってチームの
                      <br />
                      照準を共通のビジョンに合わせましょう。
                    </p>
                    <Button variant="outline">
                      <MdDescription className="w-4 h-4 mr-2" />
                      プロジェクトの要旨を作成
                    </Button>
                    <div className={clsx('mt-4')}>
                      <button
                        type="button"
                        className={clsx(
                          'inline-flex items-center',
                          'px-3 py-2',
                          'text-sm',
                          'hover:text-gray-700',
                        )}
                      >
                        <MdDescription className="w-4 h-4 mr-2" />
                        リンクとファイルを追加
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 右側サイドバー */}
              <div className={clsx('space-y-6')}>
                {/* プロジェクトのステータス */}
                <div
                  className={clsx(
                    'rounded-lg border border-gray-200',
                    'bg-white',
                    'p-6',
                  )}
                >
                  <h3
                    className={clsx(
                      'text-lg font-semibold text-gray-900',
                      'mb-4',
                    )}
                  >
                    プロジェクトのステータスは？
                  </h3>
                  <div className={clsx('space-y-3')}>
                    <div className={clsx('flex items-center space-x-3')}>
                      <div
                        className={clsx('w-3 h-3 rounded-full', 'bg-green-500')}
                      />
                      <span
                        className={clsx('text-sm font-medium', 'text-gray-900')}
                      >
                        順調
                      </span>
                    </div>
                    <div className={clsx('flex items-center space-x-3')}>
                      <div
                        className={clsx(
                          'w-3 h-3 rounded-full',
                          'bg-yellow-500',
                        )}
                      />
                      <span className={clsx('text-sm', 'text-gray-600')}>
                        リスクあり
                      </span>
                    </div>
                    <div className={clsx('flex items-center space-x-3')}>
                      <div
                        className={clsx('w-3 h-3 rounded-full', 'bg-red-500')}
                      />
                      <span className={clsx('text-sm', 'text-gray-600')}>
                        要対応
                      </span>
                    </div>
                  </div>
                </div>

                {/* アクティビティ */}
                <div
                  className={clsx(
                    'rounded-lg border border-gray-200',
                    'bg-white',
                    'p-6',
                  )}
                >
                  <div className={clsx('text-center', 'mb-6')}>
                    <MdSchedule
                      className={clsx(
                        'mx-auto h-12 w-12',
                        'text-gray-400',
                        'mb-2',
                      )}
                    />
                    <p className={clsx('text-sm ')}>期日なし</p>
                  </div>

                  <div className={clsx('space-y-4')}>
                    <div className={clsx('flex items-start space-x-3')}>
                      <MdPerson
                        className={clsx('w-5 h-5', 'text-gray-400', 'mt-1')}
                      />
                      <div>
                        <p
                          className={clsx(
                            'text-sm font-medium',
                            'text-gray-900',
                          )}
                        >
                          チーム ワークスペース が参加しました
                        </p>
                        <p className={clsx('text-xs ')}>5月27日</p>
                      </div>
                    </div>

                    <div className={clsx('flex items-start space-x-3')}>
                      <MdPerson
                        className={clsx('w-5 h-5', 'text-gray-400', 'mt-1')}
                      />
                      <div>
                        <p
                          className={clsx(
                            'text-sm font-medium',
                            'text-gray-900',
                          )}
                        >
                          あなたが参加しました
                        </p>
                        <p className={clsx('text-xs ')}>5月27日</p>
                      </div>
                    </div>

                    <div className={clsx('flex items-start space-x-3')}>
                      <MdCalendarToday
                        className={clsx('w-5 h-5', 'text-gray-400', 'mt-1')}
                      />
                      <div>
                        <p
                          className={clsx(
                            'text-sm font-medium',
                            'text-gray-900',
                          )}
                        >
                          プロジェクトが作成されました
                        </p>
                        <p className={clsx('text-xs ')}>5月27日</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsComponent>
      </div>
    </div>
  )
}
