import React from 'react';
import flagsmith from 'react-native-flagsmith';
import {FlagsmithProvider} from 'flagsmith/react';
import AppComponent from './ExampleComponent';

export default function () {
  return (
    <FlagsmithProvider
      options={{
        api: 'https://edge.bullet-train-staging.win/api/v1/',
        environmentID: 'AbXqsQqLLAzmfj5SGCm8Ng',
        enableLogs: true,
        realtime: true,
      }}
      flagsmith={flagsmith}>
      <AppComponent />
    </FlagsmithProvider>
  );
}
