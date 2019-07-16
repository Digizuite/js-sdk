(async function(globals){

    const assetIdInput = document.querySelector('#assetId');
    const fileInput = document.querySelector('#fileUpload');
    const replaceTrigger = document.querySelector('#replaceTrigger');

    const instance = await globals.connectorInstance;

    // Buttons
    console.debug('Enabling replace buttons.');
    fileInput.addEventListener('change', onFilesSelected);
    replaceTrigger.addEventListener('click', onReplaceTriggered);
    fileInput.removeAttribute('disabled');
    replaceTrigger.removeAttribute('disabled');

    async function onReplaceTriggered() {

        console.debug('ReplaceTrigger was clicked.');

        const assetItemId = assetIdInput.value;
        const file = fileInput.files[0];

        if (!assetItemId || !file) {
            console.error('Asset Id or FileInput not set.');
            return;
        }

        const [asset] = await instance.content.getAssetsById({ assetIds: [assetItemId]});

        if (!asset) {
            console.error(`Asset with ItemId ${assetItemId} not found :(...`);
            return;
        }

        console.debug(`Found asset ${asset.name} with ItemId ${assetItemId}!`);

        replaceTrigger.setAttribute('disabled', 'disabled');

        try {

            const ticket = await instance.version.requestReplaceTicket({ file, asset });

            ticket.onProgress = (progress) => { console.log(`Upload Progress: ${progress}%`); };

            await instance.version.replaceAssetByTicket({ ticket });

            console.debug(`Asset ${asset.id} successfully replaced!`);

            await instance.upload.awaitAssetPublished(asset);

            console.log(`Asset ${asset.id} is published!`);

        } catch (e) {
            console.error(`Error uploading files. ${e.code || -1} - ${e.message}`)
        }

    }

    async function onFilesSelected() {
        console.debug('FileInput was detected a change.');
    }

}(window));
