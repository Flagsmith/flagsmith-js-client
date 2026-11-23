import { useFlags } from '../react'
import { IFlagsmithFeature, IFlagsmithTrait } from '../types'

// Checked by tsc without calling hooks outside a React component.
const useCheckFlagTypes = () => {
    const explicit = useFlags<'show_alert' | 'test', 'trait_1' | 'trait_2'>(
        ['show_alert', 'test'],
        ['trait_1', 'trait_2']
    )
    const inferred = useFlags(
        ['show_alert', 'test'] as const,
        ['trait_1'] as const
    )
    const single = useFlags<'show_alert'>(['show_alert'])
    const record = useFlags<{ count: number; label: string }>([
        'count', 'label'
    ])
    const flag: IFlagsmithFeature = explicit.show_alert
    const otherFlag: IFlagsmithFeature = explicit.test
    const inferredFlag: IFlagsmithFeature = inferred.show_alert
    const otherInferredFlag: IFlagsmithFeature = inferred.test
    const singleFlag: IFlagsmithFeature = single.show_alert
    const trait: IFlagsmithTrait = explicit.trait_1
    const otherTrait: IFlagsmithTrait = explicit.trait_2
    const count: number = record.count.value
    const label: string = record.label.value

    // @ts-expect-error - flag was not requested
    explicit.missing
    // @ts-expect-error - trait was not requested
    explicit.trait_3
    // @ts-expect-error - invalid flag name
    useFlags<'show_alert' | 'test'>(['missing'])
    // @ts-expect-error - record flag retains its value type
    const wrong: string = record.count.value

    return {
        flag, otherFlag, inferredFlag, otherInferredFlag, singleFlag,
        trait, otherTrait, count, label, wrong
    }
}

test('union flag type assertions are included in typecheck', () => {
    expect(useCheckFlagTypes).toBeInstanceOf(Function)
})
