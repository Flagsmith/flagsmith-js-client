import { useFlags } from '../../lib/flagsmith/react';

interface TestFlags {
    stringFlag: string;
    numberFlag: number;
    booleanFlag: boolean;
}

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestUseFlagsGenericInterface = () => {
    const correctFlags = useFlags<TestFlags>(['stringFlag', 'numberFlag']);

    // Type checking
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const stringFlag: string | null = correctFlags.stringFlag.value;
    //eslint-disable-next-line @typescript-eslint/no-unused-vars
    const numberFlag: number | null = correctFlags.numberFlag.value;

    correctFlags.booleanFlag;

    // @ts-expect-error
    const incorrectFlags = useFlags<TestFlags>(['non-existing-flag']);
    return null;
};

//eslint-disable-next-line @typescript-eslint/no-unused-vars
const TestUseFlagsGenericString = () => {
    type StringTypes = 'stringFlag' | 'numberFlag';

    // Should work with correct keys
    const correctFlags = useFlags<StringTypes>(['stringFlag', 'numberFlag']);

    // Type checking
    correctFlags.stringFlag;
    correctFlags.numberFlag;

    // @ts-expect-error - invalid flag key
    const invalidFlags = useFlags<'incorrectFlag'>(['nonexistentFlag']);
};
