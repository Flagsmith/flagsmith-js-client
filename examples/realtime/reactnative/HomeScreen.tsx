import {useFlags} from 'react-native-flagsmith/react';
import React, {FC} from 'react';
import {SafeAreaView, Text} from 'react-native';

type HomeScreenType = {};

const HomeScreen: FC<HomeScreenType> = ({}) => {
  const flags = useFlags(['test']); // only causes re-render if specified flag values / traits change
  return (
    <SafeAreaView>
      <Text>{JSON.stringify(flags)}</Text>
    </SafeAreaView>
  );
};

export default HomeScreen;
