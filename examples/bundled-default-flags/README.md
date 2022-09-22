<img width="100%" src="https://github.com/Flagsmith/flagsmith/raw/main/static-files/hero.png"/>


Sometimes it is preferable to bundle the last known flagsmith state into your application.

This could be for the following purposes:

- Supporting offline applications
- Tolerance against non 200 responses from the Flagsmith API
- Preventing any blocking calls from your applications

More information on this topic can be found [here](https://docs.flagsmith.com/guides-and-examples/defensive-coding).


# How to bundle defaults flags

For applications that use JS Flagsmith client the process for bundling default flags to your application is as follows:

 1 - When your application gets built e.g. npm's postinstall, run ```flagsmith get --output ./flag-state.json```
        - The flagsmith cli will use the environment variable FLAGSMITH_ENVIRONMENT to determine what environment to use.

 2 - Before calling  ```flagsmith.init()```, use the ``flagsmith.setState(state)`` function passing in the output of flag-state.json.
 

