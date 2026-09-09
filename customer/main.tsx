import React from 'react';
import {createRoot} from 'react-dom/client';
import Spa from '../app/spa';
import '../app/globals.css';
createRoot(document.getElementById('root')!).render(<Spa mode="customer"/>);
