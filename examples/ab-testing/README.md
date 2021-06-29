<img width="100%" src="https://raw.githubusercontent.com/Flagsmith/flagsmith/main/static-files/hero.png"/>

## Flagsmith A/B Testing

<img src="./example.png"/>

This repository contains an example of an a/b test. This is accomplished by creating a feature and overriding the feature's value for a segment with a percentage split rule.

An example of this can be ran at https://jsfiddle.net/vw0af7zq/.

## How was this feature created in Flagsmith?

### Step 1: Create a remote config called hero

<img src="./step1.png"/>

Set the value to be the image path you want

### Step 2: Create a segment with a percentage split

<img src="./step2.png"/>

This will mean you can override features for 50% of your users.

### Step 3: Add another segment or user override

<img src="./step3.png"/>

This overrides the hero image for a particular user, the same can be done for a particular segment of users.
You can always override your % split override for particular users or other segments.

## Running the example 

Just clone and open index.html in your preferred browser.
