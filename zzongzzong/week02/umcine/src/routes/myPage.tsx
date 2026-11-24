import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/myPage')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/myPage"!</div>
}
