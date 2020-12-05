<img width="100%" src="https://raw.githubusercontent.com/SolidStateGroup/bullet-train-frontend/master/hero.png"/>

# Flagsmith Client
[![npm version](https://badge.fury.io/js/flagsmith.svg)](https://badge.fury.io/js/flagsmith)
[![](https://data.jsdelivr.com/v1/package/npm/flagsmith/badge)](https://www.jsdelivr.com/package/npm/flagsmith)

The SDK clients for web and React Native for [https://bullet-train.io/](https://www.bullet-train.io/). Flagsmith allows you to manage feature flags and remote config across multiple projects, environments and organisations.

## Getting Started
**For full documentation visit [https://docs.bullet-train.io/clients/javascript/](https://docs.bullet-train.io/clients/javascript/)**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See running in production for notes on how to deploy the project on a live system.

## Usage

```npm i react-native-flagsmith --save```

**Retrieving feature flags for your project**

```javascript
import flagsmith from "react-native-flagsmith"; //Add this line if you're using flagsmith via npm

flagsmith.identify("flagsmith_sample_user");

flagsmith.init({
	environmentID:"<YOUR_ENVIRONMENT_KEY>",
    cacheFlags: true,
	onChange: (oldFlags,params)=>{ //Occurs whenever flags are changed
	
		const {isFromServer} = params; //determines if the update came from the server or local cached storage
		
		//Check for a feature
		if (flagsmith.hasFeature("myCoolFeature")){
			myCoolFeature();
		}
				
		//Or, use the value of a feature
		const bannerSize = flagsmith.getValue("bannerSize");
		
		//Check whether value has changed
		const bannerSizeOld = oldFlags["bannerSize"] && oldFlags["bannerSize"].value;
		if (bannerSize !== bannerSizeOld) {
		
		}

	}
});
```

**Initialisation options**

| Property        | Description           | Required  | Default Value  |
| ------------- |:-------------:| -----:| -----:|
| ```environmentID```     | Defines which project environment you wish to get flags for. *example ACME Project - Staging.* | **YES** | null
| ```onChange```     | Your callback function for when the flags are retrieved ``` (flags,{isFromServer:true/false})=>{...} ``` | **YES** | null
| ```onError```     | Callback function on failure to retrieve flags. ``` (error)=>{...} ``` | | null
| ```AsyncStorage```     | Needed for cacheFlags option, used to tell the library what implementation of AsyncStorage your app uses, i.e. ReactNative.AsyncStorage vs @react-native-community/async-storage. | | null
| ```cacheFlags```     | Any time flags are retrieved they will be cached, flags and identities will then be retrieved from local storage before hitting the API ``` | | null
| ```enableAnalytics```     | Enable sending analytics for getValue and hasFeature evaluations. | | false
| ```enableLogs```     | Enables logging for key Flagsmith events ``` | | null
| ```defaultFlags```     | Allows you define default features, these will all be overridden on first retrieval of features. | | null
| ```preventFetch```     | If you want to disable fetching flags and call getFlags later. | | false
| ```api```     | Use this property to define where you're getting feature flags from, e.g. if you're self hosting. | | https://featureflagger.3qqe.flynnhub.com/api/

**Available Functions**

| Property        | Description |
| ------------- |:-------------:|
| ```init```     | Initialise the sdk against a particular environment
| ```hasFeature(key)```     | Get the value of a particular feature e.g. ```flagsmith.hasFeature("powerUserFeature") // true```
| ```getValue(key)```     | Get the value of a particular feature e.g. ```flagsmith.getValue("font_size") // 10```
| ```getTrait(key)```     | Once used with an identified user you can get the value of any trait that is set for them e.g. ```flagsmith.getTrait("accepted_cookie_policy")```
| ```setTrait(key, value)```     | Once used with an identified user you can set the value of any trait relevant to them e.g. ```flagsmith.setTrait("accepted_cookie_policy", true)```
| ```setTraits(object)```     | Set multiple traits e.g. ```flagsmith.setTraits({foo:"bar",numericProp:1,boolProp:true})```. Setting a value of null for a trait will remove that trait.
| ```incrementTrait(key, value)```     | You can also increment/decrement a particular trait them e.g. ```flagsmith.incrementTrait("click_count", 1)```
| ```startListening(ticks=1000)```     | Poll the api for changes every x milliseconds
| ```stopListening()```     | Stop polling the api
| ```getFlags()```     | Trigger a manual fetch of the environment features, if a user is identified it will fetch their features
| ```identify(userId)```     | Identify as a user, this will create a user for your environment in the dashboard if they don't exist, it will also trigger a call to ```getFlags()```
| ```logout()```     | Stop identifying as a user, this will trigger a call to ```getFlags()```

## Notes on initialisation

``identify``, ``setTrait`` and ``setTraits`` all trigger calls to ``getFlags``, which in turn hits the get flags endpoint. This is due to identities and traits affecting flags that are returned.
 
However, you can avoid these extra calls to get flags if you call these functions before  ``flagsmith.init``. 

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/kyle-ssg/c36a03aebe492e45cbd3eefb21cb0486) for details on our code of conduct, and the process for submitting pull requests to us.

## Getting Help

If you encounter a bug or feature request we would like to hear about it. Before you submit an issue please search existing issues in order to prevent duplicates. 

## Get in touch

If you have any questions about our projects you can email <a href="mailto:projects@solidstategroup.com">projects@solidstategroup.com</a>.

