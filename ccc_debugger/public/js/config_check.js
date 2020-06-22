(async function(globals){

    const instance = await globals.connectorInstance;

    ok('configs fetched!');

    await validateConfigs(instance.state.config);

    async function validateConfigs(configs) {
        let errors = 0;
        errors += checkEmptyConfigs(configs);
        errors += checkMediaUrl(configs.MediaUrl);
        errors += await checkPortalMenu(configs.PortalMenu);

        if(errors) {
            err(`Found ${errors}. This may cause the connector to not work as expected`);
        } else {
            ok('All configs checks passed!')
            ok('Done didly done!')
        }
    }

    async function checkPortalMenu(portalMenu) {
        let portalMenuMetaField = await instance.metadata.getMetadataItemsById({
            metafieldId: portalMenu.metafieldItemId
        });

        if(portalMenuMetaField[0].TYPE !== Digizuite.TreeMetadataItem.TYPE) {
            err(`PortalMenu needs to be of type tree.`);
            return 1;
        }

        return 0;
    }

    function checkMediaUrl(mediaUrl) {
        if(!mediaUrl.endsWith("/")) {
            err("MediaUrl has to end with with a slash(/)")
            return 1;
        }

        return 0;
    }

    function checkEmptyConfigs(configs) {
        let errors = 0;
        Object.keys(configs).forEach(configKey => {
           if(isEmpty(configs[configKey])) {
               err(`${configKey} has no set value`);
               errors++;
           }
        });
        return errors;
    }

    function isEmpty(val) {
        if(val === null || val === undefined || val === "") {
            return true;
        }

        if(Array.isArray(val)) {
            return val.length === 0;
        }

        if(typeof val === "object") {
            return Object.keys(val).length === 0;
        }

        return false;
    }

    function ok(msg) {
        console.log(`[OK] ${msg}`)
    }

    function err(msg) {
        console.error(`[FAIL] ${msg}`)
    }

})(window);
