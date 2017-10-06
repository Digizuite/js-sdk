/**
 * Format duration to a human-readable string
 * @param value
 * @returns {string}
 */
export function formatDuration( value = '' ) {

	while (value.charAt(0) === '0' || value.charAt(0) === ':') {
		value = value.substr(1);
	}
	
	if (value.indexOf(':') === -1) {
		if (value >= 10) {
			value = `0:${value}`;
		} else {
			value = `0:0${value || '0'}`;
		}
	}
	
	value = value.split('.')[0];
	
	return value;
}

/**
 * Format size to a human-readable string
 * @param value
 * @returns {string}
 */
export function formatSize( value = '' ) {
	
	if (value >= 1000 * Math.pow(1024, 3)) {
		value = `${String(Math.round(value / Math.pow(1024, 4) * 100) / 100)} TB`;
	}
	else if (value >= 1000 * Math.pow(1024, 2)) {
		value = `${String(Math.round(value / Math.pow(1024, 3) * 100) / 100)} GB`;
	}
	else if (value >= 1000 * 1024) {
		value = `${String(Math.round(value / Math.pow(1024, 2) * 100) / 100)} MB`;
	}
	else if (value >= 1000) {
		value = `${String(Math.round(value / 1024 * 100) / 100)} KB`;
	}
	else {
		value = `${String(value)} B`;
	}
	
	return value;
}