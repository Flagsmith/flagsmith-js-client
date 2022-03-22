import React from 'react';
import flagsmith from 'react-native-flagsmith';
import {FlagsmithProvider} from 'flagsmith/react';
import ExampleComponent from './ExampleComponent';
export default function () {
  return (
    <FlagsmithProvider
      options={{
        environmentID: 'QjgYur4LQTwe5HpvbvhpzK',
      }}
      flagsmith={flagsmith}>
      <ExampleComponent />
    </FlagsmithProvider>
  );
}
