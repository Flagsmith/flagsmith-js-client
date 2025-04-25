import React from 'react';
import {render} from '@testing-library/react';
import {FlagsmithProvider, useFlags, useFlagsmith} from '../lib/flagsmith/react';
import {getFlagsmith,} from './test-constants';
import { IFlagsmithTrait } from '../types';


describe.only('FlagsmithProvider', () => {
    it('should allow supplying interface generics to useFlagsmith', () => {
        const FlagsmithPage = ()=> {
            const typedFlagsmith = useFlagsmith<
                {
                    stringFlag: string
                    numberFlag: number
                    objectFlag: { first_name: string }
                }
            >()
            //@ts-expect-error - feature not defined
            typedFlagsmith.hasFeature("fail")
            //@ts-expect-error - feature not defined
            typedFlagsmith.getValue("fail")

            typedFlagsmith.hasFeature("stringFlag")
            typedFlagsmith.hasFeature("numberFlag")
            typedFlagsmith.getValue("stringFlag")
            typedFlagsmith.getValue("numberFlag")

            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const stringFlag: string|null = typedFlagsmith.getValue("stringFlag")
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const numberFlag: number|null = typedFlagsmith.getValue("numberFlag")
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const firstName: string | undefined = typedFlagsmith.getValue("objectFlag")?.first_name

            // @ts-expect-error - invalid does not exist on type announcement
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const invalidPointer: string | undefined = typedFlagsmith.getValue("objectFlag")?.invalid

            // @ts-expect-error - feature should be a number
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const incorrectNumberFlag: string = typedFlagsmith.getValue("numberFlag")

            return <></>
        }
        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );
    });
    it('should allow supplying interface generics to useFlags', () => {
        const FlagsmithPage = ()=> {
            interface MyFeatureInterface {
                stringFlag: string
                numberFlag: number
                objectFlag: { first_name: string }
            }
            const typedFlagsmith = useFlags<MyFeatureInterface>(["stringFlag", "numberFlag", "objectFlag"])
            
            // @ts-expect-error - feature not defined 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const wrongTypedFlagsmith = useFlags<MyFeatureInterface>(["non-existing-flag"])
            //@ts-expect-error - feature not defined
            typedFlagsmith.fail?.enabled
            //@ts-expect-error - feature not defined
            typedFlagsmith.fail?.value

            typedFlagsmith.numberFlag
            typedFlagsmith.stringFlag
            typedFlagsmith.objectFlag

            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const stringFlag: string = typedFlagsmith.stringFlag?.value
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const numberFlag: number = typedFlagsmith.numberFlag?.value
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const firstName: string = typedFlagsmith.objectFlag?.value?.first_name

            // @ts-expect-error - invalid does not exist on type announcement
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const invalidPointer: string = typedFlagsmith.objectFlag?.value?.invalid

            // @ts-expect-error - feature should be a number
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const incorrectNumberFlag: string = typedFlagsmith.numberFlag?.value

            return <></>
        }
        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );
    });
    it('should allow supplying string type to useFlags', () => {
        const FlagsmithPage = ()=> {
            type StringTypes = "stringFlag" | "numberFlag" | "objectFlag"
            const typedFlagsmith = useFlags<StringTypes>(["stringFlag", "numberFlag", "objectFlag"])
            
            // @ts-expect-error - feature not defined 
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const wrongTypedFlagsmith = useFlags<StringTypes>(["non-existing-flag"])

            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const stringFlag: IFlagsmithTrait = typedFlagsmith.stringFlag
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const numberFlag: IFlagsmithTrait = typedFlagsmith.numberFlag
            //eslint-disable-next-line @typescript-eslint/no-unused-vars
            const firstName: IFlagsmithTrait = typedFlagsmith.objectFlag

            return <></>
        }
        const onChange = jest.fn();
        const {flagsmith,initConfig, mockFetch} = getFlagsmith({onChange})
        render(
            <FlagsmithProvider flagsmith={flagsmith} options={initConfig}>
                <FlagsmithPage/>
            </FlagsmithProvider>
        );
    });
});
