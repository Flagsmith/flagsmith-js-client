import React, { FC } from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import { FlagsmithProvider, useFlags } from '../react'
import { getFlagsmith, experimentIdentity, getMockFetchWithValue } from './test-constants'

const FlagsPage: FC<{ flags: string[] }> = ({ flags: names }) => {
    const flags = useFlags(names)
    return <div data-testid="flags">{JSON.stringify(flags)}</div>
}

const renderedFlags = () => JSON.parse(screen.getByTestId('flags').innerHTML)

describe('useFlags variant', () => {
    test('re-renders when only the variant changes', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({ identity: experimentIdentity })
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsPage flags={['font_size']} />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(renderedFlags().font_size).toEqual({ enabled: true, value: 16, variant: 'control' })
        })

        getMockFetchWithValue(mockFetch, {
            flags: [
                { enabled: true, feature_state_value: 16, variant: 'large', feature: { id: 6149, name: 'font_size' } },
            ],
            traits: [],
        })
        await flagsmith.getFlags()

        await waitFor(() => {
            expect(renderedFlags().font_size.variant).toBe('large')
        })
    })

    test('surfaces the variant when the flag name needs normalising', async () => {
        const { flagsmith, initConfig } = getFlagsmith({ identity: experimentIdentity })
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsPage flags={['Font Size']} />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(renderedFlags()['Font Size']).toEqual({ enabled: true, value: 16, variant: 'control' })
        })
    })
})
