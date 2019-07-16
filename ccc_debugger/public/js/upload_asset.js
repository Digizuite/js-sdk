(async function(globals){

    const fileInput = document.querySelector('#fileUpload');

    const instance = await globals.connectorInstance;

    console.debug('Enabling upload button.');
    fileInput.addEventListener('change', onFilesSelected);
    fileInput.removeAttribute('disabled');

    async function onFilesSelected(event) {
        console.debug('FileInput was detected a change.');

        try {

            const tickets = await instance.upload.requestUploadTickets({
                files: Array.from(event.target.files),
            });

            tickets.forEach( thisTicket => { thisTicket.onProgress = (progress) => { console.log(`Upload Progress: ${progress}%`) }; } );

            const assets = await instance.upload.uploadAssetsByTicket({
                tickets
            });

            console.log(`${assets.length} successfully uploaded!`);

            assets.forEach(async asset => {
                await instance.upload.awaitAssetEditable(asset);
                console.log(`Asset ${asset.id} is ready for edit!`);

                await instance.upload.awaitAssetPublished(asset);
                console.log(`Asset ${asset.id} is published!`);
            });

        } catch (e) {
            console.error(`Error uploading files. ${e.code || -1} - ${e.message}`)
        }

    }

}(window));
