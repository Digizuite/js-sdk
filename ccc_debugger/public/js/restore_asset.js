(async function(globals){

    const assetIdInput = document.querySelector('#assetId');
    const restoreTrigger = document.querySelector('#restoreTrigger');

    const instance = await globals.connectorInstance;

    // Buttons
    console.debug('Enabling replace buttons.');
    restoreTrigger.addEventListener('click', onReplaceTriggered);
    restoreTrigger.removeAttribute('disabled');

    async function onReplaceTriggered() {

        console.debug('RestoreTrigger was clicked.');

        const assetItemId = assetIdInput.value;

        if (!assetItemId) {
            console.error('Asset Id not set.');
            return;
        }

        const [asset] = await instance.content.getAssetsById({ assetIds: [assetItemId]});

        if (!asset) {
            console.error(`Asset with ItemId ${assetItemId} not found :(...`);
            return;
        }

        console.debug(`Found asset ${asset.name} with ItemId ${assetItemId}!`);

        restoreTrigger.setAttribute('disabled', 'disabled');

        try {

            const [, previousVersion] = await instance.version.getAssetVersions({ asset });

            if (!previousVersion) {
                console.error(`Could not find any version for ItemId ${assetItemId}!`);
                return;
            }

            console.debug(`Found asset history for ItemId ${assetItemId}...`);

            const ticket = await instance.version.requestRestoreTicket({
                asset,
                version: previousVersion
            });

            await instance.version.restoreAssetByTicket({ ticket });

            console.debug(`Asset ${asset.id} successfully restored!`);

        } catch (e) {
            console.error(`Error uploading files. ${e.code || -1} - ${e.message}`)
        }

    }

}(window));
