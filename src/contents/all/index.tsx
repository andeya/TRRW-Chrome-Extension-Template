import {sendMessage} from 'webext-bridge';
import './style.scss';
import pkg from '../../../package.json';
import type {FC} from 'react';
import {createRoot} from 'react-dom/client';
import Space from 'antd/es/space';
import Button from 'antd/es/button';
import {bgfetch} from "@/bgfetch/bgfetch";

sendMessage('hello-from-content-script', 'hello!', 'background');
console.log(pkg.displayName, ': content_scripts matched!');

const formatTimestamp = (ms: number): string => new Date(ms + 3600 * 8).toJSON()?.slice(0, 19).replace('T', ' ');

const Content: FC<{}> = () => {
    return (
        <Space direction="vertical">
            <Button
                danger
                type="primary"
                onClick={() =>
                    bgfetch('http://api.m.taobao.com/rest/api3.do?api=mtop.common.getTimestamp', {
                        method: 'GET',
                        dataType: 'json'
                    }).then(data => {
                        console.debug('Click「Alert Time」Button resp:', data);
                        alert(formatTimestamp(Number.parseInt(data.data.t)));
                    }).catch(error => {
                        console.error('Click「Alert Time」Button failed:', error);
                    })
                }
            >
                Alert Time
            </Button>
        </Space>
    );
};

const domNode = document.createElement('div');
domNode.id = 'TRRW-Container';
createRoot(domNode).render(<Content/>);
document.body.append(domNode);
