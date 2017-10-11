# Filtering

## Basic filtering

### Filter by freetext
Filter for an asset with a given name, description or keywords:
```js
import {AssetFreeTextFilter} from 'digizuite';

const assetFreeTextFilter = new AssetFreeTextFilter({
    value : 'takeoff'
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
   value : [ Digizuite.Constants.ASSET_TYPE.IMAGE ]
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
    value : {
    	from : 1494720000,
        to : 1495459813
    },
});
instance.content.getAssets({
    filters : [ assetCreatedFilter ]
}).then(({assets})=>{
    console.log("Got assets filtered!", assets);
});
```

The ```from``` and ```to``` proprieties of the values object can be either 
a unix epoch number or an instance of Date.

## Advanced Filtering

### Obtain all available filters
Obtain a list of filters: 
```js
instance.content.getFilters().then((filters)=>{
    console.log("Got filters!", filters);
});
```

### TreeFilter

Obtain a list of possible options for a TreeFilter and add them to the filter: 
```js
instance.content.getFilterOptions({
    filter,
    path : '/'
}).then((response)=>{

    console.log("Got filter options!", response.options);

    filter.appendOptions( [ response.options[0], response.options[1] ] );

    instance.content.getAssets({
        filters : [ filter ]
    }).then(({assets})=>{
        console.log("Got assets filtered!", assets);
    });

});
```
The ```path``` parameter is option. If omitted, it will default to ```/```.



## Faceted Filtering(incomplete)
// TODO

## Lighter imports
```js
import {AssetFreeTextFilter} from 'digizuite/src/model/filter/assetFreeTextFilter'
import {AssetTypeFilter} from 'digizuite/src/model/filter/assetTypeFilter'
import {AssetCreatedFilter} from 'digizuite/src/model/filter/assetCreatedFilter'
import {Constants} from 'digizuite/src/const';
```
