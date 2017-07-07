export class LoggerUtility {
	
	static get LogLevelEnums() {
		return {
			Debug  : 10,
			Info   : 20,
			Warning: 30,
			Error  : 40,
			Fatal  : 50
		};
	}
	
	/**
	 * Class constructor
	 */
	constructor() {
		
		// Log levels
		this.LogLevel = LoggerUtility.LogLevelEnums;
		
		// .. and the invert
		this.LogLevelInverse = {};
		
		Object.keys(this.LogLevel).forEach(
			key => { this.LogLevelInverse[this.LogLevel[key]] = key; }
		);
		
	}
	
	/**
	 *
	 * @param level
	 * @param message
	 * @param context
	 */
	log(level, message, context = []) {
		
		let fullMessage = `[${this.LogLevelInverse[level]}] ${message}`;
		
		let backgroundColor = {
			'Debug'  : 'initial',
			'Info'   : 'initial',
			'Warning': 'orange',
			'Error'  : 'red',
			'Fatal'  : 'red'
		};
		
		if( window.console ) {
			console.groupCollapsed(`%c ${fullMessage}`, `background-color: ${backgroundColor[this.LogLevelInverse[level]]}`);
			console.log(fullMessage);
			console.log(context);
			console.trace('Stack Trace');
			console.groupEnd(fullMessage);
		}
		
	}
	
	/**
	 * Quick method for logging to debug level
	 * @param message
	 * @param context
	 */
	debug(message, context = []) {
		this.log(LoggerUtility.LogLevelEnums.Debug, message, context);
	}
	
	/**
	 * Quick method for logging to info level
	 * @param message
	 * @param context
	 */
	info(message, context = []) {
		this.log(LoggerUtility.LogLevelEnums.Info, message, context);
	}
	
	/**
	 * Quick method to logging for warning level
	 * @param message
	 * @param context
	 */
	warn(message, context = []) {
		this.log(LoggerUtility.LogLevelEnums.Warning, message, context);
	}
	
	/**
	 * Quick method for logging to error level
	 * @param message
	 * @param context
	 */
	error(message, context = []) {
		this.log(LoggerUtility.LogLevelEnums.Error, message, context);
	}
	
	/**
	 * Quick method for logging to fatal level
	 * @param message
	 * @param context
	 */
	fatal(message, context = []) {
		this.log(LoggerUtility.LogLevelEnums.Fatal, message, context);
	}
	
}

export const Logger = new LoggerUtility({});
export const LogInfo = Logger.info.bind(Logger);
export const LogDebug = Logger.debug.bind(Logger);
export const LogWarn = Logger.warn.bind(Logger);
export const LogError = Logger.error.bind(Logger);
export const LogFatal = Logger.fatal.bind(Logger);