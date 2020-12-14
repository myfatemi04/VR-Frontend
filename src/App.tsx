import React, { Suspense } from "react";
import "./App.css";
import "./styles/main.css";
import { BrowserRouter, Route, Switch } from "react-router-dom";

const Home = React.lazy(() => import("./pages/Home"));
const Space = React.lazy(() => import("./pages/Space"));

function App() {
  return (
    <BrowserRouter>
      <Suspense fallback="Loading...">
        <Switch>
          <Route path="/" exact component={Home} />
          <Route path="/space/:roomID" exact component={Space} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
