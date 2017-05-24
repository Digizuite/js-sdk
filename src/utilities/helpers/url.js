import endsWith from 'lodash/endsWith';

/**
 *
 * @param url
 * @returns {string}
 */
export const ensureTrailingSeparator = (url = '') => {
	return url + (endsWith(url, '/') ? '' : '/');
};