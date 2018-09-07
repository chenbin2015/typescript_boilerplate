import * as React from 'react'
import * as Loadable from 'react-loadable'
import { IRouteItem } from '../routes'

export const createLoadableComponent = (
  component: IRouteItem['component'],
  Loading: React.ComponentType<any>
) => Loadable({
  delay: 300,
  loader: component,
  loading: Loading
})

