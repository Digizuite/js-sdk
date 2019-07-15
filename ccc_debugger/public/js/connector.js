(function(globals) {

    setupLog();

    if (!globals.config) {
        console.error('Config file not found or malformed!');
        return;
    }

    console.debug(`Connecting to ${globals.config.apiUrl} with username ${globals.config.username} and password ${'*'.repeat(globals.config.password.length)}...`);

    // Create a digizuite connector
    globals.connectorInstance = new Promise((resolve, reject) => {
        Digizuite.Connector.getConnectorInstance({
            apiUrl: globals.config.apiUrl,
            username: globals.config.username,
            password: globals.config.password,
        }).then(function (instance) {

            console.log("Connector instance created!");

            resolve(instance);
        }).catch(function (error) {

            console.error(`Could not create connector instance! Error: ${error.code || -1} - ${error.message}`);

            if (error.code === Digizuite.Constants.ERROR_CODE.USER_NOT_ALLOWED_PRODUCT_ACCESS) {
                console.error("User was not allowed.");
            }

            reject(error);
        });
    });

    function setupLog() {
        const logTarget = document.getElementById("logTarget");

        if(!logTarget) {
            alert("Log Target not found! Outputting to browser console");
            return;
        }

        ConsoleLogHTML.connect(logTarget, {}, true, true, true);
    }

}(window));
