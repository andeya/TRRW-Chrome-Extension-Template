/// <reference types="chrome" />

import { windowFetch, ApiConfig, BackgroundResult, BackgroundMsg } from '../network';

chrome.runtime.onInstalled.addListener(function () {
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
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
    const { msgId, msgType, msgData } = msg;
    switch (msgType) {
      case 'backgroundFetch':
        const apiConfig = msgData as ApiConfig<any>;
        msgData.hasThen &&
          (apiConfig.thenCallback = resp => {
            const result: BackgroundResult = { handle: 'then', data: resp };
            console.debug('onMessage[%s]-%s: message=%o, response=%o', msgId, result.handle, msg, result.data);
            sendResponse(result);
          });
        msgData.hasCatch
          ? (apiConfig.catchCallback = error => {
              const result: BackgroundResult = { handle: 'catch', data: error };
              console.debug('onMessage[%s]-%s: message=%o, error=%o', msgId, result.handle, msg, result.data);
              sendResponse(result);
            })
          : (apiConfig.catchCallback = error => {
              console.error('onMessage[%s] fail: message=%o, error=%o', msgId, msg, error);
            });
        msgData.hasFinally &&
          (apiConfig.finallyCallback = () => {
            const result: BackgroundResult = { handle: 'finally' };
            console.debug('onMessage[%s]-%s: message=%o', msgId, result.handle, msg);
            sendResponse(result);
          });
        windowFetch(apiConfig);
        break;
      default:
        console.warn('onMessage[%s] fail: not support handle custom message: %o', msgId, msg);
    }
  });
  return true;
});
