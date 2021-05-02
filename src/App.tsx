import './App.css';
import { Switch, Route } from 'react-router-dom';
import Dungeon from './Applications/Dungeon/Dungeon';
import Selector from './pages/Selector/Selector';

function App() {
  return (
    <div className="App no-select">
      <Switch>
        <Route
          exact
          path="/"
          render={(routeProps) => <Selector {...routeProps} />}
        />
        <Route
          exact
          path="/problem/dungeon"
          render={(routeProps: any) => <Dungeon {...routeProps} />}
        />
      </Switch>
    </div>
  );
}

export default App;
