import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiConfig extends AxiosRequestConfig {
  then: (resp: AxiosResponse<any>) => void;
  catch?: (reason: any) => void;
  finally?: () => void;
}

// 发起请求
export function fetch(apiConfig: ApiConfig) {
  if (process.env.REACT_APP_DEBUG === 'true') {
    apiRequest(apiConfig);
  } else {
    sendRequestToBackground(apiConfig);
  }
}

export function apiRequest(apiConfig: ApiConfig) {
  axios(apiConfig)
    .then((resp: AxiosResponse<any>) => {
      apiConfig.then(resp);
    })
    .catch((reason: any) => {
      apiConfig.catch && apiConfig.catch(reason);
    })
    .finally(() => {
      apiConfig.finally && apiConfig.finally();
    });
}

export interface BackgroundMsg {
  msgType: 'apiRequest' | string;
  msgData: ApiConfig | any;
}

export interface BackgroundResult {
  handle: 'then' | 'catch' | 'finally';
  data: AxiosResponse<any> | any;
}

function sendRequestToBackground(apiConfig: ApiConfig) {
  if (window.chrome && window.chrome.runtime) {
    window.chrome &&
      window.chrome.runtime.sendMessage(
        {
          msgType: 'apiRequest',
          msgData: apiConfig,
        } as BackgroundMsg,
        (result: BackgroundResult) => {
          switch (result.handle) {
            case 'then':
              apiConfig.then(result.data);
              break;
            case 'catch':
              apiConfig.catch && apiConfig.catch(result.data);
              break;
            case 'finally':
              apiConfig.finally && apiConfig.finally();
          }
        },
      );
  } else {
    console.error('not found Chrome API: window.chrome.runtime.sendMessage');
  }
}
