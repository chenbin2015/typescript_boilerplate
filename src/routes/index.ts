export interface IRouteItem {
  path: string
  component: any
}

const routes: IRouteItem[] = [
  { component: () => import('src/containers/About'), path: '/about' },
  { component: () => import('src/containers/Main'), path: '/main' },
  { component: () => import('src/containers/Todo'), path: '/todo' }
]

export default routes
