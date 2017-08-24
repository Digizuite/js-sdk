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