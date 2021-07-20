import Head from 'next/head';
import LayoutMain from 'layouts/main';

export default function Home() {
  return (
    <div>
      <Head>
        <title>Flagsmith Example App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <LayoutMain />
    </div>
  );
}

Home.auth = true;
