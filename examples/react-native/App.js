/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Button,
  Text,
  View,
  ScrollView,
} from 'react-native';
import flagsmith from "./react-native-flagsmith";
import AsyncStorage from '@react-native-community/async-storage';
const environmentID = "QjgYur4LQTwe5HpvbvhpzK";

export default class App extends Component<Props> {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      logs: []
    };
  }

  componentDidMount() {
    const { handleFlags, handleFlagsError } = this;
    flagsmith.init({
      environmentID,
      cacheFlags: true,
      AsyncStorage,
      enableLogs: true,
      onChange: handleFlags,
      onError: handleFlagsError,
      defaultFlags: {
        default_feature: true,
        font_size: 12,
      }
    });
    flagsmith.startListening(2000)

  }

  logout = () => {
    flagsmith.logout();
    this.forceUpdate();
  };

  submitTrait = () => {
    flagsmith.setTrait('example_trait', "Some value " + Math.floor(Math.random() * 10)+"");
  }

  login = () => {
    flagsmith.identify("flagsmith_sample_user");
    this.forceUpdate();
  };

  increment = (value)=> {
    flagsmith.incrementTrait("button_clicks", value)
  };

  render() {

    const trait = flagsmith.getTrait("example_trait") + "";
    const fontSize = parseInt(flagsmith.getValue("font_size"));
    const buttonClicks = flagsmith.getTrait("button_clicks");
    const { isLoading, logs } = this.state;
    const { submitTrait } = this;
    return isLoading ? <Text>Loading</Text> : (
        <ScrollView style={{ padding: 50 }}>
          {flagsmith.identity ? (
              <View>
                <Button title={"logout"} onPress={this.logout}/>
                <View>
                  <Text>
                    Button Clicks: {buttonClicks ? buttonClicks : "0"}
                  </Text>
                  <Button title={'Decrement trait'} onPress={()=>this.increment(-1)}/>
                  <Button title={'Increment trait'} onPress={()=>this.increment(1)}/>
                </View>

                <Button title={'Toggle user trait'} onPress={submitTrait}/>
                <View>
                  <Text>
                    example_trait: {trait}
                  </Text>
                </View>
              </View>
          ) : <Button title={"login as sample user"} onPress={this.login}/>}
          <Text style={{ fontSize: isNaN(fontSize)? 12: fontSize }}>
            {JSON.stringify(flagsmith.flags)}
          </Text>
          <Text style={styles.title}>
            Events
          </Text>
          {logs.map(({ timestamp, data, params, oldData }, i) => (
              <Text key={i}>
                {timestamp}: {data} {params} oldData}
              </Text>
          ))}
        </ScrollView>
    );
  }

  handleFlags = (oldFlags, params) => {
    this.setState({
      ...params,
      isLoading: false,
      logs: [{
        timestamp: new Date().toTimeString(),
        params: JSON.stringify(params),
        oldData: JSON.stringify(oldFlags),
        data: JSON.stringify(flagsmith.getAllFlags()),
      }].concat(this.state.logs)
    });
  };
  handleFlagsError = (data) => {

  };

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
