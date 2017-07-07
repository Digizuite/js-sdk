/**
 * Compares 2 version
 *
 * Returns:
 * -1 = left is LOWER than right
 *  0 = they are equal
 *  1 = left is GREATER = right is LOWER
 *  And FALSE if one of input versions are not valid
 *
 * @param {String} left
 * @param {String} right
 * @returns {Number}
 */
function compare(left, right) {
	
	// Sanity check the input
	if (typeof left !== 'string' || typeof right !== 'string') {
		return 0;
	}
	
	const a   = left.split('.');
	const b   = right.split('.');
	const len = Math.max(a.length, b.length);
	
	for (let i = 0; i < len; i++) {
		if ((a[i] && !b[i] && parseInt(a[i], 10) > 0) || (parseInt(a[i], 10) > parseInt(b[i], 10))) {
			return 1;
		} else if ((b[i] && !a[i] && parseInt(b[i], 10) > 0) || (parseInt(a[i], 10) < parseInt(b[i], 10))) {
			return -1;
		}
	}
	
	return 0;
}

/**
 * Normalizes the DAM version
 * @param damVersion
 * @returns {string}
 */
function normalizeDAMVersion(damVersion = '') {
	
	let index, char;
	
	const damVersionLength = damVersion.length;
	
	// Navigate the char until the first character that is not . or a digit
	for (index = 0; index < damVersionLength; index++) {
		char = damVersion.charAt(index);
		if (char !== '.' && isNaN(parseInt(char, 10))) {
			break;
		}
	}
	
	// if last char is a dot, remove it
	if (damVersion.charAt(index - 1) === '.') {
		index = index - 1;
	}
	
	return damVersion.substr(0, index);
}

/**
 * Alias method. Checks if left is GREATER THAN right
 * @param {String} damVersion
 * @param {String} againstVersion
 * @returns {boolean}
 */
export const greaterThan = (damVersion, againstVersion) => {
	return compare(normalizeDAMVersion(damVersion), againstVersion) > 0;
};

/**
 * Alias method. Checks if left is GREATER THAN right or equal
 * @param {String} damVersion
 * @param {String} againstVersion
 * @returns {boolean}
 */
export const greaterOrEqualThan = (damVersion, againstVersion) => {
	return compare(normalizeDAMVersion(damVersion), againstVersion) >= 0;
};

/**
 * Alias method. Checks if left is LOWER THAN right
 * @param {String} damVersion
 * @param {String} againstVersion
 * @returns {boolean}
 */
export const lowerThan = (damVersion, againstVersion) => {
	return compare(normalizeDAMVersion(damVersion), againstVersion) < 0;
};

/**
 * Alias method. Checks if left is LOWER THAN right or equal
 * @param {String} damVersion
 * @param {String} againstVersion
 * @returns {boolean}
 */
export const lowerOrEqualThan = (damVersion, againstVersion) => {
	return compare(normalizeDAMVersion(damVersion), againstVersion) <= 0;
};
