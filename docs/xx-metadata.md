# Metadata

## Get a list of metadata groups

```js
instance.metadata.getMetadataGroups({ asset })
    .then((groups)=>{
        console.log("Got groups!", groups);
    });
```