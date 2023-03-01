import type { NextPage } from 'next';
import { useFlags } from 'flagsmith-es/react';

const Home: NextPage = () => {
  const flags = useFlags(["test"]) // only causes re-render if specified flag values / traits change
    console.log("Rendering", flags.test.enabled)
  return (
      <div className="App">
        {
          JSON.stringify(flags)
        }
      </div>
  );
}

export default Home
