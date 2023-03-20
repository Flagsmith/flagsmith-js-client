import type { NextPage } from 'next';
import { useFlags } from 'flagsmith-es/react';

const Home: NextPage = () => {
    const flags = useFlags(["test"]) // only causes re-render if specified flag values / traits change
    return (
      <>
        {JSON.stringify(flags)}
      </>
  );
}

export default Home
