// entry point for the React part of the app
//


import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './modern.css'; //change this line to change the style sheet

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);