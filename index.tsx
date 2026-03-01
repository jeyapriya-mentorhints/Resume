import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import ReactGA from "react-ga4";
import { HelmetProvider } from 'react-helmet-async';

ReactGA.initialize("G-KDNLNLJ36C"); // replace with your ID


const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
    <App />
    </HelmetProvider>
  </React.StrictMode>
);