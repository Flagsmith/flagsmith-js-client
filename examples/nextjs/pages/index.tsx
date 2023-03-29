import type { NextPage } from 'next';
import { useFlags, useFlagsmith, useFlagsmithLoading } from 'flagsmith-es/react';
import { FlagOptions } from '../types/flag-options';
import { TraitOptions } from '../types/trait-options';
import { useEffect } from 'react';

const Home: NextPage = () => {
    const flags = useFlags<FlagOptions, TraitOptions>(["font_size"],["example_trait"]) // only causes re-render if specified flag values / traits change
    const flagsmith = useFlagsmith<FlagOptions, TraitOptions>()
    const identify = ()=>{
        flagsmith.identify("flagsmith_sample_user")
    }
    const json = flagsmith.getValue<{foo: string|null, bar: string|null}>("json_value", {
        json: true,
        fallback: {foo:null,bar:null}
    });

    const loading  = useFlagsmithLoading()
    useEffect(()=>{
        console.log(loading)
    },[loading])
    return (
        <div className="App">
            font_size: {flags.font_size?.value}
            example_trait: {flags.example_trait}
            example_json_trait: {`foo ${json.foo}, bar ${json.bar}`}
            {
                flagsmith.identity? (
                    <button onClick={()=>flagsmith.logout()}>
                        Logout
                    </button>
                ): (
                    <button onClick={identify}>
                        Identify
                    </button>
                )
            }
        </div>
    );
}

export default Home
