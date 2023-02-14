import './App.scss';

import type {FC} from 'react';
import React, {useState} from 'react';
import {Link, Route, Routes} from 'react-router-dom';
import {HomeOutlined, GoldOutlined} from '@ant-design/icons';
import Hello from './pages/hello';
import Layout from 'antd/es/layout';
import Menu from 'antd/es/menu';
import Home from './pages/home';

const {Header, Content} = Layout;

const App: FC<{}> = () => {
    const [current, setCurrent] = useState(['home'] as React.Key[]);
    return (
        <Layout
            style={{
                background: '#fff',
                minHeight: 450,
                width: 600,
            }}
        >
            <Header style={{padding: 0}}>
                <Menu mode="horizontal" onClick={e => setCurrent(e.keyPath)}
                      selectedKeys={current.map(String)}
                      items={[
                          {key: "home", icon: <HomeOutlined/>, label: <Link to={'/'}>Home</Link>},
                          {key: "hello", icon: <GoldOutlined/>, label: <Link to={'/hello'}>Hello</Link>},
                      ]}
                />
            </Header>
            <Content
                style={{
                    padding: 24,
                }}
            >
                <Routes>
                    <Route path="/hello" element=<Hello/>/>
                    <Route path="/" element=<Home/>/>
                </Routes>
            </Content>
        </Layout>
    );
};


export default App;
