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
Each information item return can be one of the following 6 types described below. Each information type enforces 
a certain data type as value.  

| Information type | Data type enforced | Notes |
|---------------|--------------------|-------|
| ArrayInformationItem | array | |
| BoolInformationItem | boolean | |
| DateTimeInformationItem | Date | |
| IntInformationItem | number | |
| LongInformationItem | number | |
| StringInformationItem | string | |

Check the documentation on ```InformationItem``` model for details about the exposed proprieties and methods 
of an information item.

## Putting everything together

```js
instance.content.getAssetsInformation({
    assets : [ asset ]
}).then( (resp) => {
	
	resp.assetInformation.forEach((thisAssetInformation) => {

        console.debug( `Information for asset with ID ${thisAssetInformation.assetId}` );

        thisAssetInformation.informationItems.forEach((thisItem)=>{
            console.debug(`${thisItem.label} : ${thisItem.getFormattedValue()}`);
        });

    });
	
} );
```
