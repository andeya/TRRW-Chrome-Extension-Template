import React from 'react';
import ReactDOM from 'react-dom';
import './content.less';
import 'antd/dist/antd.css';
import { Button, Space } from 'antd';
import { windowFetch, backgroundFetch } from '../network';

const formatTimestamp = (ms: number): string => new Date(ms + 3600 * 8).toJSON()?.substr(0, 19).replace('T', ' ');

function Content() {
  return (
    <Space className="CRX-content" direction="vertical">
      <Button
        danger
        type="primary"
        onClick={() => {
          windowFetch<{ serverTime: number }>({
            method: 'GET',
            url: 'https://a.jd.com//ajax/queryServerData.html',
            thenCallback: resp => {
              console.debug('Click「windowFetch」Button resp:', resp);
              alert(formatTimestamp(resp.data.serverTime));
            },
          });
        }}
      >
        Get Time By「windowFetch」
      </Button>
      <Button
        danger
        type="primary"
        onClick={() => {
          backgroundFetch<{ serverTime: number }>({
            method: 'GET',
            url: 'https://a.jd.com//ajax/queryServerData.html',
            thenCallback: resp => {
              console.debug('Click「backgroundFetch」Button resp:', resp);
              alert(formatTimestamp(resp.data.serverTime));
            },
          });
        }}
      >
        Get Time By「backgroundFetch」
      </Button>
    </Space>
  );
}

const app = document.createElement('div');
app.id = 'CRX-container';
document.body.appendChild(app);

ReactDOM.render(<Content />, app);

try {
  let insertScript = document.createElement('script');
  insertScript.setAttribute('type', 'text/javascript');
  insertScript.src = window.chrome.extension.getURL('insert.js');
  document.body.appendChild(insertScript);
} catch (err) {}
