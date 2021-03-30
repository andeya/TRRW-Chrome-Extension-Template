import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import zhCN from 'antd/es/locale/zh_CN';
import ConfigProvider from 'antd/es/config-provider';
import './rtce-antd.less';
import reportWebVitals from './reportWebVitals';

const antdConfig = {
  locale: zhCN,
};

document.body.id = 'RTCE-container';
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
