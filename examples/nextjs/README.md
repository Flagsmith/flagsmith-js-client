<img src="http://g.recordit.co/TY8wciTsQH.gif"/>


## Prerequisites

What things you need to install the software and how to install them

https://workperk-api.lollipop.digital/
https://workperk.lollipop.digital/

| Location                                                     | Suggested Version       |
| -------------                                                |:-------------:|
| <a href="https://nodejs.org/en/">NodeJS</a>                     | >= 10.0.0 |
| <a href="https://nodejs.org/en/">npm</a>                        | >= 6.0.0 |

# Deployment with Now
Out the box, this setup supports deploying to https://zeit.co
```$xslt
npm i now -g
now
```

## Installing
```
npm i
```

## Running
**Development**

Hot reloading for client / server
```
npm run dev
```
 
## Mobile
**Preinstall**

Install cocoapods for iOS
```
sudo gem install coocapods
```
 
- /pages/_document - the "index.html"
- /pages/_app - the head and body go here
- /pages/name.js - routing is defined by filename
