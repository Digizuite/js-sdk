# Restoring an asset to a previous version

## Get all the versions of an asset 

```js
instance.version.getAssetVersions({
    asset
}).then((versions)=>{
    console.debug("Got versions", versions);
})
```

## Restore the asset to a given version

```js

```

## Awaiting

Unlike during upload, there is no way to await for the replacement asset to published at the moment.