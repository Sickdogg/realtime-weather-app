
import { createRoot } from "react-dom/client";
import React from 'react';
import WeatherApp from "./WeatherApp";
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

import "./styles.css";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
    <WeatherApp />
);

serviceWorkerRegistration.register();
