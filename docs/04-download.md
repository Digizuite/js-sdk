# Downloading an asset 

## Getting the download URL for an asset for a specific quality

```js
import {Constants} from 'digizuite';

instance.download.getDownloadURL({
    asset : asset,
    quality : Constants.DOWNLOAD_QUALITY.ORIGINAL
}).then((url) => {
    console.log("Got it from here!", url);
});
```

The ```asset```parameter needs to be an instance of the ```Asset``` class. 

If the ```quality``` is omitted, the download URL will be provided for the original format.

Below is a list of available download qualities enums that can be used:

| Quality |Constant name | Notes |
|---------------|--------------------|-------|
| Original | DOWNLOAD_QUALITY.ORIGINAL | |
| High Resolution | DOWNLOAD_QUALITY.HIGH_RES | |
| Low Resolution | DOWNLOAD_QUALITY.LOW_RES | |

If the requested quality is not available for the asset, an error will be thrown.

## Getting all the download URLs for an asset

You can obtain a list of all available download qualities and their download links:

```js
instance.download.getAllDownloadURL({
    asset : assets[0],
}).then((qualities) => {
    console.log("Got all the download qualities for the asset!", qualities);
});
```

## Getting the URL for an asset for a specific quality

```js
import {Constants} from 'digizuite';

instance.download.getUrlForQuality({
    asset : asset,
    quality : Constants.DOWNLOAD_QUALITY.ORIGINAL
}).then((url) => {
    console.log("Got it from here!", url);
});
```

The ```asset```parameter needs to be an instance of the ```Asset``` class.

The parameter ```quality``` is required and needs to be a valid download quality.

If the requested quality is not available for the asset, an error will be thrown.

## Lighter imports
```js
import {CONSTANTS} from 'digizuite/src/const';
```