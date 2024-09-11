import React, { FC } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { FlagsmithProvider, useFlags, useFlagsmithLoading } from '../lib/flagsmith/react';
import {
    defaultState, delay,
    environmentID,
    getFlagsmith,
    getMockFetchWithValue,
    identityState,
    testIdentity,
} from './test-constants';
import removeIds from './test-utils/remove-ids';
const FlagsmithPage: FC<any> = () => {
    const flags = useFlags(Object.keys(defaultState.flags))
    const loadingState = useFlagsmithLoading()
    return (
        <>
            <div data-testid="flags">
                {JSON.stringify(flags)}
            </div>
            <div data-testid="loading-state">
                {JSON.stringify(loadingState)}
            </div>
        </>
    );
};

export default FlagsmithPage;
describe('FlagsmithProvider', () => {
    it('renders without crashing', () => {

        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );
    });
    it('renders default state without any cache or default flags', () => {

        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );

        expect(JSON.parse(screen.getByTestId("flags").innerHTML)).toEqual({"hero":{"enabled":false,"value":null},"font_size":{"enabled":false,"value":null},"json_value":{"enabled":false,"value":null},"number_value":{"enabled":false,"value":null},"off_value":{"enabled":false,"value":null}})
        expect(JSON.parse(screen.getByTestId("loading-state").innerHTML)).toEqual({"isLoading":true,"isFetching":true,"error":null,"source":"NONE"})
    });
    it('fetches and renders flags', async () => {

        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );

        expect(mockFetch).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId("loading-state").innerHTML)).toEqual({"isLoading":false,"isFetching":false,"error":null,"source":"SERVER"});
            expect(JSON.parse(screen.getByTestId("flags").innerHTML)).toEqual(removeIds(defaultState.flags));
        });
    });
    it('fetches and renders flags for an identified user', async () => {

        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange, identity:testIdentity})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );

        expect(mockFetch).toHaveBeenCalledTimes(1);
        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId("loading-state").innerHTML)).toEqual({"isLoading":false,"isFetching":false,"error":null,"source":"SERVER"});
            expect(JSON.parse(screen.getByTestId("flags").innerHTML)).toEqual(removeIds(identityState.flags));
        });
    });
    it('renders cached flags', async () => {

        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage } = getFlagsmith({
            onChange,
            cacheFlags: true,
            preventFetch: true,
            defaultFlags: defaultState.flags
        });
        await AsyncStorage.setItem("BULLET_TRAIN_DB", JSON.stringify({
            ...defaultState
        }) )
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId("loading-state").innerHTML)).toEqual({"isLoading":false,"isFetching":false,"error":null,"source":"CACHE"});
            expect(JSON.parse(screen.getByTestId("flags").innerHTML)).toEqual(removeIds(defaultState.flags));
        });
    });
    it('renders default flags', async () => {

        const onChange = jest.fn();
        const { flagsmith, initConfig, AsyncStorage } = getFlagsmith({
            onChange,
            preventFetch: true,
            defaultFlags: defaultState.flags
        });
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );

        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId("loading-state").innerHTML)).toEqual({"isLoading":false,"isFetching":false,"error":null,"source":"DEFAULT_FLAGS"});
            expect(JSON.parse(screen.getByTestId("flags").innerHTML)).toEqual(removeIds(defaultState.flags));
        });
    });
    it('handles race condition of init returning after identify', async () => {

        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        getMockFetchWithValue(mockFetch, [{
            enabled: false,
            feature_state_value: null,
            feature: {
                id: 1,
                name: "hero"
            }
        }],300) // never resolves

        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );
        expect(mockFetch).toHaveBeenCalledTimes(1);
        getMockFetchWithValue(mockFetch, {
            flags: [{
                enabled: true,
                feature_state_value: null,
                feature: {
                    id: 1,
                    name: "hero"
                }
            }]
        },0)
        await flagsmith.identify(testIdentity)
        expect(mockFetch).toHaveBeenCalledTimes(2);
        await waitFor(() => {
            expect(JSON.parse(screen.getByTestId("flags").innerHTML).hero.enabled).toBe(true)
        });
        await delay(500)
        expect(JSON.parse(screen.getByTestId("flags").innerHTML).hero.enabled).toBe(true)
    });
});
