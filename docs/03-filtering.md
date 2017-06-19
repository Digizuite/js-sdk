# Filtering

## Basic filtering

### Filter by freetext
Filter for an asset with a given name, description or keywords:
```js
import {AssetFreeTextFilter} from 'digizuite';

const assetFreeTextFilter = new AssetFreeTextFilter({
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
import {AssetTypeFilter} from 'digizuite';

const assetTypeFilter = new AssetTypeFilter({
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
import {AssetCreatedFilter} from 'digizuite';

const assetCreatedFilter = new AssetCreatedFilter({
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
instance.content.getFilters().then((filters)=>{
    console.log("Got filters!", filters);
});
```

All the filter type can be found in the constants class.
```js
import {Constants} from 'digizuite';
console.log( Constants.FILTER_TYPE );
``` 

## Faceted Filtering(incomplete)
// TODO

## Lighter imports
```js
import {AssetFreeTextFilter} from 'digizuite/src/model/filter/assetFreeTextFilter'
import {AssetTypeFilter} from 'digizuite/src/model/filter/assetTypeFilter'
import {AssetCreatedFilter} from 'digizuite/src/model/filter/assetCreatedFilter'
import {Constants} from 'digizuite/src/const';
```
