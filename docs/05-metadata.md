# Metadata

## Get a list of metadata groups

```js
instance.metadata.getMetadataGroups({ asset })
    .then((groups)=>{
        console.log("Got groups!", groups);
    });
```

## Get a list of metadata items in a group

```js
instance.metadata.getMetadataItems({ asset, group })
    .then((items)=>{
        console.log("got metadata items", items);
    });
```

## Manipulating metadata items

All metadata item implement the following methods:
```js
// Setting a value
thisMetadataItem.setValue( myValue );

// Remove the value
thisMetadataItem.clearValue();

// Getting the value
const value = thisMetadataItem.getValue();
```

All metadata items contain the following proprieties:
* name - string - the name of the metadata item
* required - boolean - whether of not the metadata item is required to 
have a value.
* guid - string - an unique id of the metadata item

### Data type enforcement 
Some of the metadata items require that the parameter sent in the ```setValue``` 
to be of a specific type. Failing to provide the parameter with the correct type
will result in an Error being thrown. 

| Metadata type | Data type enforced | Notes |
|---------------|--------------------|-------|
| BitMetadataItem | boolean | |
| IntMetadataItem | number | There is an additional check for number to be integer. NaN is not allowed. |
| FloatMetadataItem | number | NaN is not allowed. |
| StringMetadataItem | string | |
| MoneyMetadataItem | string | |
| LinkMetadataItem | string | |
| DateTimeMetadataItem | Date | ```setValueFromString``` is available where the value can be given as a string with the format ```DD-MM-YYYY HH:mm:ss```. |
| ComboValueMetadataItem | ComboOption | |
| EditComboValueMetadataItem | ComboOption | |
| MultiComboValueMetadataItem | array of ComboOption | |
| EditMultiComboValueMetadataItem | array of ComboOption | |
| TreeMetadataItem | array of TreeOption | |
| UniqueVersionMetadataItem | UniqueOption | |

## Working with combo values

### Obtain a list of all possible values

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

### Updating the value of a combo value

For ComboValue and EditComboValue:
```js
// Set a combo option 
thisMetadataItem.setValue( option );

// Clear the value 
thisMetadataItem.clearValue();
```
 
For MultiComboValue and EditMultiComboValue
```js
// Append an option or an array of options to the metadata item
thisMetadataItem.appendOption( options[0] );
thisMetadataItem.appendOptions( options );

// Set an array of options to the metadata item
thisMetadataItem.setValue( options );

// Removes an option or an array of options from the metadata item
thisMetadataItem.removeOption( option );
thisMetadataItem.removeOptions( options );

// Clear the value 
thisMetadataItem.clearValue();
```

### Create a new combo option

You can create new combo options, that can be added to 
EditComboValue or EditMultiComboValue metadata items.  

```js
const myComboOption = new Digizuite.Metadata.ComboOption({ 
    value : 'MyComboOptionValue' 
});
```

## Working with trees

### Obtain a list of all possible values

```js
instance.metadata.getMetadataItemOptions({
    metadataItem : thisMetadataItem,
    path : '/',
    navigation: {
        page : 1,
        limit: 12
    }
}).then(({ options, navigation })=>{
	console.log("Got options!", options);
    console.log("Got navigation info!", navigation);
});
```

Parameters ```navigation``` and ```path``` are optional. 

### Updating the value of a tree

```js
// Append an option or an array of options to the metadata item
thisMetadataItem.appendOption( options[0] );
thisMetadataItem.appendOptions( options );

// Set an array of options to the metadata item
thisMetadataItem.setValue( options );

// Removes an option or an array of options from the metadata item
thisMetadataItem.removeOption( option );
thisMetadataItem.removeOptions( options );

// Clear the value 
thisMetadataItem.clearValue();
```

## Working with UniqueVersion

Unique version is a metadata item composed of 2 values(unique and version), which should be unique.

### Create a new UniqueVersion
```js
const uniqueOption = new Digizuite.Metadata.UniqueOption({
    unique : '666',
    version : '1337'
});
```

### Setting and updating the value on UniqueVersion

When updating an existing option, it is recommended to create a new instance of UniqueOption and set it as the value.
```js
const uniqueOption = new Digizuite.Metadata.UniqueOption({
    unique : '666',
    version : '1337'
});
thisMetadataItem.setValue(uniqueOption);
```

### Verify that a UniqueVersion is unique
```js
instance.metadata.verifyUniqueVersion({
    asset,
    metadataItem : thisMetadataItem
}).then(() => {
   console.debug("Is Unique");
}).catch(()=>{
    console.debug("Is NOT Unique");
});
```

## Saving a changes to metadata items

After modifying one or more metadata items, they can be save as follows:
```js
instance.metadata.updateMetadataItems({
    asset,
    metadataItems : [ changedMetadataItem ]
}).then(()=>{
    console.log("Metadata updated!");
});
```

It is recommended to save the update in batch( multiple metadata items at  once).

It is recommended to send as parameter only metadata items that have been modified.