# Lock Control

## Lock an asset

```js
instance.lock.lockAsset({
    asset,
    note : 'Lock due to lock',
    duration : 600
}).then(()=>{
    console.log("Asset locked!");
});
```

The parameter ```asset``` is required and it is expected to be an instance of ```Asset```.

The parameter ```note``` is optional.

The parameter ```duration``` is optional and it represents, if provided, the number of seconds the asset should be locked. 
If present, it is expected to an a positive integer.

## Unlock an asset

```js
instance.lock.unlockAsset({
    asset,
    note : 'unlocking the lock'
}).then(()=>{
    console.log("Asset unlocked!");
});
```

The parameter ```asset``` is required and it is expected to be an instance of ```Asset```.

The parameter ```note``` is optional.

## Removing the lock from an asset

```js
instance.lock.forceRemoveAssetLock({
    asset,
    note : 'Removing the lock'
}).then(()=>{
    console.log("Asset lock removed!");
});
```

The parameter ```asset``` is required and it is expected to be an instance of ```Asset```.

The parameter ```note``` is optional.

## Check if an asset is locked

```js
instance.content.getAssets()
    .then(( {assets} )=>{
	
	    if( assets[0].isLocked ) {
            console.log( "Asset is locked");
        }
	
    });
```

```js
instance.content.getAssetsById({
    assetsIds : [ 1337, 666 ]
}).then((assets)=>{
    if( assets[0].isLocked ) {
        console.log( "Asset is locked");
    }
});
```

## Getting lock information

Information about whether an asset is locked or not and the member which initiated the lock can be obtain as follows:

```js
instance.lock.getLockInformation({
    asset
}).then((lock)=>{
    console.log( "Asset is " + (lock.isLocked ? "locked" : "unlocked") );
    if( lock.isLocked ) {
        console.log( "Asset is locked by", lock.owner );
    }
});
```

The parameter ```asset``` is required and it is expected to be an instance of ```Asset```.

## Lighter imports

The lock endpoint can be imported from ```digizuite/src/endpoint/lock```;