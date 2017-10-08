# Asset Information

## Getting asset information

```js
instance.content.getAssetsInformation({
    assets : [ asset1 ]
}).then( (resp) => {
	
	console.log( resp )
	
} );
```

The call will return an array of ```assetInformation```, one for each asset supplied as parameter.
Each ```assetInformation``` contains the asset ID and a list of information items.

### Information Items
Check the documentation on ```InformationItem``` model for details about the exposed proprieties and methods 
of an information item.

### Notes

It is highly recommended to use the ```getFormattedValue``` method when presenting the user the value of the information item, 
over the ```value``` propriety. 

## Putting everything together

```js
instance.content.getAssetsInformation({
    assets : [ asset ]
}).then( (resp) => {
	
	resp.assetInformation.forEach((thisAssetInformation) => {

        console.debug( `Information for asset with ID ${thisAssetInformation.assetId}` );

        thisAssetInformation.informationItems.forEach((thisItem)=>{
            console.debug(`${thisItem.name} : ${thisItem.getFormattedValue()}`);
        });

    });
	
} );
```
