import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";
import { SiteAnalytics } from "./components/SiteAnalytics";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(<React.StrictMode><App /><SiteAnalytics /></React.StrictMode>);
