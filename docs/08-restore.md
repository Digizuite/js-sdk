# Restoring an asset to a previous version

## Get all the versions of an asset 

```js
instance.version.getAssetVersions({
    asset
}).then((versions)=>{
    console.debug("Got versions", versions);
})
```
## Request a restore ticket

```js
instance.version.requestRestoreTicket({
    asset,
    version
}).then((ticket)=>{
    console.debug("Got restore ticket");
});
```

## Restore the asset to a given version

```js
instance.version.restoreAssetByTicket({ 
    ticket 
}).then(()=>{
	console.log("Asset restore")
});
```

## Awaiting

Unlike during upload, there is no way to await for the replacement asset to published at the moment.

## Putting everything together
```js
instance.version.getAssetVersions({
    asset
}).then((versions)=>{
	
    console.debug("Got versions", versions);

    instance.version.requestRestoreTicket({
        asset,
        version : versions[1]
    }).then((ticket)=>{
        console.debug("Got restore ticket");
        return instance.version.restoreAssetByTicket({ ticket })
    }).then(()=>{
        console.debug("Asset Restored");
    });
    
});
```