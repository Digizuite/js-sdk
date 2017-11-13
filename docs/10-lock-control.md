# Lock Control

## Lock an asset

```js
instance.lock.lockAsset({
    asset,
    note : 'Lock due to lock'
}).then(()=>{
    console.log("Asset locked!");
});
```

The parameter ```asset``` is required and it is expected to be an instance of ```Asset```.

The parameter ```note``` is optional.

## Unlock an asset

```js
instance.lock.unlockAsset({
    asset,
    note : 'Removed lock'
}).then(()=>{
    console.log("Asset locked!");
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