# Replace an asset

## Request an upload ticket

First step in replacing an asset is requesting a replace ticket.

```js
 document.querySelector('#fileUpload').addEventListener('change', (event)=>{
    instance.upload.requestReplaceTicket({
        file : event.target.files[0],
        asset    
    }).then((tickets) => {
        console.log( "Got replace ticket", ticket );    
    });
});
```

## Replace the asset

After the replace tickets are obtain, the upload process for the replacement file can begin.

```js
instance.upload.replaceAssetByTicket({
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

## Awaiting

Unlike during upload, there is no way to await for the replacement asset to published at the moment.