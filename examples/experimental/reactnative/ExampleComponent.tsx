import React from 'react';
import {useFlags, useFlagsmith} from 'flagsmith/react';
import {Text, View} from 'react-native';

function ExampleComponent() {
  useFlags(['test']); // only causes re-render if specified flag values / traits change
  const flagsmith = useFlagsmith();
  return (
    <View style={{paddingTop: 100}}>
      <Text>{JSON.stringify(flagsmith.getAllFlags())}</Text>
    </View>
  );
}

export default ExampleComponent;
