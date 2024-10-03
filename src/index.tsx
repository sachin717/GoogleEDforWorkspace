import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { initializeIcons } from "@fluentui/react/lib/Icons";
initializeIcons();
ReactDOM.render(<App />, document.getElementById("root"));
