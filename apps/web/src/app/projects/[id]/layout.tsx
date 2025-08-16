import { getProjectDetail } from '@/features/project/api/project-api'
import ProjectTabs from '@/features/project/components/project-tabs'
import clsx from 'clsx'

export default async function ProjectLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const projectDetail = await getProjectDetail(id)

  return (
    <div className={clsx('px-[20px]', 'border-b-[0.5px] border-[#808080]')}>
      <h2 className="text-[20px] mb-[10px] pt-[15px]">{projectDetail.name}</h2>
      {/* 共通タブ */}
      <ProjectTabs projectId={id} />
      <div>{children}</div>
    </div>
  )
}
