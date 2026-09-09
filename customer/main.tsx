import React from 'react';
import {createRoot} from 'react-dom/client';
import Spa from '../app/spa';
import DemoProvider from '../app/demo';
import '../app/globals.css';
const path=window.location.pathname;
const mode=path.includes('/demo/admin')?'admin':path.includes('/demo/staff')?'staff':'customer';
createRoot(document.getElementById('root')!).render(path.includes('/demo/')?<DemoProvider><Spa mode={mode}/></DemoProvider>:<Spa mode="customer"/>);
