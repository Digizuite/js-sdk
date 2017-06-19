# Filtering

## Basic filtering

### Filter by freetext
Filter for an asset with a given name, description or keywords:
```js
const assetFreeTextFilter = new Digizuite.AssetFreeTextFilter({
    text : 'takeoff'
});
instance.content.getAssets({
    filters : [ assetFreeTextFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

### Filter by asset type 
Filter for an asset of an given type:
```js
const assetTypeFilter = new Digizuite.AssetTypeFilter({
   types : [ Digizuite.Constants.ASSET_TYPE.IMAGE ]
});
instance.content.getAssets({
    filters : [ assetTypeFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

### Filter by asset created date
Filter for an asset created in a given time interval
```js
const assetCreatedFilter = new Digizuite.AssetCreatedFilter({
    from : 1494720000,
    to : 1495459813
});
instance.content.getAssets({
    filters : [ assetCreatedFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

In case ```from``` parameter is not provided, it will default to 0.

In case ```to``` parameter is not provided, it will default to current unix timestamp.


## Advanced Filtering(incomplete)

### Obtain all available filters
Obtain a list of filters: 
```js
instance.content.getFilters().then((response)=>{
    console.log("Got filters!", response);
});
```

All the filter type can be found in the constants class.
```js
console.log( Digizuite.Constants.FILTER_TYPE )
``` 

## Faceted Filtering(incomplete)
// TODO