import {onMessage} from 'webext-bridge';
import {MSG_ID_FETCH_REQUEST, ResponseInfo} from "@/bgfetch/bgfetch";

onMessage('hello-from-content-script', (msg) => {
    console.log("onMessage:", msg);
});

onMessage(MSG_ID_FETCH_REQUEST, async (msg) => {
    console.log(`onMessage(${MSG_ID_FETCH_REQUEST}):`, msg);
    const {url, info} = msg.data as any;
    console.log(`bgfetch request:`, url, info);
    const resp = fetch(url, info);
    return await resp.then((data) => {
        let body;
        switch (info.dataType) {
            case "formData":
                body = data.formData();
                break;
            case "json":
                body = data.json();
                break;
            default:
                body = data.text();
                break;
        }
        return body.then((value) => {
            return {
                status: data.status,
                statusText: data.statusText,
                headers: data.headers,
                data: value
            } as ResponseInfo;
        }).catch((error) => {
            return {
                status: -1,
                statusText: JSON.stringify(error),
            } as ResponseInfo;
        });
    }).catch((error) => {
        return {
            status: -1,
            statusText: JSON.stringify(error),
        } as ResponseInfo;
    });
});

console.log('This is background page!');
