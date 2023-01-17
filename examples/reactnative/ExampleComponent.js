import React, {useCallback} from 'react';
import {useFlags, useFlagsmith} from 'react-native-flagsmith/react';
import {Text, TouchableOpacity, View} from 'react-native';
function ExampleComponent() {
  const flags = useFlags(['font_size'], ['example_trait']); // only causes re-render if specified flag values / traits change
  const flagsmith = useFlagsmith();
  const identify = useCallback(() => {
    flagsmith.identify('flagsmith_sample_user');
  }, [flagsmith]);
  return (
    <View style={{paddingTop: 100}}>
      <Text>font_size: {flags.font_size?.value}</Text>
      <Text>example_trait: {flags.example_trait}</Text>
      {flagsmith.identity ? (
        <TouchableOpacity onPress={() => flagsmith.logout()}>
          <Text>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity onPress={identify}>
          <Text>Identify</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

export default ExampleComponent;
