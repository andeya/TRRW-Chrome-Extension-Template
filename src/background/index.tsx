/// <reference types="chrome" />

import { apiRequest, ApiConfig, BackgroundResult, BackgroundMsg } from '../api';

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
  msg: BackgroundMsg,
  sender,
  sendResponse: (response: BackgroundResult) => void,
) {
  chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    const { msgType, msgData } = msg;
    switch (msgType) {
      case 'apiRequest':
        const apiConfig = msgData as ApiConfig;
        const { then: thenCallback, catch: catchCallback, finally: finallyCallback } = apiConfig;
        apiConfig.then = resp => {
          apiConfig.then = thenCallback;
          sendResponse({ handle: 'then', data: resp });
        };
        apiConfig.catch = resp => {
          apiConfig.catch = catchCallback;
          sendResponse({ handle: 'catch', data: resp });
        };
        apiConfig.finally = () => {
          apiConfig.finally = finallyCallback;
          sendResponse({ handle: 'finally', data: void 0 });
        };
        apiRequest(apiConfig);
        break;
      default:
        console.warn('not support handle custom message type ' + msgType, msg);
    }
  });
  return true;
});
