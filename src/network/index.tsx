import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export interface ApiConfig<ResponseData> extends AxiosRequestConfig {
  thenCallback?: (resp: AxiosResponse<ResponseData>) => void;
  catchCallback?: (reason: any) => void;
  finallyCallback?: () => void;
}

export function fetch<ResponseData>(apiConfig: ApiConfig<ResponseData>) {
  if (process.env.REACT_APP_DEBUG === 'true') {
    // In debug mode, direct request.
    windowFetch(apiConfig);
  } else {
    // In normal mode, delegate background script to initiate the request.
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

let requestId = 0;
const genRequestId = (): string => {
  return (requestId++).toString();
};

export interface BackgroundMsg<ResponseData> {
  msgId: string;
  msgType: 'backgroundFetch';
  msgData: {
    hasThen: boolean;
    hasCatch: boolean;
    hasFinally: boolean;
  } & ApiConfig<ResponseData>;
}

export interface BackgroundResult {
  handle: 'then' | 'catch' | 'finally';
  data?: AxiosResponse<any>;
}

export function backgroundFetch<ResponseData>(apiConfig: ApiConfig<ResponseData>) {
  if (window.chrome && window.chrome.runtime) {
    const msg: BackgroundMsg<ResponseData> = {
      msgId: genRequestId(),
      msgType: 'backgroundFetch',
      msgData: {
        hasThen: !!apiConfig.thenCallback,
        hasCatch: !!apiConfig.catchCallback,
        hasFinally: !!apiConfig.finallyCallback,
        ...apiConfig,
      },
    };
    console.debug('sendMessage[%s]-send: message=%o', msg.msgId, msg);
    window.chrome.runtime.sendMessage(msg, (result: BackgroundResult) => {
      switch (result.handle) {
        case 'then':
          console.debug('sendMessage[%s]-then: message=%o, response=%o', msg.msgId, msg, result.data);
          apiConfig.thenCallback && apiConfig.thenCallback(result.data!);
          break;
        case 'catch':
          console.debug('sendMessage[%s]-catch: message=%o, error=%o', msg.msgId, msg, result.data);
          apiConfig.catchCallback && apiConfig.catchCallback(result.data);
          break;
        case 'finally':
          console.debug('sendMessage[%s]-finally: message=%o', msg.msgId, msg);
          apiConfig.finallyCallback && apiConfig.finallyCallback();
      }
    });
  } else {
    console.error('not found Chrome API: window.chrome.runtime.sendMessage');
  }
}
