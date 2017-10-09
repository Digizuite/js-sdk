/**
 * Format duration to a human-readable string
 * @param value
 * @returns {string}
 */
export function formatDuration(value = ''): string {

	while (value.charAt(0) === '0' || value.charAt(0) === ':') {
		value = value.substr(1);
	}

	if (value.indexOf(':') === -1) {
		if (parseInt(value, 10) >= 10) {
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
export function formatSize(value: number): string {

	let result: string;

	if (value >= 1000 * Math.pow(1024, 3)) {
		result = `${String(Math.round(value / Math.pow(1024, 4) * 100) / 100)} TB`;
	} else if (value >= 1000 * Math.pow(1024, 2)) {
		result = `${String(Math.round(value / Math.pow(1024, 3) * 100) / 100)} GB`;
	} else if (value >= 1000 * 1024) {
		result = `${String(Math.round(value / Math.pow(1024, 2) * 100) / 100)} MB`;
	} else if (value >= 1000) {
		result = `${String(Math.round(value / 1024 * 100) / 100)} KB`;
	} else {
		result = `${String(value)} B`;
	}

	return result;
}
