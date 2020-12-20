/// <reference types="chrome" />

import { windowFetch, ApiConfig, BackgroundResult, BackgroundMsg } from '../api';

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        // 运行插件运行的页面URL规则
        conditions: [new chrome.declarativeContent.PageStateMatcher({ pageUrl: {} })],
        actions: [new window.chrome.declarativeContent.ShowPageAction()],
      },
    ]);
  });
});

chrome.runtime.onMessage.addListener(function (
  msg: BackgroundMsg<any>,
  sender,
  sendResponse: (response: BackgroundResult) => void,
) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const { msgType, msgData } = msg;
    switch (msgType) {
      case 'backgroundFetch':
        const apiConfig = msgData as ApiConfig<any>;
        apiConfig.thenCallback = resp => {
          const result: BackgroundResult = { handle: 'then', data: resp };
          console.debug('onMessage: msg=%o, result=%o', msg, result);
          sendResponse(result);
        };
        apiConfig.catchCallback = error => {
          const result: BackgroundResult = { handle: 'catch', data: error };
          console.debug('onMessage: msg=%o, result=%o', msg, result);
          sendResponse(result);
        };
        apiConfig.finallyCallback = () => {
          const result: BackgroundResult = { handle: 'finally' };
          console.debug('onMessage: msg=%o, result=%o', msg, result);
          sendResponse(result);
        };
        windowFetch(apiConfig);
        break;
      default:
        console.warn('not support handle custom message type ' + msgType, msg);
    }
  });
  return true;
});
