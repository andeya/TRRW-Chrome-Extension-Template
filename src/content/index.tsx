import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import './content.less';
import 'antd/dist/antd.css';
import { Button, Space } from 'antd';
import { fetch } from '../network';

const formatTimestamp = (ms: number): string => new Date(ms + 3600 * 8).toJSON()?.substr(0, 19).replace('T', ' ');

const Content: FC<{}> = () => {
  return (
    <Space direction="vertical">
      <Button
        danger
        type="primary"
        onClick={() => {
          fetch<{ serverTime: number }>({
            method: 'GET',
            url: 'https://a.jd.com//ajax/queryServerData.html',
            thenCallback: resp => {
              console.debug('Click「Get Time」Button resp:', resp);
              alert(formatTimestamp(resp.data.serverTime));
            },
          });
        }}
      >
        Get Time
      </Button>
    </Space>
  );
};

const app = document.createElement('div');
app.id = 'RTCE-container';
document.body.appendChild(app);

ReactDOM.render(<Content />, app);

try {
  let insertScript = document.createElement('script');
  insertScript.setAttribute('type', 'text/javascript');
  insertScript.src = window.chrome.extension.getURL('insert.js');
  document.body.appendChild(insertScript);
} catch (err) {}
