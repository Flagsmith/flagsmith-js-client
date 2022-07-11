import { render, screen } from '@testing-library/react'
import Home from '@/pages/index'
import flagsmith from 'flagsmith/isomorphic';
import { FlagsmithProvider } from 'flagsmith/react';
const jestFn = jest.fn();
jest.mock('flagsmith/react', () => {
    const actualModule = jest.requireActual('flagsmith/react')
    return new Proxy(actualModule, {
        get: (target, property) => {
            switch (property) {
                case 'useFlags': {
                    return jestFn
                }
                default: {
                    return target[property]
                }
            }
        },
    })
})
describe('Home', () => {
    beforeEach(()=>{
        jestFn.mockReturnValue({
            font_size: {
                enabled: true,
                value: 12
            },
            example_trait: "value"
        })
    })
    it('renders a heading', () => {
        render(
            <FlagsmithProvider flagsmith={flagsmith}>
                <Home />
            </FlagsmithProvider>
        )
        const heading = screen.getByTestId('font-size')
        expect(heading).toHaveTextContent("12")
    })
})
