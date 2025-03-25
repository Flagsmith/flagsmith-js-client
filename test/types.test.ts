// Sample test
import {getFlagsmith} from './test-constants';
import {IFlagsmith} from '../types';

describe('Flagsmith Types', () => {

    // The following tests will fail to compile if any of the types fail / expect-error has no type issues
    // Therefor all of the following ts-expect-errors and eslint-disable-lines are by design
    test('should allow supplying string generics to a flagsmith instance', async () => {
        const { flagsmith,  } = getFlagsmith({ });
        const typedFlagsmith = flagsmith as IFlagsmith<"flag1"|"flag2">
        //@ts-expect-error - feature not defined
        typedFlagsmith.hasFeature("fail")
        //@ts-expect-error - feature not defined
        typedFlagsmith.getValue("fail")

        typedFlagsmith.hasFeature("flag1")
        typedFlagsmith.hasFeature("flag2")
        typedFlagsmith.getValue("flag1")
        typedFlagsmith.getValue("flag2")
    });
    test('should allow supplying interface generics to a flagsmith instance', async () => {
        const { flagsmith,  } = getFlagsmith({ });
        const typedFlagsmith = flagsmith as IFlagsmith<
            {
                stringFlag: string
                numberFlag: number
                objectFlag: { first_name: string }
            }>
        //@ts-expect-error - feature not defined
        typedFlagsmith.hasFeature("fail")
        //@ts-expect-error - feature not defined
        typedFlagsmith.getValue("fail")

        typedFlagsmith.hasFeature("stringFlag")
        typedFlagsmith.hasFeature("numberFlag")
        typedFlagsmith.getValue("stringFlag")
        typedFlagsmith.getValue("numberFlag")

        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const stringFlag: string | null = typedFlagsmith.getValue("stringFlag")
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const numberFlag: number | null = typedFlagsmith.getValue("numberFlag")
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const firstName: string | undefined = typedFlagsmith.getValue("objectFlag")?.first_name

        // @ts-expect-error - invalid does not exist on type announcement
        //eslint-disable-next-line @typescript-eslint/no-unused-vars
        const invalidPointer: string = typedFlagsmith.getValue("objectFlag")?.invalid

        // @ts-expect-error - feature should be a number
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const incorrectNumberFlag: string = typedFlagsmith.getValue("numberFlag")
    });
});
