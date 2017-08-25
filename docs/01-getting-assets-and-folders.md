# Getting assets and folders 

## Obtaining a list of folder
```js
instance.content.getFolders({
    path : '/'
}).then((response)=>{
    console.log("Got folders!", response);
});
```

You can use ```'/'``` as the root folder. Each folder contains a ```path``` propriety, 
which can be used to as a parameter to obtain a list of sub-folders.

## Getting assets

Obtain a list of assets: 
```js
instance.content.getAssets()
    .then(( {assets} )=>{
        console.log("Got assets!", assets);
    });
```

If the ```path``` parameter path is not provided, it will default to ```/```.

### Pagination and navigation
You can specify pagination parameters when requesting the assets. If ```navigation`````
parameter is not give, it will default to returning the first 25 assets.

```js
instance.content.getAssets({
    navigation : {
        page : 1,
        limit : 12
    }
}).then(({assets, navigation})=>{
    console.log("Got assets for page 1!", assets);
    console.log("Got total assets count!", navigation.total);
});
```

## Getting assets by their IDs

You can get an array of specific assets using their IDs.

```js
instance.content.getAssetsById({
    assetsIds : [ 1337, 666 ]
}).then((assets)=>{
    console.log("Got assets by ID!", assets);
});
```


## Getting asset type
To get the type of an asset compare it with the `Digizuite.Constants.ASSET_TYPE_REVERSE` 
and `Digizuite.Constants.ASSET_TYPE`. Both of these are dictionaries. 

`ASSET_TYPE_REVERSE` goes number -> Asset type  
`ASSET_TYPE` goes Asset type -> number

|Asset type|number|
|-------|------|
|VIDEO | 1|
|AUDIO | 2|
|IMAGE | 4|
|POWERPOINT | 5|
|HTML | 6|
|TEXT | 7|
|WORD | 8|
|EXCEL | 9|
|INDESIGN | 10|
|ZIP | 11|
|ARCHIVE | 15|
|LIVE | 1000|
|META | 12|
|PDF | 14|
|ODF | 110|
|ODG | 107|
|ODB | 109|
|ODM | 111|
|ODP | 105|
|ODS | 102|
|OTH | 112|
|OTP | 106|
|ODT | 100|
|OTG | 108|
|OTS | 103|
|OTT | 101|
|PHOTOSHOP | 16|
|ILLUSTRATOR | 17|

## Pagination and es5
An example of how to use the above code to do pagination. 

```js
 var ASSETS_PER_PAGE = 12;

// Get the firts page
instance.content.getAssets({
    navigation: {
        page: 1,
        limit: ASSETS_PER_PAGE
    }
}).then(function (response) {
    // Get the assets from the response
    var assets = response.assets;
    // Get the navigation information
    var navigation = response.navigation;

    console.log('got ' + assets.length + ' assets');
    console.log('total amount of assets available is ' + navigation.total);

    var totalPages = Math.ceil(navigation.total / ASSETS_PER_PAGE);

    console.log('total number of pages available: ' + totalPages);

    // Get page 2
    instance.content.getAssets({
        navigation: {
            page: 2,
            limit: ASSETS_PER_PAGE
        }
    }).then(function(response) {
        var secondPageAssets = response.assets;
        console.log('get ' + secondPageAssets.length + ' assets');
    })

}).catch(function (error) {
    console.error('something went horribly wrong', error);
});

```