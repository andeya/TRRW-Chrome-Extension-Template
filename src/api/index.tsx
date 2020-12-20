import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiConfig<ResponseData> extends AxiosRequestConfig {
  thenCallback?: (resp: AxiosResponse<ResponseData>) => void;
  catchCallback?: (reason: any) => void;
  finallyCallback?: () => void;
}

// 发起请求
export function fetch<ResponseData>(apiConfig: ApiConfig<ResponseData>) {
  if (process.env.REACT_APP_DEBUG === 'true') {
    windowFetch(apiConfig);
  } else {
    backgroundFetch(apiConfig);
  }
}

export function windowFetch<ResponseData>(apiConfig: ApiConfig<ResponseData>) {
  axios(apiConfig)
    .then((resp: AxiosResponse<ResponseData>) => {
      apiConfig.thenCallback && apiConfig.thenCallback(resp);
    })
    .catch((reason: any) => {
      apiConfig.catchCallback && apiConfig.catchCallback(reason);
    })
    .finally(() => {
      apiConfig.finallyCallback && apiConfig.finallyCallback();
    });
}

export interface BackgroundMsg<ResponseData> {
  msgType: 'backgroundFetch';
  msgData: ApiConfig<ResponseData>;
}

export interface BackgroundResult {
  handle: 'then' | 'catch' | 'finally';
  data?: AxiosResponse<any>;
}

function backgroundFetch<ResponseData>(apiConfig: ApiConfig<ResponseData>) {
  if (window.chrome && window.chrome.runtime) {
    window.chrome &&
      window.chrome.runtime.sendMessage(
        {
          msgType: 'backgroundFetch',
          msgData: apiConfig,
        } as BackgroundMsg<ResponseData>,
        (result: BackgroundResult) => {
          switch (result.handle) {
            case 'then':
              apiConfig.thenCallback && apiConfig.thenCallback(result.data!);
              break;
            case 'catch':
              apiConfig.catchCallback && apiConfig.catchCallback(result.data);
              break;
            case 'finally':
              apiConfig.finallyCallback && apiConfig.finallyCallback();
          }
        },
      );
  } else {
    console.error('not found Chrome API: window.chrome.runtime.sendMessage');
  }
}
