import React from 'react';
import ReactDOM from 'react-dom/client';
import './i18n'
import App from './app';
import {HashRouter, Route, Routes} from 'react-router-dom';
import ModalComponent from './components/Modal';

import MainPage from './pages/main-page';
import {ToastContainer} from 'react-toastify';
import {toastDuration} from './common/constant';
import {ContextMenuComponent} from './components/ContextMenu';
import 'animate.css';
import 'rc-slider/assets/index.css';
import 'react-toastify/dist/ReactToastify.css';
import './index.css'
import './index.scss'
import bootstrap from './document/bootstrap';


bootstrap().then(() => {
    ReactDOM.createRoot(
        document.getElementById('root') as HTMLElement
    ).render(
        <>
            <HashRouter>
                <Routes>
                    <Route path="/" element={<App></App>}>
                        <Route path="main/*" element={<MainPage></MainPage>}></Route>
                        <Route path="/" element={<MainPage></MainPage>}></Route>
                    </Route>
                </Routes>
            </HashRouter>
            <ModalComponent></ModalComponent>
            <ContextMenuComponent></ContextMenuComponent>
            <ToastContainer
                draggable={false}
                closeOnClick={false}
                limit={5}
                pauseOnFocusLoss={false}
                hideProgressBar
                autoClose={toastDuration.short}
                newestOnTop
            ></ToastContainer>
        </>
    );
})


