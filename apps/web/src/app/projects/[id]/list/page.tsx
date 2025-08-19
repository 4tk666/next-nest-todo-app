import { TaskCreate } from '@/features/list/components/task-create'

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProjectListPage({
  params,
}: ProjectDetailPageProps) {
  const { id: projectId } = await params

  return (
    <>
      <TaskCreate projectId={projectId} />
    </>
  )
}
