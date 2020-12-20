import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './content.less';
import 'antd/dist/antd.css';
import { Button } from 'antd';
import { windowFetch, fetch } from '../api';

export const formatTimestamp = (ms: number): string =>
  new Date(ms + 3600 * 8).toJSON()?.substr(0, 19).replace('T', ' ');

function Content() {
  return (
    <div className="CRX-content">
      <Button
        danger
        type="primary"
        onClick={() => {
          fetch<{ serverTime: number }>({
            method: 'GET',
            url: 'https://a.jd.com//ajax/queryServerData.html',
            thenCallback: resp => {
              console.debug('Button resp:', resp);
              alert(formatTimestamp(resp.data.serverTime));
            },
          });
        }}
      >
        Get JD Time
      </Button>
    </div>
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
