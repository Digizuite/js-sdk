# Metadata (WIP)

## Get a list of metadata groups

```js
instance.metadata.getMetadataGroups({ asset })
    .then((groups)=>{
        console.log("Got groups!", groups);
    });
```

## Get a list of metadata items in a group

```js
instance.metadata.getMetadataItems({ asset, group,})
    .then((items)=>{
        console.log("got metadata items", items);
    });
```

## Manipulating metadata item

### ComboValue, MultiComboValue, EditComboValue, EditMultiComboValue

#### Obtain a list of all possible values

```js
instance.metadata.getMetadataItemOptions({
    metadataItem : thisMetadataItem,
    query : 'com',
    navigation: {
        page : 1,
        limit: 12
    }
}).then(({ options, navigation })=>{
	console.log("Got options!", options);
    console.log("Got navigation info!", navigation);
});
```

Parameters ```navigation``` and ```query``` are optional. 

#### Updating the value of a combo input

```js
// Append a new option to the metadata item
thisMetadataItem.appendOption( options[0] );

// Set an array of options to the metadata item
thisMetadataItem.setValue( options );

// Removes an option from the metadata item
thisMetadataItem.removeOption( option );
```

For EditMultiComboValue , the following are also available:
```js
// Append an array of options to the metadata item
thisMetadataItem.appendOptions( options );

// Removes an array of options from the metadata item
thisMetadataItem.removeOptions( options );

// Set an array of options to the metadata item
thisMetadataItem.setValue( options );
```


#### Create a new ComboOption

You can create new combo options, that can be added to 
EditComboValue or EditMultiComboValue metadata items.  

```js
const myComboOption = new new Digizuite.Metadata.ComboOption({ 
    value : 'MyComboOptionValue' 
});
```

## Saving 

After modifying one or more metadata items, they can be save as follows:
```js
instance.metadata.updateMetadataItems({
    asset,
    metadataItems : [ thisMetadataItem ]
}).then(()=>{
    console.log("Metadata updated!");
});
```

It is recommended to save the update in batch( multiple metadata items at  once).

It is recommended to send as parameter only metadata items that have been modified.