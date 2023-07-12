// import { describe, test, expect } from 'vitest'
import {render, screen, fireEvent} from '@testing-library/react'

import App from './App'

describe('App', () => { 

    // Pedímos que antes de que se ejecute cada test se renderize el componente App
    beforeEach(() => {
        render(<App />);
    })

    test('Should show the main App component', () => {
        // Con Screen accedemos al "DOM", le pedimos que busque si el texto que hemos añadido dentro de "getByText" está definido con el metodo "toBeDefined".
        expect(screen.getByText('Excel to Word Template')).toBeDefined(); 
    })

    test('Should be able to upload a file', () => {
        const fileUploader = screen.getByText('Browse files')
        const file = new File(['(contenido del archivo)'], 'archivo.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})

        fireEvent.change(fileUploader, {target: { files: [file] } });
        expect(screen.getByText('archivo.xlsx')).toBeDefined();
    })


    test('Should show the instructions to download after the file has uploaded', () => {
        
        const fileUploader = screen.getByText('Browse files')
        const file = new File(['(contenido del archivo)'], 'archivo.xlsx', {type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'})
    
        fireEvent.change(fileUploader, {target: { files: [file] } });
        expect(screen.getByText('Press the button to download transformed files!')).toBeDefined();

    })

 })