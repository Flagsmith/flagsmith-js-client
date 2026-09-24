import React, { FC } from 'react'
import { act, render, screen, waitFor } from '@testing-library/react'
import { FlagsmithProvider, useFlags } from '../react'
import { experimentIdentity, getFlagsmith } from './test-constants'

// Regression test for https://github.com/Flagsmith/flagsmith-js-client/issues/391
//
// react.tsx used to instantiate a single Emitter at module scope, so every
// FlagsmithProvider in the process shared the same event bus: an internal
// `_trigger()` call on ANY flagsmith instance would notify hooks subscribed
// to every provider tree, not just the one that changed. This test renders
// two independent FlagsmithProvider trees and asserts that firing instance
// `a`'s internal trigger only re-renders consumers of `a`'s tree, never `b`'s.
//
// Flags are mutated directly (rather than via a mocked fetch + getFlags())
// because `_fetch` in flagsmith-core is a module-level variable shared by
// all instances, which is an unrelated, pre-existing limitation of the
// mock-fetch test setup for concurrent instances - orthogonal to the
// per-provider event bus behaviour this test targets.

const Probe: FC<{ label: string; onRender: () => void }> = ({ label, onRender }) => {
    const flags = useFlags(['font_size'])
    onRender()
    return <div data-testid={label}>{JSON.stringify(flags.font_size)}</div>
}

describe('FlagsmithProvider event isolation', () => {
    it('does not notify one provider tree when another provider tree updates', async () => {
        const a = getFlagsmith({ identity: experimentIdentity })
        const b = getFlagsmith({ identity: experimentIdentity })

        const renderCountA = jest.fn()
        const renderCountB = jest.fn()

        render(
            <>
                <FlagsmithProvider flagsmith={a.flagsmith} options={a.initConfig}>
                    <Probe label="a" onRender={renderCountA} />
                </FlagsmithProvider>
                <FlagsmithProvider flagsmith={b.flagsmith} options={b.initConfig}>
                    <Probe label="b" onRender={renderCountB} />
                </FlagsmithProvider>
            </>
        )

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('a').innerHTML)).toEqual({ enabled: true, value: 16, variant: 'control' })
            expect(JSON.parse(screen.getByTestId('b').innerHTML)).toEqual({ enabled: true, value: 16, variant: 'control' })
        })

        // FlagsmithProvider wires up `_trigger` on the flagsmith instance it
        // was given; both instances must be initialised for this to be set.
        expect(typeof (a.flagsmith as any)._trigger).toBe('function')
        expect(typeof (b.flagsmith as any)._trigger).toBe('function')

        renderCountA.mockClear()
        renderCountB.mockClear()

        // Mutate only instance `a`'s flags in place, then fire the same
        // internal trigger flagsmith-core calls after a real flag update.
        act(() => {
            const flagsmithInternal = a.flagsmith as unknown as { flags: Record<string, { value: unknown }> }
            flagsmithInternal.flags = {
                ...flagsmithInternal.flags,
                font_size: { ...flagsmithInternal.flags.font_size, value: 32 },
            }
            ;(a.flagsmith as any)._trigger()
        })

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId('a').innerHTML)).toEqual({ enabled: true, value: 32, variant: 'control' })
        })

        // Tree `b` must never have re-rendered or changed as a result of `a`'s trigger.
        expect(renderCountB).not.toHaveBeenCalled()
        expect(JSON.parse(screen.getByTestId('b').innerHTML)).toEqual({ enabled: true, value: 16, variant: 'control' })
    })
})
