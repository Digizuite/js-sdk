(async function(globals){

    const instance = await globals.connectorInstance;

    await checkFolders(instance);
    await checkAssets(instance);

    instance.destroy();
    console.log('Instance destroyed');

    console.log('Done diddly done!');

    /**
     * Check folders
     * @param instance
     * @returns {Promise<void>}
     */
    async function checkFolders(instance) {
        try {
            const foldersResp = await instance.content.getFolders({
                path: '/'
            });

            console.log(`Fetched ${foldersResp.folders.length} folders.`);
        } catch (e) {
            console.error(`Error loading folders. ${e}`)
        }
    }

    /**
     * Check folders
     * @param instance
     * @returns {Promise<void>}
     */
    async function checkAssets(instance) {
        try {
            const assetsResp = await instance.content.getAssets({
                navigation: {
                    page: 1,
                    limit: 12
                },
            });

            console.log(`Fetched ${assetsResp.assets.length} of ${assetsResp.navigation.total} assets successfully.`);
        } catch (e) {
            console.error(`Error loading assets. ${e}`)
        }
    }

}(window));
