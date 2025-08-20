import { getTasksByProject } from '@/features/list/api/task-api'
import { TaskCreate } from '@/features/list/components/task-create'
import { TaskList } from '@/features/list/components/task-list'

type ProjectDetailPageProps = {
  params: Promise<{ id: string }>
}

export default async function ProjectListPage({
  params,
}: ProjectDetailPageProps) {
  const { id: projectId } = await params

  const tasks = await getTasksByProject(projectId)

  return (
    <div className="space-y-6">
      <TaskCreate projectId={projectId} />
      <TaskList tasks={tasks} />
    </div>
  )
}
