import endsWith from 'lodash/endsWith';

/**
 *
 * @param url
 * @returns {string}
 */
export const ensureTrailingSeparator = (url = '') => {
	return url + (endsWith(url, '/') ? '' : '/');
};

/**
 * Extracts the extension from a path
 * @param _path
 * @returns {string}
 */
export const getExtension = (_path = '') => {
	const path = String(_path);
	return path.substr(path.lastIndexOf('.') + 1);
};