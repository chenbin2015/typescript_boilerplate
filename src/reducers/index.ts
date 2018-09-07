import { combineReducers } from 'redux'
import * as fromTodos from './todos'

/*
 * This is the root state of the app
 * It contains every substate of the app
 */  
export interface IState {
  todos: fromTodos.IState
}

/*
 * initialState of the app
 */
export const initialState: IState = {
  todos: fromTodos.initialState
}

/*
 * Root reducer of the app
 * Returned reducer will be of type Reducer<State>
 */
export const reducer = combineReducers<IState>({
  todos: fromTodos.reducer
})