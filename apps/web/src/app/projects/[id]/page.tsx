import { getProjectDetail } from '@/features/project/api/project-api'
import { ProjectDetailComponent } from '@/features/project/components/project-detail'

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>
}

/**
 * プロジェクト詳細ページ
 * プロジェクトの詳細情報を表示するページです
 */
export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { id } = await params

  const projectDetail = await getProjectDetail(id)

  return (
    <ProjectDetailComponent projectDetail={projectDetail} />
  )
}
