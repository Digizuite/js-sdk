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

## Update a metadata item

### String, link, note
```js
thisMetadataItem.setValue(`http://www.google.com`);
 instance.metadata.updateMetadataItems({
    asset,
    metadataItems : [ thisMetadataItem ]
}).then(()=>{
    console.log("Metadata updated!");
});
```


