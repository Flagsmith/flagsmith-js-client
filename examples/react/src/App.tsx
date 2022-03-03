import React from 'react';
import {useFlags} from 'flagsmith/react'
function App() {
  const flags = useFlags(["font_size"]) // only causes re-render if flag values change
  flags.
  return (
    <div className="App">

    </div>
  );
}

export default App;
