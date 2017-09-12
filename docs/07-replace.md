# Replace an asset

## Request an upload ticket

First step in replacing an asset is requesting a replace ticket.

```js
 document.querySelector('#fileUpload').addEventListener('change', (event)=>{
    instance.version.requestReplaceTicket({
        file : event.target.files[0],
        asset    
    }).then((tickets) => {
        console.log( "Got replace ticket", ticket );    
    });
});
```

## Replace the asset

After the replace tickets are obtained, the upload process for the replacement file can begin.

```js
instance.version.replaceAssetByTicket({
    ticket
}).then(() => {
	console.debug("Assets replacement uploaded!");
});
```
### Upload progress

It is possible to subscribe to the ```onProgress``` event in order to receive updates with the upload progress of the replacement file.

Note: this progress is only in the context of the file upload.   

```js
uploadTicket.onProgress = (progress) => {
	console.log( `File uploaded ${progress}%.` );
};
```

### Await for the asset to be published

```js
instance.upload.awaitAssetPublished(asset)
    .then((replacedAsset)=>{
        console.debug("Asset replace finished. Asset is now published.", replacedAsset)
    });
```

The ```replacedAsset``` instance obtain at this point contains all the updated proprieties for the replaced asset.

## Putting everything together 

```js
document.querySelector('#fileUpload').addEventListener('change', (event)=>{

    instance.version.requestReplaceTicket({
        file : event.target.files[0],
        asset
    }).then((ticket) => {

        ticket.onProgress = (progress) => {
            console.log( `File uploaded ${progress}%.` );
        };

        return instance.version.replaceAssetByTicket({
            ticket
        });

    }).then(()=>{
        console.debug("Asset replaced!");
    });
    
});
```