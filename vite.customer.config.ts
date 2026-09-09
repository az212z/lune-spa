import {defineConfig} from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/postcss';
import {fileURLToPath,URL} from 'node:url';
export default defineConfig({root:'customer',base:'/lune-spa/',plugins:[react()],resolve:{alias:{'@':fileURLToPath(new URL('.',import.meta.url))}},css:{postcss:{plugins:[tailwindcss()]}},define:{__LUNE_API_ORIGIN__:JSON.stringify('https://lune-spa.b5dyfczk4p.chatgpt.site')},build:{outDir:'../dist-pages',emptyOutDir:true}});
