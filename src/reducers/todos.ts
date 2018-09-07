import { ITodo, IAsyncData } from '../models'
import { ActionTypes, Action } from '../actions/todos'

// Define our State interface for the current reducer
export interface IState {
  todos: ITodo[],
  asyncData: IAsyncData[]
}

// Define our initialState
export const initialState: IState = {
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
export function reducer(state: IState = initialState, action: Action) {
  switch (action.type) {

    case ActionTypes.ADD_TODO: {
      /*
       * We have autocompletion here
       * Typescript knows the action is type of AddTodoAction thanks to the ActionTypes enum
       * todo is type of Todo
       */
      const todo = action.payload.todo
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
      return {
        ...state,
        asyncData: todo 
      }
    }
    default:
      return state
  }
}