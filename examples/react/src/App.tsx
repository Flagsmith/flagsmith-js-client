import React, {useEffect} from 'react';
import {useFlags, useFlagsmith} from 'kyle-test2/react'
function App() {
  const flags = useFlags(["font_size"],["example_trait"]) // only causes re-render if specified flag values / traits change
    const flagsmith = useFlagsmith()
    const identify = ()=>{
        flagsmith.identify("flagsmith_sample_user")
    }
    useEffect(()=>{
        identify()
    },[])
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

export default App;
