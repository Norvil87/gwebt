import React from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import Game from "./components/Game";
import { defaultState } from "./data";

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <Game defaultState={defaultState} />
  </React.StrictMode>
);
