import React from 'react';
import ReactDOM from 'react-dom';
import Popup from './popup';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/es/locale/zh_CN';
import reportWebVitals from './reportWebVitals';

const antdConfig = {
  locale: zhCN,
};

ReactDOM.render(
  <ConfigProvider {...antdConfig}>
    <Popup />
  </ConfigProvider>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
