/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {FlagsmithProvider} from 'react-native-flagsmith/react';
import flagsmith from 'react-native-flagsmith';
import HomeScreen from './HomeScreen';

const environmentID = 'AbXqsQqLLAzmfj5SGCm8Ng';

const options = {
  api: 'https://edge.bullet-train-staging.win/api/v1/',
  environmentID,
  enableLogs: true,
  realtime: true,
  eventSourceUrl: 'https://realtime-staging.flagsmith.com/',
};

function App(): JSX.Element {
  return (
    <FlagsmithProvider flagsmith={flagsmith} options={options}>
      <HomeScreen />
    </FlagsmithProvider>
  );
}

export default App;
