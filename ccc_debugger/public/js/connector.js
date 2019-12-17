(function(globals) {

    setupLog();

    if (!globals.config) {
        console.error('Config file not found or malformed!');
        return;
    }

    console.debug(`Connecting to ${globals.config.siteUrl}...`);

    globals.connectorInstance = Digizuite.Connector.getConnectorInstance({
        siteUrl: globals.config.siteUrl
    }).then(instance => {
        const constants = instance.getConstants();
        if (constants.useFederatedAuthentication) {
            //.. Federated Auth here
            console.debug(`Logging in with SSO...`);

            const accessKey = getAccessKeyFromUrl();

            if (!accessKey) {
                const ssoUrl = instance.getSSOLoginUrl(window.location.href);
                console.log(`AccessKey not found in URL. Got SSO URL: ${ssoUrl}`);
                showAuthLink(ssoUrl);
                return new Promise(() => {});
            } else {
                return instance.connectWithAccessKey(accessKey);
            }

        } else {
            console.debug(`Logging in with credentials. Username: ${globals.config.username}, password: ${'*'.repeat(globals.config.password.length)}...`);
            return instance.connectWithCredentials(globals.config.username, globals.config.password);
        }
    });

    globals.connectorInstance.then(() => {
        console.log("Connector instance created!");
    }).catch(error => {

        console.error(`Could not create connector instance! Error: ${error.code || -1} - ${error.message}`);

        if (error.code === Digizuite.Constants.ERROR_CODE.USER_NOT_ALLOWED_PRODUCT_ACCESS) {
            console.error("User was not allowed.");
        }
    });


    /**
     * Get the accesskey from url
     */
    function getAccessKeyFromUrl() {
        const searchParams = new URLSearchParams(window.location.search.slice(1));
        return searchParams.get("accessKey") || '';
    }

    /**
     * Generate auth link
     */
    function showAuthLink(ssoUrl) {
        const href = document.querySelector('#authLink');
        href.setAttribute('href', ssoUrl);
        href.textContent = ssoUrl;
        href.style.display = 'block';

        console.log('Click on the link on top to login!');
    }

    function setupLog() {
        const logTarget = document.getElementById("logTarget");

        if(!logTarget) {
            alert("Log Target not found! Outputting to browser console");
            return;
        }

        ConsoleLogHTML.connect(logTarget, {}, true, true, true);
    }

}(window));
