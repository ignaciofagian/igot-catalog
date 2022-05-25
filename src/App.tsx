import { HashRouter, Route, Switch } from "react-router-dom";
import Layout from "./components/Layout";
import HomePage from "./pages/index";

function App() {
  return (
    <HashRouter>
      <Switch>
        <Layout>
          <Route path="/" exact component={HomePage} />
        </Layout>
      </Switch>
    </HashRouter>
  );
}

export default App;
