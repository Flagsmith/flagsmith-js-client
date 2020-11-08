import React, {Component} from 'react';
import flagsmith from "bullet-train-client";
const environmentID = "uCDQzKWgejrutqSYYsKWen";

//Define default flags

export default class App extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      isLoading: true,
      logs: []
    };
  }

  componentWillMount() {
    const { handleFlags, handleFlagsError } = this;
    flagsmith.init({
      environmentID,
      onChange: handleFlags,
      onError: handleFlagsError,
      cacheFlags: true,
      enableLogs: true,
      defaultFlags: {
        default_feature: true,
        font_size: 12,
      }
    });
    // flagsmith.startListening(2000)

  }

  logout = () => {
    flagsmith.logout();
    this.forceUpdate();
  };

  login = () => {
    flagsmith.identify("flagsmith_sample_user");
    this.forceUpdate();
  };

  submitTrait = () => {
    flagsmith.setTrait('example_trait', "Some value " + Math.floor(Math.random() * 10) + "");
  }

  increment = (value) => {
    flagsmith.incrementTrait("button_clicks", value)
  };

  render() {

    const fontSize = parseInt(flagsmith.getValue("font_size"));
    const trait = flagsmith.getTrait("example_trait") + "";
    const buttonClicks = flagsmith.getTrait("button_clicks");
    const { submitTrait } = this;
    const { isLoading, logs } = this.state;
    return isLoading ? <div>Loading</div> : (
        <div>
          <h2>{environmentID}</h2>
          <p style={{ fontSize }}>
            {JSON.stringify(flagsmith.flags)}
          </p>
          {flagsmith.identity ? (
              <div>
                <div>
                  <div>
                    <div>
                      Button Clicks: {buttonClicks ? buttonClicks : "0"}
                    </div>
                    <button onClick={() => this.increment(-1)}>
                      Decrement trait
                    </button>
                    <button onClick={() => this.increment(1)}>
                      Increment trait
                    </button>
                  </div>
                  <button onClick={submitTrait}>
                    Toggle user trait
                  </button>
                  <div>
                    example_trait: {trait}
                  </div>
                </div>
                <button onClick={this.logout}>
                  logout
                </button>
              </div>
          ) : <button onClick={this.login}>
            Login as sample user
          </button>}
          <h3>
            Events
          </h3>
          {logs.map(({ timestamp, data,  params, oldData }, i) => (
              <div style={{padding:10, backgroundColor:i%2?"#eaeaea": "white", position:'relative'}} key={i}>
                <div style={{position:'absolute', top:10, right:10}}>
                  {timestamp}
                </div>
                <div>
                  <div>
                    <strong>
                      Traits
                    </strong>
                  </div>
                  {data}
                </div>
                <div>
                  <div>
                    <strong>
                      Params
                    </strong>
                  </div>
                  {params}
                </div>
              </div>
          ))}
        </div>
    );
  }

  handleFlags = (oldFlags, params) => {
    this.setState({
      ...params,
      isLoading: false,
      logs: [{
        timestamp: new Date().toTimeString(),
        params: JSON.stringify(params),
        data: JSON.stringify(flagsmith.getAllFlags(), null, 2),
      }].concat(this.state.logs)
    });
  };

  handleFlagsError = (data) => {

  };


}
