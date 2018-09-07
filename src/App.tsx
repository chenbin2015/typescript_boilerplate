import * as React from 'react'
import { Router, Route, Link } from 'react-router-dom'
import * as styles from './App.scss'
import { createLoadableComponent } from './common/createLoadableComponent'
import routes from './routes'

import { createBrowserHistory } from 'history'

const history = createBrowserHistory()

class App extends React.Component {
  public render() {
    return (
      <div className={styles.App}>
        这是首页
        <Router history={history}>
          <div>

            <Link to='/main'>go main</Link>
            <Link to='/about'>go about</Link>
            <Link to='/todo'>go todo</Link>
            {
              routes.map((route: any, index) => {
                return <Route
                  key={index}
                  exact={true}
                  path={route.path}
                  component={createLoadableComponent(route.component, () => null)}
                />
              })
            }
          </div>

        </Router>
      </div>
    );
  }
}

export default App;
