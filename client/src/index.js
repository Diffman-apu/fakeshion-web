import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './assets/iconfont.css'
import './index.scss'
import store from './redux/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import 'react-virtualized/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  // <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  // </React.StrictMode>
);

store.subscribe(() => {
  console.log("store状态变化导致 重新渲染了, 此时 store值为：", store.getState())
  root.render(
    // <React.StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <App />
        </Provider>
      </BrowserRouter>
    // </React.StrictMode>
  );
})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
