// Importamos la referencia a Vitest para poder importarlo en la configuración de Vite
/// <reference types="vitest"/>


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()], 
  test : {
    environment: 'jsdom', // Añadimos el entorno sobre el que se van a correr los test, en React por defecto es "jsdom" !!! Hay que instalar el paquete "jsdom"
    globals: true // Configuramos los funciones globales para poder utilizarlas en todos los documentos de testing
  },
  assetsInclude: ['**/*.docx'] // Añadimos la extensión .docx a la carpeta de "Assets"
})
