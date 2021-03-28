import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/antd.css';
import App from './App';
import zhCN from 'antd/es/locale/zh_CN';
import reportWebVitals from './reportWebVitals';

const antdConfig = {
  locale: zhCN,
};

ReactDOM.render(
  <ConfigProvider {...antdConfig}>
    <App />
  </ConfigProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
