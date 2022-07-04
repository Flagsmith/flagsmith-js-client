import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react';
import { useFlags, useFlagsmith } from 'flagsmith/react';

const Home: NextPage = () => {
  const flags = useFlags(["font_size"],["example_trait"]) // only causes re-render if specified flag values / traits change
  const flagsmith = useFlagsmith()
  const identify = ()=>{
    flagsmith.identify("flagsmith_sample_user")
  }
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
