// import { describe, test, expect } from 'vitest'
import {render, screen} from '@testing-library/react'
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

 })