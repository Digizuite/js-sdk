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