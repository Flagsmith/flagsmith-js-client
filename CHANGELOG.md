# Changelog

## [9.3.4](https://github.com/Flagsmith/flagsmith-js-client/compare/v9.3.3...v9.3.4) (2025-11-18)


### Bug Fixes

* angularHttpClient fetch error ([#359](https://github.com/Flagsmith/flagsmith-js-client/issues/359)) ([44e4b79](https://github.com/Flagsmith/flagsmith-js-client/commit/44e4b79ee77693e7c228a341c2bd8d83b02fdc3a))
* catch init error in useFlagsmith ([#351](https://github.com/Flagsmith/flagsmith-js-client/issues/351)) ([5380dc3](https://github.com/Flagsmith/flagsmith-js-client/commit/5380dc390a7f0532bb21f3452a850d9a83dda2f5))
* **types:** loading state source unresolved any ([#360](https://github.com/Flagsmith/flagsmith-js-client/issues/360)) ([30c35a3](https://github.com/Flagsmith/flagsmith-js-client/commit/30c35a3a5a75a9c2947ff9741e96c44c4b974d6b))


### CI

* fix trusted publishing ([#355](https://github.com/Flagsmith/flagsmith-js-client/issues/355)) ([881c648](https://github.com/Flagsmith/flagsmith-js-client/commit/881c64869ac829a79b5c28847ab3377115e50509))

## [9.3.3](https://github.com/Flagsmith/flagsmith-js-client/compare/v9.3.2...v9.3.3) (2025-11-05)


### Bug Fixes

* export FlagSource enum as runtime value ([#349](https://github.com/Flagsmith/flagsmith-js-client/issues/349)) ([d480bb9](https://github.com/Flagsmith/flagsmith-js-client/commit/d480bb96cf893c2cea532e44b1053cb019213fdd))


### CI

* add release please ([#353](https://github.com/Flagsmith/flagsmith-js-client/issues/353)) ([353dbf7](https://github.com/Flagsmith/flagsmith-js-client/commit/353dbf7a8421a83840e869c2a64d39dcc1019fcf))


### Other

* **deps-dev:** bump form-data from 4.0.0 to 4.0.4 ([#331](https://github.com/Flagsmith/flagsmith-js-client/issues/331)) ([187feda](https://github.com/Flagsmith/flagsmith-js-client/commit/187feda63c94bfa20956e1ae473a53a5df8b62a1))

<a id="9.3.2-post0"></a>
## [9.3.2 (9.3.2-post0)](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.3.2-post0) - 2025-09-03

## What's Changed
* fix: CORS errors due to header changes by [@khvn26](https://github.com/khvn26) in [#342](https://github.com/Flagsmith/flagsmith-js-client/pull/342)
* chore: Add `CODEOWNERS` by [@khvn26](https://github.com/khvn26) in [#339](https://github.com/Flagsmith/flagsmith-js-client/pull/339)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.3.1...9.3.2

[Changes][9.3.2-post0]


<a id="9.3.1"></a>
## [9.3.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.3.1) - 2025-08-19

## What's Changed
* fix: typescript type generation when array of fields is passed. by [@rushib1](https://github.com/rushib1) in [#325](https://github.com/Flagsmith/flagsmith-js-client/pull/325)
* feat: send flagsmith sdk user agent by [@Zaimwa9](https://github.com/Zaimwa9) in [#332](https://github.com/Flagsmith/flagsmith-js-client/pull/332)
* fix: renamed-sentry-client-interface by [@Zaimwa9](https://github.com/Zaimwa9) in [#335](https://github.com/Flagsmith/flagsmith-js-client/pull/335)
* fix: make-id-optional-in-iflags by [@Zaimwa9](https://github.com/Zaimwa9) in [#336](https://github.com/Flagsmith/flagsmith-js-client/pull/336)
* chore: bumped-react-native-version by [@Zaimwa9](https://github.com/Zaimwa9) in [#337](https://github.com/Flagsmith/flagsmith-js-client/pull/337)

## New Contributors
* [@rushib1](https://github.com/rushib1) made their first contribution in [#325](https://github.com/Flagsmith/flagsmith-js-client/pull/325)

**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.3.0...9.3.1

[Changes][9.3.1]


<a id="9.3.0"></a>
## [9.3.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.3.0) - 2025-07-01

## What's Changed
Adds the [Sentry integration](https://docs.flagsmith.com/integrations/apm/sentry)

**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.2...9.3.0

[Changes][9.3.0]


<a id="9.2.2"></a>
## [9.2.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.2.2) - 2025-05-13

## What's Changed
* fix: re-add support for ``flagsmith.identity`` by [@kyle-ssg](https://github.com/kyle-ssg)  in [#301](https://github.com/Flagsmith/flagsmith-js-client/issues/301)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.1...9.2.2

[Changes][9.2.2]


<a id="9.2.1"></a>
## [9.2.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.2.1) - 2025-05-05

## What's Changed
* fix: updated-interface-flags-for-javascript-client by [@Zaimwa9](https://github.com/Zaimwa9) in [#315](https://github.com/Flagsmith/flagsmith-js-client/pull/315)
* fix: improved-on-change-and-fvalue-types by [@Zaimwa9](https://github.com/Zaimwa9) in [#316](https://github.com/Flagsmith/flagsmith-js-client/pull/316)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.0...9.2.1

[Changes][9.2.1]


<a id="9.2.0"></a>
## [9.2.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.2.0) - 2025-04-28

## What's Changed
* feat: send client info to Flagsmith by [@tiagoapolo](https://github.com/tiagoapolo) in [#293](https://github.com/Flagsmith/flagsmith-js-client/pull/293)
* Fix: typo in type definition file by [@benwilson34](https://github.com/benwilson34) in [#308](https://github.com/Flagsmith/flagsmith-js-client/pull/308)
* fix: added-key-of-generic-record-and-tests by [@Zaimwa9](https://github.com/Zaimwa9) in [#311](https://github.com/Flagsmith/flagsmith-js-client/pull/311)
* chore: bump-version by [@Zaimwa9](https://github.com/Zaimwa9) in [#312](https://github.com/Flagsmith/flagsmith-js-client/pull/312)

## New Contributors
* [@benwilson34](https://github.com/benwilson34) made their first contribution in [#308](https://github.com/Flagsmith/flagsmith-js-client/pull/308)
* [@Zaimwa9](https://github.com/Zaimwa9) made their first contribution in [#311](https://github.com/Flagsmith/flagsmith-js-client/pull/311)

**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.1.0...9.2.0

[Changes][9.2.0]


<a id="9.1.0"></a>
## [9.1.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.1.0) - 2025-04-08

Allows specifying a type definition for all feature flags [#298](https://github.com/Flagsmith/flagsmith-js-client/pull/298), a pre-requisite for [Flagsmith/flagsmith-cli#24](https://github.com/Flagsmith/flagsmith-cli/pull/24)

[Changes][9.1.0]


<a id="9.0.5"></a>
## [9.0.5](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.5) - 2025-03-13

## What's Changed
* fix: conflicting ts field type by [@tiagoapolo](https://github.com/tiagoapolo) in [#294](https://github.com/Flagsmith/flagsmith-js-client/pull/294)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.4...9.0.5

[Changes][9.0.5]


<a id="9.0.4"></a>
## [9.0.4](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.4) - 2025-02-12

fixes [#289](https://github.com/Flagsmith/flagsmith-js-client/issues/289)

## What's Changed
* fix: Generates isomorphic types by [@tiagoapolo](https://github.com/tiagoapolo) in [#291](https://github.com/Flagsmith/flagsmith-js-client/pull/291)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.3...9.0.4

[Changes][9.0.4]


<a id="9.0.3"></a>
## [9.0.3](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.3) - 2025-01-23

Closes [#287](https://github.com/Flagsmith/flagsmith-js-client/issues/287)

[Changes][9.0.3]


<a id="9.0.2"></a>
## [9.0.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.2) - 2025-01-22

Closes [#283](https://github.com/Flagsmith/flagsmith-js-client/issues/283)

[Changes][9.0.2]


<a id="9.0.1"></a>
## [9.0.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.1) - 2025-01-20

## What's Changed
* fix: Don't use cached traits to initialize sdk state by [@tiagoapolo](https://github.com/tiagoapolo) in [#282](https://github.com/Flagsmith/flagsmith-js-client/pull/282)
* fix: Types not being exported and autocomplete not working by [@tiagoapolo](https://github.com/tiagoapolo) in [#284](https://github.com/Flagsmith/flagsmith-js-client/pull/284)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.0...9.0.1

[Changes][9.0.1]


<a id="9.0.0"></a>
## [9.0.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/9.0.0) - 2025-01-15

This release removes [flagsmith-es](https://www.npmjs.com/package/flagsmith-es) and makes the flagsmith npm package both umd and es module compatible. Closes [#226](https://github.com/Flagsmith/flagsmith-js-client/issues/226)

[Changes][9.0.0]


<a id="8.0.3"></a>
## [8.0.3](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/8.0.3) - 2025-01-15

## What's Changed
* chore: typecheck on build by [@kyle-ssg](https://github.com/kyle-ssg) in [#267](https://github.com/Flagsmith/flagsmith-js-client/pull/267)
* fix: Unhandled exception when getting value from local storage by [@tiagoapolo](https://github.com/tiagoapolo) in [#279](https://github.com/Flagsmith/flagsmith-js-client/pull/279)
* chore: Deprecate flagsmith-es by [@kyle-ssg](https://github.com/kyle-ssg) in [#281](https://github.com/Flagsmith/flagsmith-js-client/pull/281)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.2...8.0.3

[Changes][8.0.3]


<a id="8.0.2"></a>
## [8.0.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/8.0.2) - 2025-01-02

## What's Changed
* fix: Un-deprecate `setTrait`, `setTraits` and `identify` by [@tiagoapolo](https://github.com/tiagoapolo) in [#276](https://github.com/Flagsmith/flagsmith-js-client/pull/276)

## New Contributors
* [@tiagoapolo](https://github.com/tiagoapolo) made their first contribution in [#276](https://github.com/Flagsmith/flagsmith-js-client/pull/276)

**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.1...8.0.2

[Changes][8.0.2]


<a id="8.0.1"></a>
## [8.0.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/8.0.1) - 2024-12-18

Fixes sourcemaps ([#239](https://github.com/Flagsmith/flagsmith-js-client/issues/239))
Fixes ReactNode type ([#268](https://github.com/Flagsmith/flagsmith-js-client/issues/268))
Fixes identifier being removed from context in getFlagsResponse ([#262](https://github.com/Flagsmith/flagsmith-js-client/issues/262))

[Changes][8.0.1]


<a id="8.0.0"></a>
## [8.0.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/8.0.0) - 2024-12-18

## What's Changed
* fix: Handle uncaught fetch exception by [@frankieyan](https://github.com/frankieyan) in [#256](https://github.com/Flagsmith/flagsmith-js-client/pull/256)
* Release 8.0.0 by [@matthewelwell](https://github.com/matthewelwell) in [#274](https://github.com/Flagsmith/flagsmith-js-client/pull/274)

## Breaking changes

This release reintroduces the changes originally added in Version 6.0.0. This changes the key used by the flagsmith client for internal storage to allow support for multiple environments. See [#252](https://github.com/Flagsmith/flagsmith-js-client/issues/252) for further details.

## New Contributors
* [@frankieyan](https://github.com/frankieyan) made their first contribution in [#256](https://github.com/Flagsmith/flagsmith-js-client/pull/256)

**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/7.0.2...8.0.0

[Changes][8.0.0]


<a id="7.0.2"></a>
## [Version 7.0.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/7.0.2) - 2024-11-05

## What's Changed
* fix: Incorrect argument type, interface extension by [@khvn26](https://github.com/khvn26) in [#261](https://github.com/Flagsmith/flagsmith-js-client/pull/261)
* fix: Interface extensions are not correct by [@khvn26](https://github.com/khvn26) in [#266](https://github.com/Flagsmith/flagsmith-js-client/pull/266)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/7.0.1...7.0.2

[Changes][7.0.2]


<a id="7.0.1"></a>
## [Version 7.0.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/7.0.1) - 2024-10-17

Allows ``flagsmith.setContext({...})`` prior to init.

[Changes][7.0.1]


<a id="7.0.0"></a>
## [7.0.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/7.0.0) - 2024-10-10

This is a temporary release that reverts the changes in 6.0.0.

## What's Changed
* Bump rollup from 2.78.0 to 2.79.2 by [@dependabot](https://github.com/dependabot) in [#255](https://github.com/Flagsmith/flagsmith-js-client/pull/255)
* Revert "feat: support multiple environment caching" by [@rolodato](https://github.com/rolodato) in [#258](https://github.com/Flagsmith/flagsmith-js-client/pull/258)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/6.0.0...7.0.0

[Changes][7.0.0]


<a id="6.0.0"></a>
## [Version 6.0.0 - Adjust cache keys to be unique per environment](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/6.0.0) - 2024-10-09

Closes [#201](https://github.com/Flagsmith/flagsmith-js-client/issues/201). The local storage keys for the SDK cache are now unique for each environment. This is being released as a breaking change because, upon upgrading to this version, the cache will be missed the first time due to the previous key ('BULLET_TRAIN_DB') being ignored


Thank you very much for the great PR [@oluizcarvalho](https://github.com/oluizcarvalho) 🚀

[Changes][6.0.0]


<a id="5.0.0"></a>
## [Version 5.0.0 - Support context, transient identities and traits](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/5.0.0) - 2024-10-02

## Transient traits
This release supports the concept of transient traits, setting this will mean the trait is not stored within Flagsmith and evaluated just in that request.

You can define a trait as transient like so:

```js
setTraits({bar:{value:123, transient: true}})
setTraits({foo:"1", bar:{value:123, transient: true}})
flagsmith.init({
  traits: {foo:"1", bar:{value:123, transient: true}}
})
```

## Contexts and transient identities

This release also deprecates the above calls in favour of setting context. Context allows you to set information as a single object which we may extend in future more easily. **We suggest migrating to this soon.**

You can set a partial context and it will merge with the one provided during SDK init.

Currently, the full context object looks like this:

```js
flagsmith.setContext({
  {
    environment: {apiKey: "<your environment API key>"},
    identifier: "unique-user-id",
    traits:     {foo:"1", bar:{value:123, transient: true}},
    transient:  false
  }
})
```


[Changes][5.0.0]


<a id="4.1.4"></a>
## [Version 4.1.4](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.1.4) - 2024-09-24

Closes [#253](https://github.com/Flagsmith/flagsmith-js-client/pull/253)

[Changes][4.1.4]


<a id="4.1.3"></a>
## [Version 4.1.3](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.1.3) - 2024-09-17

Closes [#250](https://github.com/Flagsmith/flagsmith-js-client/issues/250) - thank you [@blackjid](https://github.com/blackjid) 🚀

[Changes][4.1.3]


<a id="4.1.2"></a>
## [Version 4.1.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.1.2) - 2024-09-11

Closes [#238](https://github.com/Flagsmith/flagsmith-js-client/issues/238)

Fixes a race condition whereby flag state returns as ``{}`` if ``flagsmith.init`` resolves after ``flagsmith.identify``

[Changes][4.1.2]


<a id="4.1.1"></a>
## [Version 4.1.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.1.1) - 2024-09-10

Solves [#242](https://github.com/Flagsmith/flagsmith-js-client/issues/242). When calling flagsmith.init with traits they will now be merged with any cached traits.

[Changes][4.1.1]


<a id="4.1.0"></a>
## [Version 4.1.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.1.0) - 2024-09-04

Resolves [#243](https://github.com/Flagsmith/flagsmith-js-client/issues/243)

Adds a fallback for a feature flag when the flag doesn't exists.

```
flagsmith.hasFeature("deleted_feature",{fallback:true})
```

[Changes][4.1.0]


<a id="4.0.3"></a>
## [Version 4.0.3](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.0.3) - 2024-07-03

Closes [#235](https://github.com/Flagsmith/flagsmith-js-client/pull/235)

[Changes][4.0.3]


<a id="4.0.2"></a>
## [Version 4.0.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.0.2) - 2024-05-17

## What's Changed
* fix: clear traits when identifying over previous identity by [@kyle-ssg](https://github.com/kyle-ssg) in [#229](https://github.com/Flagsmith/flagsmith-js-client/pull/229)


**Full Changelog**: https://github.com/Flagsmith/flagsmith-js-client/compare/4.0.1...4.0.2

[Changes][4.0.2]


<a id="4.0.1"></a>
## [v4.0.1 Fix onChange Generic Types](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.0.1) - 2024-04-24

Closes [#224](https://github.com/Flagsmith/flagsmith-js-client/issues/224)

[Changes][4.0.1]


<a id="4.0.0"></a>
## [v4.0.0 - add list of changed flags/traits, improve resolve/reject of init](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/4.0.0) - 2024-04-08

This will be the first version compatible with [OpenFeature](https://openfeature.dev/). Merges [#223](https://github.com/Flagsmith/flagsmith-js-client/pull/223)

Breaking changes
- Init will now reject if:
  - No environment ID is provider
  - Fetch fails and there's no cache (Init resolves on cache)
  - There's no cache/defaults and preventFetch is true
- The boolean properties traitsChange and flagsChanged are now a string[] of changed keys or null. This reduces breaking changes since falsey and truthy checks will still behave as before.

Other changes
- Init is (finally) async/await
- Init code is reduced by pulling out isolated functions
- Added tests around init promises
- Organised util files

[Changes][4.0.0]


<a id="3.24.0"></a>
## [3.24.0 - Read cache synchronously](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.24.0) - 2024-03-28

Closes [#222](https://github.com/Flagsmith/flagsmith-js-client/pull/222)

The SDK will now synchronously read cache rather than fetching it asynchronously.

[Changes][3.24.0]


<a id="3.23.2"></a>
## [3.23.2 - Remove busy logs, fix onChange event](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.23.2) - 2024-03-01

Merges [#207](https://github.com/Flagsmith/flagsmith-js-client/pull/207)
Closes [#217](https://github.com/Flagsmith/flagsmith-js-client/issues/217)

[Changes][3.23.2]


<a id="3.23.1"></a>
## [3.23.1 - Prevent Nextjs caching behaviour](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.23.1) - 2024-03-01

Merges [#216](https://github.com/Flagsmith/flagsmith-js-client/pull/216)

[Changes][3.23.1]


<a id="3.23.0"></a>
## [3.23.0 - Fix missed events in useFlags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.23.0) - 2024-02-29

Closes [#214](https://github.com/Flagsmith/flagsmith-js-client/issues/214)

- Fixes flag updates from useFlags
- Fixes flag updates where flagsmith.init is not called

[Changes][3.23.0]


<a id="3.22.1"></a>
## [3.22.1 - Support fallback for non-JSON evaluations](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.22.1) - 2024-02-20

Merges [#213](https://github.com/Flagsmith/flagsmith-js-client/pull/213), thanks to [@levrik](https://github.com/levrik)

[Changes][3.22.1]


<a id="3.22.0"></a>
## [3.22.0 - Prevent race condition between identify/getFlags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.22.0) - 2024-01-10

Prior to this release, clients that request identified/unidentified flags simultaneously could see the wrong results due to a race condition. Although this signifies incorrect usage of the SDK, this will no longer occur.

For more information see [#205](https://github.com/Flagsmith/flagsmith-js-client/pull/205).

[Changes][3.22.0]


<a id="3.19.0"></a>
## [3.19.0 - Access Flagsmith loading state](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.19.0) - 2023-06-23

This introduces a strategy to responding to loading state changes in flagsmith

The following will be exposed to Flagsmith:

```
export declare enum FlagSource {
    "NONE" = "NONE",
    "DEFAULT_FLAGS" = "DEFAULT_FLAGS",
    "CACHE" = "CACHE",
    "SERVER" = "SERVER",
}

export declare type LoadingState = {
    error: Error | null, // Current error, resets on next attempt to fetch flags
    isFetching: bool, // Whether there is a current request to fetch server flags
    isLoading: bool,  // Whether any flag data exists
    source: FlagSource //Indicates freshness of flags
}
```

It can be consumed via the [onChange](https://github.com/Flagsmith/flagsmith-js-client/pull/169/files#diff-a150fb53afee945f23f3fe7c176007111f3ba81bb0d188af4077d4a0fc4caa37R83) function of flagsmith.init or the newly introduced [useFlagsmithLoading](https://github.com/Flagsmith/flagsmith-js-client/pull/169/files#diff-090ff4f85a594b9bd7b6f1a515395bd0a604ade2c55db3e5c9e7ea76021cbd7fR110)


```typescript
    onChange?: (previousFlags: IFlags<F> | null, params: IRetrieveInfo, loadingState:LoadingState) => void;
    const loadingState:LoadingState = useFlagsmithLoading()
```


[Changes][3.19.0]


<a id="3.18.4"></a>
## [3.18.4 - Audit fix](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.18.4) - 2023-06-20

This version includes an npm audit fix.

[Changes][3.18.4]


<a id="3.18.3"></a>
## [3.18.3 - Ignore undefined traits](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.18.3) - 2023-04-05

Closes [#167](https://github.com/Flagsmith/flagsmith-js-client/issues/167)

[Changes][3.18.3]


<a id="3.18.2"></a>
## [3.18.2 - Adds Datadog RUM](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.18.2) - 2023-03-20

This release adds an integration to Datadog RUM, it focuses on the new experimental feature_flags feature, you can read more about it here https://docs.datadoghq.com/real_user_monitoring/guide/setup-feature-flag-data-collection/?tab=npm.

This will track remote config and feature enabled states as feature flags in the following format

```
flagsmith_value_<FEATURE_NAME> // remote config
flagsmith_enabled_<FEATURE_NAME> // enabled state
```

Additionally, the integration will also store Flagsmith traits against the Datadog user in the following format:

```
flagsmith_trait_<FEATURE_NAME> // remote config
```

You can find an example of this integration [here](https://github.com/Flagsmith/flagsmith-js-client/blob/main/examples/datadog-realtime-user-monitoring/src/index.tsx).

[Changes][3.18.2]


<a id="3.18.1"></a>
## [3.18.1 - Realtime features](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.18.1) - 2023-03-20

This release adds a stable implementation of realtime features and is used on app.flagsmith.com.

Flagsmith projects that are opted into realtime are able to enable realtime within flagsmith.init as ``{realtime: true}``, this will instruct the SDK to connect to our realtime SSE endpoint to receive feature updates from the environment and segment overrides.

[Changes][3.18.1]


<a id="3.16.0"></a>
## [3.16.0 - Always send an Error object to onError](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.16.0) - 2023-01-30

Closes [#93](https://github.com/Flagsmith/flagsmith-js-client/issues/93). This aims to make the type of onError more predictable by always sending it as an Error object. Thank you to [@gfrancischini](https://github.com/gfrancischini) for the sensible suggestion!

[Changes][3.16.0]


<a id="3.15.1"></a>
## [3.15.1 - Fix Promise return from setTrait(s)](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.15.1) - 2022-12-19

Prior to this release, setTrait(s) calls were not returning a promise, they will now resolve when the API returns a new set of flags.

[Changes][3.15.1]


<a id="3.15.0"></a>
## [3.15.0 - Unify and improve setTrait / setTraits calls](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.15.0) - 2022-12-19

- Calls to setTrait/setTraits now only hit 1 endpoint, previously they hit 2.
- The behaviour of setTrait now matches setTraits, prior to this you could not delete a trait via ``flagsmith.setTrait("trait",null)``. Also, this prevents an issue where segment flags were sometimes not returned in response to setting a trait.


[Changes][3.15.0]


<a id="3.14.1"></a>
## [3.14.1 - React fix: initialise flagsmith with serverState if provided](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.14.1) - 2022-11-14

Prior to this release, there were cases where flags provided by serverState are cleared, potentially effecting the isomorphic client (e.g. Next.js applications). This is because ``<ReactProvider/>`` [initialises Flagsmith](https://github.com/Flagsmith/flagsmith-js-client/blob/main/react.tsx#L41) internally after server state is set.

This change makes sure that Flagsmith is initialises with the server state so that the state is preserved.



[Changes][3.14.1]


<a id="3.14.0"></a>
## [3.14.0 - Reduce bundle size](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.14.0) - 2022-11-09

This release reduces the bundle size (31kb -> 21kb Pre GZIP) of the core SDK, it does so by patching one of our only dependencies (@callstack/async-storage) to export just the functions we need and remove the dependency of lodash.

![image](https://user-images.githubusercontent.com/8608314/200798300-db833bef-d7f0-4657-8b4a-e58c2b64f42a.png)


[Changes][3.14.0]


<a id="3.13.1"></a>
## [3.13.1 - fix IFlagsmithFeature type](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.13.1) - 2022-11-09

Closes [#153](https://github.com/Flagsmith/flagsmith-js-client/issues/153)

[Changes][3.13.1]


<a id="3.13.0"></a>
## [3.13.0 - Fix race condition with useFlags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.13.0) - 2022-10-27

Prior to this release, there were cases where useFlags was not updating flags when the Flagsmith cache was received. This was down to event listeners not being initialised prior to the cache being accessed.

[Changes][3.13.0]


<a id="3.12.0"></a>
## [3.12.0 - fix fallback usage on null flags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.12.0) - 2022-10-27

A few releases ago we added the ability to automatically parse JSON in flagsmith.getValue. Since null is parseable by JSON.parse, the fallback was not being used in a lot of cases. Now, the client will ignore null flag values and use the fallback.


```
  const json = flagsmith.getValue<{foo: string|null, bar: string|null}>("json_value", {
      json: true,
      fallback: {foo:null,bar:null}
  });
  // if the value is null, json before this release would be null
```

[Changes][3.12.0]


<a id="3.11.0"></a>
## [3.11.0 - Fix offline cache usage](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.11.0) - 2022-10-20

Closes [#148](https://github.com/Flagsmith/flagsmith-js-client/issues/148), prior to this release failed API requests (e.g. offline) would incorrectly update the local storage cache. Failed API calls will correctly trigger ``onError`` with the appropriate information.

This also fixes a usecase where the client has analytics data for an environment different to the one they are currently requesting https://github.com/Flagsmith/flagsmith-js-client/blob/main/flagsmith-core.ts#L201.

Thank you so much to [@gfrancischini](https://github.com/gfrancischini) for spotting and reporting this.

[Changes][3.11.0]


<a id="3.10.5"></a>
## [3.10.5 - getValue JSON type support](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.10.5) - 2022-10-09

This release will allow you to specify the return type of getValue as well as allow you to parse the value as JSON.

```typescript
// for getting JSON values this will type the return
const json = flagsmith.getValue<{ foo: string | null; bar: string | null }>('json_value', {
 json: true,
 fallback: { foo: null, bar: null },
});
console.log(json.foo); // typed as {foo: string|null, bar: string|null}

// If a type is not specified for getValue it will asume it from the type of fallback. In this case, a number.
const font_size = flagsmith.getValue('font_size', { fallback: 12 });
```


Thank you very much [@azriel46d](https://github.com/azriel46d) and [@dangrima90](https://github.com/dangrima90) 🤩

[Changes][3.10.5]


<a id="3.10.2"></a>
## [3.10.2 - Bundle "flagsmith/react" into react-native-flagsmith](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.10.2) - 2022-10-03

Prior to this release, users on React Native had to install both the react-native SDK and standard flagsmith SDK.

An implementation would look like this

```javascript
import flagsmith from 'react-native-flagsmith';
import {FlagsmithProvider} from 'flagsmith/react';

<FlagsmithProvider flagsmith={flagsmith}
...

```

With this release you can now import react specific components from 'react-native-flagsmith'. So implementation can be as follows

```javascript
import flagsmith from 'react-native-flagsmith';
import {FlagsmithProvider} from 'react-native-flagsmith/react';
```

[Changes][3.10.2]


<a id="3.10.1"></a>
## [3.10.1 - Fix multi project flag analytics](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.10.1) - 2022-09-22

Closes [#145](https://github.com/Flagsmith/flagsmith-js-client/issues/145)

[Changes][3.10.1]


<a id="3.10.0"></a>
## [3.10.0 Realtime flag preparations](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.10.0) - 2022-09-22

This release configures serverside event urls to match what we intend to use for production. More updates on realtime flags will follow.

[Changes][3.10.0]


<a id="3.9.2"></a>
## [3.9.2 - TypeScript fixes and Fixed React Native Async Storage](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.9.2) - 2022-08-26

Closes [#140](https://github.com/Flagsmith/flagsmith-js-client/issues/140), [#139](https://github.com/Flagsmith/flagsmith-js-client/issues/139), [#137](https://github.com/Flagsmith/flagsmith-js-client/issues/137).

[Changes][3.9.2]


<a id="3.9.0"></a>
## [3.9.0 Fixed source maps](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.9.0) - 2022-08-22

This release fixes source mapping for all clients, prior to this you could not inspect ts functions such as ``init`` and ``getFlags`` from ``flagsmith-core.ts``.

[Changes][3.9.0]


<a id="3.8.1"></a>
## [3.8.1 - Preparations for realtime flags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.8.1) - 2022-08-17

This release includes working functionality for Serverside Events in the Flagsmith JavaScript client, React Native and SSR clients. A follow-up release will be published when this is released to production.

[Changes][3.8.1]


<a id="3.8.0"></a>
## [3.8.0 - Fix useFlags for React Native, prepare for realtime flags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.8.0) - 2022-08-16

Prior to this release, React Native was not receiving flag updates with useFlags(["flag_name"]), this is due to the event emitter not being compatible.

This release also prepares functionality for realtime flags.

[Changes][3.8.0]


<a id="3.7.2"></a>
## [3.7.2 - Inform user of undefined fetch](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.7.2) - 2022-08-10

Similarly to version 3.7.1, this change caters for SSR technologies not supporting fetch. This version informs the user when fetch is undefined regardless of whether the user is opted into logging.

[Changes][3.7.2]


<a id="3.7.1"></a>
## [3.7.1 - Add fetch logging](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.7.1) - 2022-08-10

With SSR clients especially where fetch implementations differ, it's important to be able to debug fetch requests. With this version you will be able to see fetch statuses and exceptions when you pass ``enableLogs:true`` within ``flagsmith.init``

[Changes][3.7.1]


<a id="3.7.0"></a>
## [3.7.0 - Typed generics for flagsmith flags and traits](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.7.0) - 2022-08-09

Given that we type our flags and traits


```
 type FlagOptions = "font_size" | "hero"
 type TraitOptions = "example_trait"
```

We can now enforce these types:

```
  // enforces you passing the correct key to flagsmith.getValue(x), flagsmith.getTrait(x)
  import flagsmith from "flagsmith"
  const typedFlagsmith = flagsmith as IFlagsmith<FlagOptions,TraitOptions>

  // Similarly for the useFlagsmith hook
  const flagsmith = useFlagsmith<FlagOptions, TraitOptions>(); // enforces flagsmith.getValue()

  // for useFlags this will ensure you only can pass correct keys also
  const flags = useFlags<FlagOptions, TraitOptions>(["font_size"],["example_trait"]);
```

Thank you very much for this addition [@PrettyWood](https://github.com/PrettyWood)

[Changes][3.7.0]


<a id="3.6.0"></a>
## [3.6.0 - Improve event-trigger code, fix up TypeScript issues](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.6.0) - 2022-08-09

Closes [#132](https://github.com/Flagsmith/flagsmith-js-client/issues/132) Thank you to [@dgreene1](https://github.com/dgreene1) for the in-depth review 🚀 .

[Changes][3.6.0]


<a id="3.5.0"></a>
## [3.5.0 - allow custom fetch implementations](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.5.0) - 2022-08-05

Some SSR technologies e.g. Nuxt do not provide a fetch polyfill, this means that sometimes we need to tell Flagsmith how to fetch data.

This is now possible with the following:

```
flagsmith.init({fetch:myCustomImplementation})
```

Here's an example of how this can be done with Nuxt https://github.com/Flagsmith/flagsmith-js-client/blob/main/examples/nuxt/plugins/flagsmith-plugin.ts#L10

[Changes][3.5.0]


<a id="3.4.0"></a>
## [3.4.0 - Remove deprecated IBulletTrainFeature type](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.4.0) - 2022-07-15

IBulletTrainFeature had been deprecated many releases ago, this release removes it entirely. If your application imports it, just import IFlagsmithFeature instead. See https://github.com/Flagsmith/flagsmith-js-client/blob/main/types.d.ts

[Changes][3.4.0]


<a id="3.3.2"></a>
## [3.3.2 - Added Next.js Middleware Support](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.3.2) - 2022-07-01

This release adds a Next.js middleware compatible bundle, a working example of this can be found [here](https://github.com/Flagsmith/flagsmith-js-client/blob/main/examples/nextjs-middleware).

Closes [#112](https://github.com/Flagsmith/flagsmith-js-client/issues/112)

[Changes][3.3.2]


<a id="3.3.0"></a>
## [3.3.0 - Added cacheOptions](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.3.0) - 2022-06-29

When calling ``flagsmith.init`` you can now pass ``cacheOptions``

```
{
    ttl?:number, // how long to persist the cache in ms (defaults to 0 which is infinite)
    /*
    If this is true and there's cache available, it will skip hitting the API as if preventFetch was true
    Note: this is just for flagsmith.init(), Calls to identify, getFlags etc will still hit the API regardless
    */
    skipAPI?:boolean
}
```

Thanks to [@qrush](https://github.com/qrush) for the suggestion 🚀

[Changes][3.3.0]


<a id="3.2.0"></a>
## [3.2.0 fix <FlagsmithProvider /> initialisation](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.2.0) - 2022-06-24

Prior to this release, flagsmith would initialise inside a useEffect within the FlagsmithProvider component, now it will initialise immediately as can be seen [here](https://github.com/Flagsmith/flagsmith-js-client/blob/main/react/index.tsx#L39). Initialising flagsmith asynchronously meant that the UI could flicker when default values are supplied, as well as being overall slower than it needs to be.

Thanks to [@briangorham](https://github.com/briangorham) for spotting this 🚀 .

[Changes][3.2.0]


<a id="3.1.2"></a>
## [3.1.2 - Adjust Dynatrace integration syntax](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.1.2) - 2022-06-13

In order to make the Dynatrace integration more simplistic, this replaces the dtrum init property with "enableDynatrace"

[Changes][3.1.2]


<a id="3.1.1"></a>
## [3.1.1 - Dynatrace realtime user monitoring integration](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.1.1) - 2022-06-13

When providing dtrum instance to flagsmith.init, flagsmith will send session properties corresponding to flag enabled state, flag values and user traits. See [here](https://github.com/Flagsmith/flagsmith-js-client/blob/main/examples/dynatrace-realtime-user-monitoring/main.js#L42) for an example.

- flag enabled state sends as a **shortString** as "true" or "false" with the prefix flagsmith_enabled_
example: ``flagsmith_enabled_hero: "true"``

- Remote config values sends as value with the prefix flagsmith_value_, this value will be a **javaDouble** for numeric values and a **shortString** for any other.
example: ``flagsmith_value_font_size: 21``, ``flagsmith_value_hero_colour: "blue"``

- Remote config values sends as value with the prefix flagsmith_value_, this value will be a **javaDouble** for numeric values and a **shortString** for any other.
example: ``flagsmith_trait_age: 21``, ``flagsmith_trait_favourite_colour: "blue"``


View the docs [here](https://docs.flagsmith.com/clients/javascript#dynatrace-javascript-sdk-integration)!

[Changes][3.1.1]


<a id="3.1.0"></a>
## [3.1.0 - fix setTrait(s) prior to identify](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.1.0) - 2022-06-13

Prior to this release, there were instances where calling setTrait or setTraits prior to identifying would attempt to hit the API. With this change, setTrait(s) will always build up an object of intended traits that will get sent as soon as the user is identified.

[Changes][3.1.0]


<a id="3.0.6"></a>
## [3.0.6 - fix flagsmith.setTraits](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.0.6) - 2022-06-11

After migrating to the v2 SDK, the traits/bulk endpoint was deprecated, this release replaces that endpoint.

[Changes][3.0.6]


<a id="3.0.4"></a>
## [3.0.4: Remove increment / decrement functions](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.0.4) - 2022-06-08

Merges:
[#120](https://github.com/Flagsmith/flagsmith-js-client/pull/120) [@matthewelwell](https://github.com/matthewelwell) 🥳

The Edge API will no longer allow for ``flagsmith. incrementTrait``, this PR removes it from the SDK as well as examples.


[Changes][3.0.4]


<a id="3.0.3"></a>
## [3.0.3](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.0.3) - 2022-06-08

Closes:
[#118](https://github.com/Flagsmith/flagsmith-js-client/issues/118)
[#115](https://github.com/Flagsmith/flagsmith-js-client/issues/115)
[#111](https://github.com/Flagsmith/flagsmith-js-client/issues/111)

Merges:
[#116](https://github.com/Flagsmith/flagsmith-js-client/pull/116) Thank you [@eschaefer](https://github.com/eschaefer) 🥳
[`f0a62587d0`](https://github.com/Flagsmith/flagsmith-js-client/commit/f0a62587d0ebd6337baf3e21ea95081859f8ee8d) Thank you [@markatom](https://github.com/markatom) 🥳

[Changes][3.0.3]


<a id="3.0.0"></a>
## [3.0.0](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/3.0.0) - 2022-06-07

Edge API as default!

[Changes][3.0.0]


<a id="2.0.9"></a>
## [2.0.9 Fix error with incrementTrait](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.9) - 2022-03-25

Closes [#109](https://github.com/Flagsmith/flagsmith-js-client/pull/109), thanks [@TD-4242](https://github.com/TD-4242) 🚀

[Changes][2.0.9]


<a id="2.0.8"></a>
## [2.0.8 ESM module support](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.8) - 2022-03-23

With this release, users are now able to npm install from [flagsmith-es](https://www.npmjs.com/package/flagsmith-es), this is a mirrored npm module except it is bundled as an ES module.

Thanks [@bradberger](https://github.com/bradberger) for the suggestion 🚀

[Changes][2.0.8]


<a id="2.0.6"></a>
## [2.0.6: Closes https://github.com/Flagsmith/flagsmith-js-client/issues/103](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.6) - 2022-03-23

Closes [#103](https://github.com/Flagsmith/flagsmith-js-client/issues/103) thanks to [@xrash](https://github.com/xrash) 🥳  [#104](https://github.com/Flagsmith/flagsmith-js-client/pull/104)

[Changes][2.0.6]


<a id="2.0.5"></a>
## [2.0.5 - Minor fixes and React Improvements](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.5) - 2022-03-23

This release includes a few underlying type fixes as well as a solution to [#105](https://github.com/Flagsmith/flagsmith-js-client/issues/105)


You can now supply identity / trait options to flagsmith.init.

```
flagsmith.init({... identity:"my_user", traits: {age:21}})
```

Also if you're using the react hooks / provider, you can now initialise flagsmith outside of the component. To do so you will call flagsmith.init and not pass options to your FlagsmithProvider e.g.


```
flagsmith.init({
    environmentID: "QjgYur4LQTwe5HpvbvhpzK",
    cacheFlags:true,
    identity: "my_user",
    traits: {{trait1:"value}}
})
...
  <FlagsmithProvider flagsmith={flagsmith}>
    <App />
  </FlagsmithProvider>

```

[Changes][2.0.5]


<a id="2.0.0"></a>
## [2.0.0 - react hook support for React+React Native](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.0) - 2022-03-22

React and React Native users will now be able to use a hook based approach to retrieving flags

```
import React from 'react';
import flagsmith from 'flagsmith' // 'react-native-flagsmith';  for react-native
import {FlagsmithProvider} from 'flagsmith/react';
import AppComponent from './ExampleComponent';


export default function () {
  return (
    <FlagsmithProvider
      options={{
        environmentID: 'QjgYur4LQTwe5HpvbvhpzK',
      }}
      flagsmith={flagsmith}>
      <AppComponent />
    </FlagsmithProvider>
  );
}

```

Then in your app
```
  const flags = useFlags(['font_size'], ['example_trait']); // only causes re-render if specified flag values / traits change
   ...
   <div>font_size: {flags.font_size?.value}</div>
```

[Changes][2.0.0]


<a id="2.0.0-beta.2"></a>
## [2.0.0-beta.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.0-beta.2) - 2022-03-15

Fixes passing undefined to traits in useFlags, thanks [@NileDaley](https://github.com/NileDaley) 🚀 [#102](https://github.com/Flagsmith/flagsmith-js-client/pull/102)

[Changes][2.0.0-beta.2]


<a id="2.0.0-beta.1"></a>
## [2.0.0-beta.1](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/2.0.0-beta.1) - 2022-03-07

This release includes a rewrite to the build system of the SDK. It is now typescript-first and generates much better d.ts output.

This also includes a new react hooks library with easy to use nextjs support.


```
        <FlagsmithProvider flagsmith={flagsmith}
                           serverState={flagsmithState as IState}
                           options={{
                               environmentID,
                               cacheFlags: true
                           }}>
               <App/>
        </FlagsmithProvider>

...
  const flags = useFlags(["font_size"],["example_trait"]) // only causes re-render if specified flag values / traits change
...

      <div className="App">
        font_size: {flags.font_size?.value}
        example_trait: {flags.example_trait}
       </div>
```



[Changes][2.0.0-beta.1]


<a id="1.7.4"></a>
## [1.7.4](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.7.4) - 2022-02-20

Closes [#99](https://github.com/Flagsmith/flagsmith-js-client/pull/99)
Closes [#98](https://github.com/Flagsmith/flagsmith-js-client/pull/98)

Thank you [@gf3](https://github.com/gf3) and [@xrash](https://github.com/xrash) 🚀

[Changes][1.7.4]


<a id="1.7.3"></a>
## [Release 1.7.3 - Remove Bullet Train instances, small type fixes](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.7.3) - 2022-01-18

This non-breaking change release removes mentions of Bullet Train where possible, the release contains the following PR:
[#94](https://github.com/Flagsmith/flagsmith-js-client/pull/94)

[Changes][1.7.3]


<a id="1.7.2"></a>
## [1.7.2](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.7.2) - 2021-12-16

Merged:
[#90](https://github.com/Flagsmith/flagsmith-js-client/pull/90)

[Changes][1.7.2]


<a id="1.7.1"></a>
## [1.7.1 - Added Identity type](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.7.1) - 2021-12-06

This release adds the identity typescript type to flagsmith


```
    /**
     * The stored identity of the user
     */
    identity?:string

```


[Changes][1.7.1]


<a id="1.7.0"></a>
## [1.7.0 - resolve init promise for previously identified users](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.7.0) - 2021-11-04

Prior to this release, if you identify a user before calling init then the promise would not resolve.

[Changes][1.7.0]


<a id="1.6.10"></a>
## [1.6.10 - trigger onChange with defaultFlags](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.10) - 2021-10-11

Previously, if defaultFlags were set but preventFetch was true, flagsmith would never call onChange. As of this release onChange will callback with the defaultFlags.

[Changes][1.6.10]


<a id="1.6.7"></a>
## [1.6.7](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.7) - 2021-09-22

Fixes [#84](https://github.com/Flagsmith/flagsmith-js-client/issues/84)

[Changes][1.6.7]


<a id="1.6.6"></a>
## [1.6.6](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.6) - 2021-09-15

This release fixes an issue where flagsmith.init was not resolving if no flags previously existed in cache.

[Changes][1.6.6]


<a id="1.6.2"></a>
## [1.6.2 - update types](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.2) - 2021-07-26

This release resolves [#81](https://github.com/Flagsmith/flagsmith-js-client/issues/81), previously types indicated that getFlags,identify,setTrait and other calls would resolve with IFlags however this is not the case. These calls should be followed by getValue / hasFeature.

[Changes][1.6.2]


<a id="1.6.1"></a>
## [1.6.1 - Fix react native types](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.1) - 2021-07-26

This release fixes an issue with react native types [#82](https://github.com/Flagsmith/flagsmith-js-client/issues/82)

[Changes][1.6.1]


<a id="1.6.0"></a>
## [1.6.0 - Use api.flagsmith.com](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.6.0) - 2021-07-06

Prior to this release, API calls from the JS SDK went to https://api.bullet-train.io, now they go to https://api.flagsmith.com

[Changes][1.6.0]


<a id="1.5.0"></a>
## [1.5.0 Multiple flagsmith instances](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.5.0) - 2021-06-15

## 1.5.0

This release allows you to create multiple instances of flagsmith, this may be used when you wish to identify multiple users simultaneously within your app and retain access to getValue, hasFeature etc for each user.


Type:

```
    export function createFlagsmithInstance (): IFlagsmith<br class="Apple-interchange-newline">
```


Usage:

```
import { createFlagsmithInstance } from "flagsmith";
const flagsmith = createFlagsmithInstance();
const flagsmithB = createFlagsmithInstance();

// now you can use flagsmith as before but in its own instance
```



[Changes][1.5.0]


<a id="1.4.1"></a>
## [Added traits parameter to identify (1.4.1)](https://github.com/Flagsmith/flagsmith-js-client/releases/tag/1.4.1) - 2021-05-20

As of this release you can now supply traits with the identify call, this combines setTraits and identify into 1 call.


```
    /**
     * Identify user, triggers a call to get flags if flagsmith.init has been called
     */
    identify:(userId:string, traits?: Record<string, string|number|boolean>,) => Promise<IFlags|undefined>

```

[Changes][1.4.1]


[9.3.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.3.2-post0...9.3.3
[9.3.2-post0]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.3.1...9.3.2-post0
[9.3.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.3.0...9.3.1
[9.3.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.2...9.3.0
[9.2.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.1...9.2.2
[9.2.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.2.0...9.2.1
[9.2.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.1.0...9.2.0
[9.1.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.5...9.1.0
[9.0.5]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.4...9.0.5
[9.0.4]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.3...9.0.4
[9.0.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.2...9.0.3
[9.0.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.1...9.0.2
[9.0.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/9.0.0...9.0.1
[9.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.3...9.0.0
[8.0.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.2...8.0.3
[8.0.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.1...8.0.2
[8.0.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/8.0.0...8.0.1
[8.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/7.0.2...8.0.0
[7.0.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/7.0.1...7.0.2
[7.0.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/7.0.0...7.0.1
[7.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/6.0.0...7.0.0
[6.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/5.0.0...6.0.0
[5.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.1.4...5.0.0
[4.1.4]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.1.3...4.1.4
[4.1.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.1.2...4.1.3
[4.1.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.1.1...4.1.2
[4.1.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.1.0...4.1.1
[4.1.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.0.3...4.1.0
[4.0.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.0.2...4.0.3
[4.0.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.0.1...4.0.2
[4.0.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/4.0.0...4.0.1
[4.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.24.0...4.0.0
[3.24.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.23.2...3.24.0
[3.23.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.23.1...3.23.2
[3.23.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.23.0...3.23.1
[3.23.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.22.1...3.23.0
[3.22.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.22.0...3.22.1
[3.22.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.19.0...3.22.0
[3.19.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.18.4...3.19.0
[3.18.4]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.18.3...3.18.4
[3.18.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.18.2...3.18.3
[3.18.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.18.1...3.18.2
[3.18.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.16.0...3.18.1
[3.16.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.15.1...3.16.0
[3.15.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.15.0...3.15.1
[3.15.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.14.1...3.15.0
[3.14.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.14.0...3.14.1
[3.14.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.13.1...3.14.0
[3.13.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.13.0...3.13.1
[3.13.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.12.0...3.13.0
[3.12.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.11.0...3.12.0
[3.11.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.10.5...3.11.0
[3.10.5]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.10.2...3.10.5
[3.10.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.10.1...3.10.2
[3.10.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.10.0...3.10.1
[3.10.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.9.2...3.10.0
[3.9.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.9.0...3.9.2
[3.9.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.8.1...3.9.0
[3.8.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.8.0...3.8.1
[3.8.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.7.2...3.8.0
[3.7.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.7.1...3.7.2
[3.7.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.7.0...3.7.1
[3.7.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.6.0...3.7.0
[3.6.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.5.0...3.6.0
[3.5.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.4.0...3.5.0
[3.4.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.3.2...3.4.0
[3.3.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.3.0...3.3.2
[3.3.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.2.0...3.3.0
[3.2.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.1.2...3.2.0
[3.1.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.1.1...3.1.2
[3.1.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.1.0...3.1.1
[3.1.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.0.6...3.1.0
[3.0.6]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.0.4...3.0.6
[3.0.4]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.0.3...3.0.4
[3.0.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/3.0.0...3.0.3
[3.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.9...3.0.0
[2.0.9]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.8...2.0.9
[2.0.8]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.6...2.0.8
[2.0.6]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.5...2.0.6
[2.0.5]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.0...2.0.5
[2.0.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.0-beta.2...2.0.0
[2.0.0-beta.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/2.0.0-beta.1...2.0.0-beta.2
[2.0.0-beta.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.7.4...2.0.0-beta.1
[1.7.4]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.7.3...1.7.4
[1.7.3]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.7.2...1.7.3
[1.7.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.7.1...1.7.2
[1.7.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.7.0...1.7.1
[1.7.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.10...1.7.0
[1.6.10]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.7...1.6.10
[1.6.7]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.6...1.6.7
[1.6.6]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.2...1.6.6
[1.6.2]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.1...1.6.2
[1.6.1]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.6.0...1.6.1
[1.6.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.5.0...1.6.0
[1.5.0]: https://github.com/Flagsmith/flagsmith-js-client/compare/1.4.1...1.5.0
[1.4.1]: https://github.com/Flagsmith/flagsmith-js-client/tree/1.4.1

<!-- Generated by https://github.com/rhysd/changelog-from-release v3.9.0 -->
