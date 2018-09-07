
import { ITodo } from '../models'


/*
 * We're defining every action name constant here
 * We're using Typescript's enum
 * Typescript understands enum better 
 */
export enum ActionTypes {
  ADD_TODO = '[todos] ADD_TODO',
  TOGGLE_TODO = '[todos] TOGGLE_TODO',
  ASYNC_TEST = '[todos] ASYNC_TEST',
  ASYNC_TEST2 = '[todos] ASYNC_TEST2'
}

/*
 * Define return types of our actions 
 * Every action returns a type and a payload
 */
export interface IAddTodoAction { type: ActionTypes.ADD_TODO, payload: { todo: ITodo } }
export interface IToggleTodoAction { type: ActionTypes.TOGGLE_TODO, payload: { todoId: number } }
export interface IAsyncTestAction { type: ActionTypes.ASYNC_TEST, payload: { todo: ITodo } }
export interface IAsyncTest2Action { type: ActionTypes.ASYNC_TEST2, payload: { json: any } }

/*
 * Define our actions creators
 * We are returning the right Action for each function
 */
export function addTodo(name: string): IAddTodoAction {

  return {
    type: ActionTypes.ADD_TODO,
    payload: {
      todo: {
        id: Math.random(),
        name,
        done: false
      }
    }
  }
}


export function toggleTodo(todoId: number): IToggleTodoAction {
  return { type: ActionTypes.TOGGLE_TODO, payload: { todoId } } // {todoId} is a shortcut for {todoId: todoId}
}

export const asyncAddTodo = (name: string) => (dispatch: any) => {
  const todo = {
    done: false,
    name,
    id: Math.random(),
  } as ITodo

  setTimeout(() => {
    dispatch({
      type: ActionTypes.ASYNC_TEST,
      payload: {
        todo
      },
    })
  }, 2000)
}
export const asyncTest = () => async (dispatch: any) => {
  const a = await fetch('https://cms.cekid.com/publish/998/newindex2017.json')
  const json = await a.json()
  return dispatch({
    type: ActionTypes.ASYNC_TEST2,
    payload: {
      json: json.data.navigation.data
    },
  })
}

/*
 * Define the Action type
 * It can be one of the types defining in our action/todos file
 * It will be useful to tell typescript about our types in our reducer
 */
export type Action = IAddTodoAction | IToggleTodoAction | IAsyncTestAction | IAsyncTest2Action