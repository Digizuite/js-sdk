# Downloading an asset 

## Getting the download URL for an asset for a specific quality

```js
instance.download.getDownloadURL({
    asset : asset,
    quality : Digizuite.Constants.DOWNLOAD_QUALITY.ORIGINAL
}).then((url) => {
    console.log("Got it from here!", url);
});
```

The ```asset```parameter needs to be an instance of the ```Asset``` class. 

If the ```quality``` is omitted, the download URL will be provided for the original format. 
Check ```Digizuite.Constants.DOWNLOAD_QUALITY``` for a list of the available qualities.

## Getting all the download URLs for an asset

You can obtain a list of all available download qualities and their download links:

```js
instance.download.getAllDownloadURL({
    asset : assets[0],
}).then((qualities) => {
    console.log("Got all the download qualities for the asset!", qualities);
});
```