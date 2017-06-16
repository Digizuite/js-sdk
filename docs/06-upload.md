# Upload an asset

## Request an upload ticket

First step in uploading an asset is requesting an upload ticket.

```js
 document.querySelector('#fileUpload').addEventListener('change', (event)=>{
    instance.upload.requestUploadTickets({
         files : Array.from(event.target.files)
    }).then((tickets) => {
        console.log( "Got upload tickets", tickets );    
    });
});
```

## Upload the asset

After the upload tickets are obtain, the upload process for the files can begin.

```js
instance.upload.uploadAssetsByTicket({
    tickets
}).then((assets) => {
	console.debug("Assets uploaded!", assets);
});
```
The asset instances obtained at this point contains only minimal proprieties(id and name).

### Upload progress

It is possible to subscribe to the ```onProgress``` event in order to receive updates with the upload progress of the asset.

Note: this progress is only in the context of the file upload.   

```js
uploadTicket.onProgress = (progress) => {
	console.log( `File uploaded ${progress}%.` );
};
```

## Awaiting

### Await for the asset to become editable

It is recommended to wait for the newly uploaded asset to become editable before editing any metadata on it. 

While this is not enforced, editing metadata before this can lead to unexpected results.

```js
instance.upload.awaitAssetEditable(assets[0])
    .then((asset)=>{
        console.debug("Asset is ready for metadata edit", asset)
    });
```

The asset instance obtain at this point contains only basic proprieties(id, type and name).

### Await for the asset to be published

```js
instance.upload.awaitAssetPublished(assets[0])
    .then((asset)=>{
        console.debug("Asset published", asset)
    });
```

The asset instance obtain at this point contains all the proprieties.

## Putting everything together 

```js
document.querySelector('#fileUpload').addEventListener('change', (event)=>{

    instance.upload.requestUploadTickets({
        files : Array.from(event.target.files),
    }).then((tickets) => {

        tickets.forEach( thisTicket => { 
        	thisTicket.onProgress = (progress) => { console.log( `File uploaded ${progress}%.` ); }; 
        });

        return instance.upload.uploadAssetsByTicket({ 
            tickets
        });

    })
    .then((assets) => {

        console.debug("Assets uploaded!", assets);

        instance.upload.awaitAssetEditable(assets[0])
            .then((asset)=>{
                console.debug("Asset ready for edit", asset)
            });

        instance.upload.awaitAssetPublished(assets[0])
            .then((asset)=>{
                console.debug("Asset published", asset)
            });

    });
});
```

## Extending a job (advanced)

It is possible to extend an upload job.

```js
ticket.extendJob(
    'DigiImageMagicJobs.JobConvertImage' ,
    { 'CommandLine' : '%infile% -strip -rotate 90   -gravity NorthWest -crop 313x313+232+155 %outfile%' }
);
```