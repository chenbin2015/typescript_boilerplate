###1.初始化typescript环境
```
create-react-app demo --scripts-version=react-scripts-ts
```
###2.添加scss的支持
```
npm run eject
yarn add sass-loader node-sass --dev
```
首先eject整个项目，然后安装sass-loader以及node-sass，接下来修改webpack配置，添加sass-loader的配置
文件目录
./config/webpack.config.dev.js ,./config/webpack.config.prod.js 
把css改为如下的scss，做了几件事，css模块化，支持sass
```

{
          test: /\.scss$/,
            use: [
              require.resolve('style-loader'),
              {
                loader: require.resolve('css-loader'),
                options: {
                  importLoaders: 1,
                  modules: true
                },
              },
              {
                loader: require.resolve('postcss-loader'),
                options: {
                  // Necessary for external CSS imports to work
                  // https://github.com/facebookincubator/create-react-app/issues/2677
                  ident: 'postcss',
                  plugins: () => [
                    require('postcss-flexbugs-fixes'),
                    autoprefixer({
                      browsers: [
                        '>1%',
                        'last 4 versions',
                        'Firefox ESR',
                        'not ie < 9', // React doesn't support IE8 anyway
                      ],
                      flexbox: 'no-2009',
                    }),
                  ],
                },
              },
              require.resolve('sass-loader')
            ],
          }

```
```
modules: true
require.resolve('sass-loader')
```
接下来，开始把demo中的css替换成scss,报错了
```
Cannot find module './App.scss'
```
具体解释如下
TypeScript does not know that there are other files than .tsor .tsx so it will throw an error if an import has a file-ending which is unknown.

If you have a webpack config which allows to import other files you have to tell the TypeScript compiler that there are these files. To do so you have to write a declaration files where you can declare modules with fitting names.

The content of the module to declare depends on the webpack loader used for this file-type, in this webpack config *.scss files are piped through sass-loader -> css-loader -> style-loader. So there will be no content in the imported module, and the correct module declaration would look like this

简单讲就是需要一个declare文件让ts认识scss文件，此时我们只需要在demo目录下新建一个declare文件即可，文件名:declare.d.ts，文件内容
```
declare module '*.scss';
```
以上，scss配置成功

###3.添加router
```
yarn add react-router-dom 
yarn add @types/react-router-dom --dev
```
modify app.tsx
```
import { createBrowserHistory } from 'history'
const history = createBrowserHistory()
class App extends React.Component {
  public render() {
    return (
      <div className={styles.App}>
        这是首页
        <Router history={history}>
          <div>
            <Route path="/main" component={Main} />
            <Route path="/about" component={About} />
            <Link to='/main'>go main</Link>
          <Link to='/about'>go about</Link>
          </div>
        </Router>
      </div>
    );
  }
}
```
这个时候，已经基本达到我们的要求了，但是，还得继续
###4. code split
代码分割可以说可做可不做，一般做的话，是拆分js，减少首屏加载的时间，我们一般要确保首屏的网络请求量减少到尽量少，所以还是推荐做拆分，这里我们用到了react-loadable,都是语法糖，直接用即可，我们创建一个导入组件的新方法，如下
```
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
```
再来看看routes有什么
```
 export interface IRouteItem {
  path: string
  component: any
}

const routes: IRouteItem[] = [
  { component: () => import('src/containers/About'), path: '/about' },
  { component: () => import('src/containers/Main'), path: '/main' }
]

export default routes
```
以上，即可完成代码分离，我们来看看效果
![image.png](https://upload-images.jianshu.io/upload_images/5087999-7d94e2d76c6c9597.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

###5.添加redux
+ 5.1.安装所需依赖
```
yarn add  redux react-redux redux-thunk
yarn add  @types/redux @types/react-redux @types/redux-thunk --dev
```
+ 5.2.定义数据格式models
```
mkdir models
cd models
touch todo.ts
touch asyncData.ts
touch index.ts
```
todo.ts
```
export interface ITodo {
  id: number,
  name: string,
  done: boolean
}
```
asyncData.ts
```
export interface IAsyncData {
  title: string
 }
```
index.ts
```
export * from './asyncData'
export *  from './todo'
```
* 5.3 定义action
```
mkdir actions
cd actions
touch todos.ts
```
todos.ts定义了几个action,分别如下
addTodo:用来做同步添加
toggleTodo:改变当前行的状态
asyncAddTodo:使用setTimeout模拟异步添加
asyncTest：使用async await异步请求数据
代码较多，请参考链接
* 5.4 定义reducer
包括两个文件
index.ts，主要用来合并reducer
```
import { combineReducers } from 'redux'
import * as fromTodos from './todo'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */  
export interface State {
  todos: fromTodos.State
}

/*
 * initialState of the app
 */
export const initialState: State = {
  todos: fromTodos.initialState
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<State>({
  todos: fromTodos.reducer
})
```
todos.ts,用来定义todo如何处理数据的
```
import Todo from '../models/todo'
import { ActionTypes, Action } from '../actions/todos'

// Define our State interface for the current reducer
export interface State {
  todos: Todo[],
  asyncData: {}
}

// Define our initialState
export const initialState: State = {
  todos: [{
    id: 1,
    name: '张三',
    done: true
  }], // We don't have any todos at the start of the app
  asyncData: []
}

/* 
 * Reducer takes 2 arguments
 * state: The state of the reducer. By default initialState ( if there was no state provided)
 * action: Action to be handled. Since we are in todos reducer, action type is Action defined in our actions/todos file.
 */
export function reducer(state: State = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.ADD_TODO: {
      /*
       * We have autocompletion here
       * Typescript knows the action is type of AddTodoAction thanks to the ActionTypes enum
       * todo is type of Todo
       */
      const todo = action.payload.todo
      console.log('todo:', action.payload)
      return {
        ...state,
        todos: [...state.todos, todo] // Add todo to todos array
      }
    }

    case ActionTypes.TOGGLE_TODO: {
      /*
       * This is the same as 
       * const todoId = action.payload.todoId
       */
      const { todoId } = action.payload
      return {
        ...state,
        todos: state.todos.map(todo => todo.id === todoId ? { ...todo, done: !todo.done } : todo)
      }
    }
    case ActionTypes.ASYNC_TEST: {
      const todo = action.payload.todo
      return {
        ...state,
        todos: [...state.todos, todo] // Add todo to todos array
      }
    }
    case ActionTypes.ASYNC_TEST2: {
      const todo = action.payload.json
      console.log('action:', action.payload)
      return {
        ...state,
        asyncData: todo 
      }
    }
    default:
      return state
  }
}
```
* 5.5 定义store
```
import logger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { reducer } from '../reducers'

/*
 * We're giving State interface to create store
 * store is type of State defined in our reducers
 */
const store = createStore(reducer, applyMiddleware(logger, thunk))

export default store
```
这个比较简单，就是应用中间件并且把reducer注册到了store上

* 5.6 修改首页
```
import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import './index.scss';

import store from './store'

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root') as HTMLElement
)

```
这也没啥，就注册了store，都是语法糖
以上，最后的结果如下
![image.png](https://upload-images.jianshu.io/upload_images/5087999-07703fc5a1f24361.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


###6.权限验证
### 参考文献
[声明文件相关](https://stackoverflow.com/questions/40382842/cant-import-css-scss-modules-typescript-says-cannot-find-module/41946697)
[初始化ts相关](https://levelup.gitconnected.com/typescript-and-react-using-create-react-app-a-step-by-step-guide-to-setting-up-your-first-app-6deda70843a4)




