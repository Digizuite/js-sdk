import endsWith from "lodash-es/endsWith";

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
 * @param path
 * @returns {string}
 */
export const getExtension = (path: string) => {
	return path.substr(path.lastIndexOf('.') + 1);
};
