import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './content.less';
import 'antd/dist/antd.css';
import { Button } from 'antd';

function Content() {
  return (
    <div className="CRX-content">
      <Button danger type="primary">
        Test
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
