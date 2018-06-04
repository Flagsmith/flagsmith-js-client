<img width="100%" src="./hero.png"/>

# Bullet Train Client
[![Gitter](https://img.shields.io/gitter/room/gitterHQ/gitter.svg)](https://gitter.im/SolidStateGroup/bullettrain?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![npm version](https://badge.fury.io/js/bullet-train-client.svg)](https://badge.fury.io/js/bullet-train-client)
[![](https://data.jsdelivr.com/v1/package/npm/bullet-train-client/badge)](https://www.jsdelivr.com/package/npm/bullet-train-client)

The SDK clients for web and React Native for [https://bullet-train.io/](https://www.bullet-train.io/). Bullet Train allows you to manage feature flags and remote config across multiple projects, environments and organisations.

## Getting Started
**For full documentation visit [https://docs.bullet-train.io/clients/javascript/](https://docs.bullet-train.io/clients/javascript/)**

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See running in production for notes on how to deploy the project on a live system.

## Installing

### VIA npm
```npm i bullet-train-client --save```
	
#### Or script tag
```<script src="https://cdn.jsdelivr.net/npm/bullet-train-client/lib/index.js"></script>```

### VIA npm for React Native
```npm i react-native-bullet-train --save```

## Usage
**Retrieving feature flags for your project**

```javascript
import bulletTrain from "bullet-train-client or react-native-bullet-train"; //Add this line if you're using bulletTrain via npm

bulletTrain.init({
	environmentID:"<YOUR_ENVIRONMENT_KEY>",
	onChange: (oldFlags,params)=>{ //Occurs whenever flags are changed
	
		const {isFromServer} = params; //determines if the update came from the server or local cached storage
		
		//Check for a feature
		if (bulletTrain.hasFeature("myCoolFeature")){
			myCoolFeature();
		}
		
		
		//Or, use the value of a feature
		const bannerSize = bulletTrain.getValue("bannerSize");
		
		//Check whether value has changed
		const bannerSizeOld = oldFlags["bannerSize"] && oldFlags["bannerSize"].value;
		if (bannerSize !== bannerSizeOld) {
		
		}

	}
});
```
**Available Options**

| Property        | Description           | Required  | Default Value  |
| ------------- |:-------------:| -----:| -----:|
| ```environmentID```     | Defines which project environment you wish to get flags for. *example ACME Project - Staging.* | **YES** | null
| ```onChange```     | Your callback function for when the flags are retrieved ``` (flags,{isFromServer:true/false})=>{...} ``` | **YES** | null
| ```onError```     | Callback function on failure to retrieve flags. ``` (error)=>{...} ``` | | null
| ```defaultFlags```     | Allows you define default features, these will all be overridden on first retrieval of features. | | null
| ```disableCache```     | If you want to disable local storage of feature flags. | | false
| ```api```     | Use this property to define where you're getting feature flags from, e.g. if you're self hosting. | | https://featureflagger.3qqe.flynnhub.com/api/

**Identifying users**

Identifying users allows you to target specific users from the [Bullet Train dashboard](https://www.bullet-train.io/).
You can call this before or after you initialise the project, calling it after will re-fetch features from the API.

```
bulletTrain.identify("bullet_train_sample_user");
```

## Contributing

Please read [CONTRIBUTING.md](https://gist.github.com/kyle-ssg/c36a03aebe492e45cbd3eefb21cb0486) for details on our code of conduct, and the process for submitting pull requests to us.

## Getting Help

If you encounter a bug or feature request we would like to hear about it. Before you submit an issue please search existing issues in order to prevent duplicates. 

## Get in touch

If you have any questions about our projects you can email <a href="mailto:projects@solidstategroup.com">projects@solidstategroup.com</a>.

