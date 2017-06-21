# Batch Update (advanced)

Batch Update is a low level API for making updates to the DAM Center. 

You should not be using Batch Update, unless you know exactly what you are doing.

## Update containers

### Create containers

Create an update container

```js
import {UpdateContainer} from 'digizuite';

const updateContainer = new UpdateContainer({
    type: UpdateContainer.CONTAINER_TYPE.ItemIdsValuesRowid,
    itemIds : [ 111, 112, 113 ],
    id : 'Container1',
    fieldName : 'asset',
    rowId : 0,
});
```

The parameters ```id```, ```fieldName``` and ```rowId``` are optional. 

### Add items to containers

Add an item to update container:

```js
updateContainer.addItem({
    fieldId : 'CustomID',
    fieldName: 'metafield',
    fieldProperties: {
        standardGuid: '17C54460-E6CC-4BDA-ABE3-628532617EBD'
    },
    // Update integer-list to contain currently selected favorites
    valueType: Digizuite.UpdateContainer.VALUE_TYPE.Bool,
    value: 0
});
```
The parameters ```fieldId``` and ```fieldProperties``` are optional. 

Multiple items can be appended to a single container.

## Making the update

```js
instance.batch.update({
    containers : [ updateContainer ]
})
```

## Lighter imports

The ```UpdateContainer``` object is also available as import from ```digizuite/src/utilities/updateContainer```. 

The batch endpoint can be imported from ```digizuite/src/endpoint/batch```;