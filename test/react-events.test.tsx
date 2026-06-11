import React, { FC, useState } from 'react'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { FlagsmithProvider, useExperiment } from '../react'
import { getFlagsmith, testIdentity, experimentIdentity, getMockFetchWithValue } from './test-constants'

const eventsUrl = 'https://events.test/'

function eventsConfig(extra: any = {}) {
    return {
        enableEvents: true,
        eventProcessorConfig: { eventsApiUrl: eventsUrl, flushInterval: 60000 },
        ...extra,
    }
}

function eventCalls(mockFetch: jest.Mock) {
    return mockFetch.mock.calls.filter(([url]: [string]) => url.includes('/v1/events'))
}

function exposures(mockFetch: jest.Mock) {
    return eventCalls(mockFetch).flatMap(([, opts]: [string, any]) =>
        JSON.parse(opts.body).events.filter((e: any) => e.event === '$flag_exposure')
    )
}

const Probe: FC<{ feature: string }> = ({ feature }) => {
    const flag = useExperiment(feature)
    return <div data-testid="exp">{JSON.stringify(flag)}</div>
}

describe('useExperiment', () => {
    test('fires one $flag_exposure when identified and source is SERVER', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: experimentIdentity }))
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="font_size" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)).toEqual(
                expect.objectContaining({ enabled: true, value: 16 })
            )
        })

        await flagsmith.flushEvents()
        const fired = exposures(mockFetch)
        expect(fired).toHaveLength(1)
        expect(fired[0]).toEqual(expect.objectContaining({
            feature_name: 'font_size',
            identifier: experimentIdentity,
            value: 'control',
        }))
    })

    test('repeated parent re-renders produce only one exposure', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: experimentIdentity }))

        const Storm: FC = () => {
            const [n, setN] = useState(0)
            return (
                <>
                    <button data-testid="bump" onClick={() => setN((x) => x + 1)}>bump</button>
                    <Probe feature="font_size" />
                    <span data-testid="n">{n}</span>
                </>
            )
        }

        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Storm />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.value).toBe(16)
        })

        for (let i = 0; i < 5; i++) {
            fireEvent.click(screen.getByTestId('bump'))
        }
        await waitFor(() => expect(screen.getByTestId('n').innerHTML).toBe('5'))

        await flagsmith.flushEvents()
        expect(exposures(mockFetch)).toHaveLength(1)
    })

    test('a variant change fires a second exposure even when the value is unchanged', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: experimentIdentity }))
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="font_size" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.value).toBe(16)
        })

        // Next fetch buckets the user into a different variant with the same value.
        getMockFetchWithValue(mockFetch, {
            flags: [
                { enabled: true, feature_state_value: 16, variant: 'large', feature: { id: 6149, name: 'font_size' } },
            ],
            traits: [],
        })
        await flagsmith.getFlags()

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.variant).toBe('large')
        })

        await flagsmith.flushEvents()
        const values = exposures(mockFetch).map((e: any) => e.value)
        expect(values).toEqual(['control', 'large'])
    })

    test('fires a fresh exposure when identity changes even if the value is unchanged', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: experimentIdentity }))
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="font_size" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.value).toBe(16)
        })

        // A different identity that resolves the SAME font_size variant and value.
        getMockFetchWithValue(mockFetch, {
            flags: [
                { enabled: true, feature_state_value: 16, variant: 'control', feature: { id: 6149, name: 'font_size' } },
            ],
            traits: [],
        })
        await flagsmith.identify('other_identity')

        await waitFor(async () => {
            await flagsmith.flushEvents()
            expect(exposures(mockFetch)).toHaveLength(2)
        })
        expect(exposures(mockFetch).map((e: any) => e.identifier)).toEqual([experimentIdentity, 'other_identity'])
    })

    test('renders the flag but fires no exposure when events are disabled', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith({ identity: testIdentity })
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="font_size" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.value).toBe(16)
        })

        await flagsmith.flushEvents()
        expect(eventCalls(mockFetch)).toHaveLength(0)
    })

    test('fires no exposure when there is no identity, still renders the flag', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig())
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="font_size" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('exp').innerHTML)?.value).toBe(16)
        })

        await flagsmith.flushEvents()
        expect(eventCalls(mockFetch)).toHaveLength(0)
    })

    test('returns null and fires no exposure for an absent feature', async () => {
        const { flagsmith, initConfig, mockFetch } = getFlagsmith(eventsConfig({ identity: testIdentity }))
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <Probe feature="does_not_exist" />
            </FlagsmithProvider>
        )

        await waitFor(() => {
            expect(screen.getByTestId('exp').innerHTML).toBe('null')
        })

        await flagsmith.flushEvents()
        expect(eventCalls(mockFetch)).toHaveLength(0)
    })
})
