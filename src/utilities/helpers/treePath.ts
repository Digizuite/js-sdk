import initial from 'lodash-es/initial';
import last from 'lodash-es/last';
import trim from 'lodash-es/trim';

/**
 * Transforms a slug to idPath
 * @param slug
 * @returns {string}
 */
export const unslugIdPath = (slug = '') => {
	return `/${slug.replace(/-/g, '/')}/`;
};

/**
 * Slugs an idpath
 * @param {string} idPath
 * @returns {string}
 */
export const slugIdPath = (idPath = '') => {
	return trim(idPath, '/').replace(/\//g, '-');
};

/**
 *
 * @param idPath
 * @returns {Array}
 */
export const getItemIdArrayFromIdPath = (idPath = '') => {

	if (idPath.length === 0) {
		return [];
	} else {
		return trim(idPath, '/')
			.split('/')
			.map(Number);
	}

};

/**
 * Returns the itemId from a path
 * @param idPath
 * @returns {number|null}
 */
export const getItemIdFromIdPath = (idPath = '') => {

	if (idPath.length === 0) {
		return null;
	} else {
		return last(getItemIdArrayFromIdPath(idPath));
	}

};

/**
 * Returns the itemId from a path
 * @param idPath
 * @returns {number|null}
 */
export const getParentItemIdFromIdPath = (idPath = '') => {

	if (idPath.length === 0) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >= 2 ? array[array.length - 2] : 0;
	}

};

/**
 * Get the path to the parent
 * @param idPath
 */
export const getParentIdPath = (idPath = '') => {

	const arrayId = initial(getItemIdArrayFromIdPath(idPath));

	if (arrayId.length === 0) {
		return '';
	} else {
		return `/${arrayId.join('/')}/`;
	}

};

/**
 *
 * @param idPath
 * @returns {number|null}
 */
export const getParentParentItemId = (idPath: string) => {

	if (idPath.length === 0) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >= 3 ? array[array.length - 3] : 0;
	}

};
