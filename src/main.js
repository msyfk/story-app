import { App } from "./App.js";
import "./index.css";

document.addEventListener("DOMContentLoaded", () => {
  const appContainer = document.getElementById("root");
  App.init(appContainer);
});