import React, {useCallback, useEffect} from 'react';
import {useFlags, useFlagsmith} from 'flagsmith/react';
import {Text, TouchableOpacity, View} from 'react-native';
import RNEventSource from 'react-native-event-source';

function ExampleComponent() {
  const flags = useFlags(['test']); // only causes re-render if specified flag values / traits change
  const flagsmith = useFlagsmith();
  const identify = useCallback(() => {
    flagsmith.identify('flagsmith_sample_user');
  }, [flagsmith]);

  useEffect(() => {
    const eventSourceUrl =
      'http://sse-lb-eu-west-2-7ba834a-1075512661.eu-west-2.elb.amazonaws.com.global.prod.fastly.net/sse/environments/$ENVIRONMENT/stream';

    const connectionUrl = eventSourceUrl.replace(
      '$ENVIRONMENT',
      'AbXqsQqLLAzmfj5SGCm8Ng',
    );
    const eventSource = new RNEventSource(connectionUrl);
    eventSource.addEventListener('environment_updated', event => {
      console.log(event.type); // message
      console.log(event.data);
    });
  }, []);

  return (
    <View style={{paddingTop: 100}}>
      <Text>{JSON.stringify(flagsmith.getAllFlags())}</Text>
    </View>
  );
}

export default ExampleComponent;
