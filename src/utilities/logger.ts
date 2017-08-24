export interface ILogLevels {
    Debug: number;
    Info: number;
    Warning: number;
    Error: number;
    Fatal: number;

    [key: string]: number;
}

export interface ILogLevelsInverse {
    10: string;
    20: string;
    30: string;
    40: string;
    50: string;

    [key: number]: string;
}

export class LoggerUtility {
    LogLevelInverse: ILogLevelsInverse;
    LogLevel: ILogLevels;

    /**
     * Class constructor
     */
    constructor() {

        // Log levels
        this.LogLevel = LoggerUtility.LogLevelEnums;

        // .. and the invert
        let LevelInverse: { [key: number]: string } = {};

        Object.keys(this.LogLevel).forEach(
            key => {
                LevelInverse[this.LogLevel[key]] = key;
            }
        );

        this.LogLevelInverse = <ILogLevelsInverse><any>LevelInverse;

    }

    static get LogLevelEnums() {
        return {
            Debug: 10,
            Info: 20,
            Warning: 30,
            Error: 40,
            Fatal: 50
        };
    }

    /**
     *
     * @param level
     * @param message
     * @param context
     */
    log(level: number, message: string, context: any = []) {

        let fullMessage = `[${this.LogLevelInverse[level]}] ${message}`;

        let backgroundColor: { [key: string]: string } = {
            'Debug': 'initial',
            'Info': 'initial',
            'Warning': 'orange',
            'Error': 'red',
            'Fatal': 'red'
        };

        if (window.console) {
            console.groupCollapsed(`%c ${fullMessage}`, `background-color: ${backgroundColor[this.LogLevelInverse[level]]}`);
            console.log(fullMessage);
            console.log(context);
            console.trace('Stack Trace');
            console.groupEnd();
        }

    }

    /**
     * Quick method for logging to debug level
     * @param message
     * @param context
     */
    debug(message: string, context: any = []) {
        this.log(LoggerUtility.LogLevelEnums.Debug, message, context);
    }

    /**
     * Quick method for logging to info level
     * @param message
     * @param context
     */
    info(message: string, context: any = []) {
        this.log(LoggerUtility.LogLevelEnums.Info, message, context);
    }

    /**
     * Quick method to logging for warning level
     * @param message
     * @param context
     */
    warn(message: string, context: any = []) {
        this.log(LoggerUtility.LogLevelEnums.Warning, message, context);
    }

    /**
     * Quick method for logging to error level
     * @param message
     * @param context
     */
    error(message: string, context: any = []) {
        this.log(LoggerUtility.LogLevelEnums.Error, message, context);
    }

    /**
     * Quick method for logging to fatal level
     * @param message
     * @param context
     */
    fatal(message: string, context: any = []) {
        this.log(LoggerUtility.LogLevelEnums.Fatal, message, context);
    }

}

export const Logger = new LoggerUtility();
export const LogInfo = Logger.info.bind(Logger);
export const LogDebug = Logger.debug.bind(Logger);
export const LogWarn = Logger.warn.bind(Logger);
export const LogError = Logger.error.bind(Logger);
export const LogFatal = Logger.fatal.bind(Logger);