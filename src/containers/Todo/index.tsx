import { connect } from 'react-redux'
import { IState } from 'src/reducers'
import { bindActionCreators, Dispatch } from 'redux'
import * as todoAction from 'src/actions/todos'

import * as React from 'react'
import { ITodo, IAsyncData } from 'src/models'
import * as styles from './styles.scss'

interface IProps {

  todos: ITodo[],
  asyncData: IAsyncData[],

  toggleTodo: (todoId: number) => void,
  addTodo: (name: string) => void,
  asyncAddTodo: () => void,
  asyncTest: () => void
}

class TodoView extends React.Component<IProps> {
  public state = {
    name: ''
  }
  constructor(props: IProps) {
    super(props)
  }
  public componentDidMount() {
    const { asyncTest } = this.props
    asyncTest()
  }

  public handleNameInput = (event: any) => {
    this.setState({
      name: event.target.value
    })
  }

  public render() {
    const { todos, asyncData, toggleTodo, addTodo, asyncAddTodo } = this.props
    const { name } = this.state
    return (
      <div className={styles.todo}>
        <div>
          <input onInput={this.handleNameInput} defaultValue={name} />
          <button onClick={addTodo.bind(this, name)}>添加数据</button>
          <button onClick={asyncAddTodo.bind(this, name)}>异步添加数据</button>
        </div>
        <ul>
          {
            todos.map(todo => (
              <li key={todo.id}
                onClick={toggleTodo.bind(this, todo.id)}
                style={{ textDecoration: `${todo.done ? 'line-through' : ''}`, cursor: 'pointer' }}>
                {todo.name}
              </li>)
            )
          }
        </ul>
        <div>
          <p>我是异步请求回来的数据：</p>
          <ul>
            {
              asyncData.map((item: any, index: number) =>
                <li key={index}>{item.title}</li>
              )
            }
          </ul>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state: IState) => state.todos


const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators<any, any>(todoAction, dispatch)


export default connect<any, any, any>(mapStateToProps, mapDispatchToProps)(TodoView)