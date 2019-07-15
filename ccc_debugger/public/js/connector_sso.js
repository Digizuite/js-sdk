(async function(globals) {

    setupLog();

    if (!globals.config) {
        console.error('Config file not found or malformed!');
        return;
    }

    globals.connectorInstance = new Promise(async (resolve, reject) => {

        const accessKey = getAccessKeyFromUrl();

        if (!accessKey) {
            console.log('AccessKey not found in URL...');
            await generateAuthLink();
        } else {

            console.log(`Found accessKey ${accessKey} in URL!`);
            hideAuthLink();

            try {
                const instance = await Digizuite.Connector.getConnectorInstance({
                    apiUrl : globals.config.apiUrl,
                    accessKey
                });

                console.log("Connector instance created!");
                resolve(instance);

            } catch (e) {
                console.error(`Could not create connector instance! Error: ${error.code || -1} - ${error.message}`);
                reject(e);
            }

        }
    });

    /**
     * Setup logs
     */
    function setupLog() {
        const logTarget = document.getElementById("logTarget");

        if(!logTarget) {
            alert("Log Target not found! Outputting to browser console");
            return;
        }

        ConsoleLogHTML.connect(logTarget, {}, true, true, true);
    }

    /**
     * Get the accesskey from url
     */
    function getAccessKeyFromUrl() {
        const queryString = globals.location.search;
        const query = {};
        const pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&');
        for (let i = 0; i < pairs.length; i++) {
            const pair = pairs[i].split('=');
            query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '');
        }

        return query['accessKey'];
    }

    /**
     * Generate auth link
     * @returns {Promise<void>}
     */
    async function generateAuthLink() {

        console.debug(`Generating SSO URL...`);

        try {
            const ssoUrl = await Digizuite.Connector.getSSOLoginUrl({
                apiUrl: globals.config.apiUrl,
                callbackUrl: window.location.href
            });

            console.log(`Got SSO Auth URL ${ssoUrl}`);

            const href = document.querySelector('#authLink');
            href.setAttribute('href', ssoUrl);
            href.textContent = ssoUrl;

            console.log('Click on the link on top to login!');

        } catch (e) {
            console.error(`Error fetching configurations. ${e.message}`);
        }
    }

    function hideAuthLink() {
        const href = document.querySelector('#authLink');
        href.style.display = 'none';
    }

}(window));
