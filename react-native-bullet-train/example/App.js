/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, {Component} from 'react';
import {
    Platform,
    StyleSheet,
    Button,
    Text,
    View
} from 'react-native';
import bulletTrain from "./bullet-train";

const environmentID = "QjgYur4LQTwe5HpvbvhpzK";

export default class App extends Component<Props> {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isLoading: true,
            logs: []
        };
    }

    componentWillMount() {
        const {handleFlags, handleFlagsError} = this;
        bulletTrain.init({
            environmentID,
            onChange: handleFlags,
            onError: handleFlagsError,
            defaultFlags: {
                default_feature: true,
                font_size: 12,
            }
        });
        bulletTrain.startListening(2000)

    }

    logout = () => {
        bulletTrain.logout();
        this.forceUpdate();
    };

    login = () => {
        bulletTrain.identify("bullet_train_sample_user");
        this.forceUpdate();
    };

    render() {

        const fontSize = parseInt(bulletTrain.getValue("font_size"));
        const {isLoading, logs} = this.state;
        return isLoading ? <Text>Loading</Text> : (
            <View>
                <Text style={{fontSize}}>
                    {JSON.stringify(bulletTrain.flags)}
                </Text>
                <Text style={styles.title}>
                    Events
                </Text>
                {bulletTrain.identity ? (
                    <Button title={"logout"} onPress={this.logout}/>
                ) : <Button title={"login as sample user"} onPress={this.login}/>}
                {logs.map(({timestamp, data, params, oldData},i) => (
                    <Text key={i}>
                        {timestamp}: {data} {params} {oldData}
                    </Text>
                ))}
            </View>
        );
    }

    handleFlags = (oldFlags, params) => {
        this.setState({
            ...params,
            isLoading: false,
            logs: [{
                timestamp: new Date().toDateString(),
                params: JSON.stringify(params),
                oldData: JSON.stringify(oldFlags),
                data: JSON.stringify(bulletTrain.getAllFlags())
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
    welcome: {
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
