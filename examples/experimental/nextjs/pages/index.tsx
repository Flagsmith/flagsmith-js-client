import React from 'react';
import {useFlags, useFlagsmith} from 'flagsmith-es/react';

function ExampleComponent() {
    useFlags(['test']); // only causes re-render if specified flag values / traits change
    const flagsmith = useFlagsmith();
    return (
        <div style={{paddingTop: 100}}>
            {JSON.stringify(flagsmith.getAllFlags())}
        </div>
    );
}

export default ExampleComponent;
