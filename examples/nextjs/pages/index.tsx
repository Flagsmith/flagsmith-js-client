import type { NextPage } from 'next';
import { useFlags, useFlagsmith } from 'flagsmith-es/react';
import { FlagOptions } from '../types/flag-options';
import { TraitOptions } from '../types/trait-options';

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
  console.log(json)

  const font_size = flagsmith.getValue("font_size", {fallback:null})

  return (
      <div className="App">
        font_size: {flags.font_size?.value}
        example_trait: {flags.example_trait}
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
