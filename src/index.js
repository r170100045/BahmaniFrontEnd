import "./index.css";

import App from "./App/App";
import { BrowserRouter } from "react-router-dom";
import ReactDOM from "react-dom";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,

  rootElement
);
