import trim from 'lodash/trim';
import last from 'lodash/last';
import initial from 'lodash/initial';

/**
 * Transforms a slug to idPath
 * @param slug
 * @returns {string}
 */
export const unslugIdPath = (slug = '')=> {
	return `/${slug.replace(/-/g, '/')}/`;
};

/**
 * Slugs an idpath
 * @param {string} idPath
 * @returns {string}
 */
export const slugIdPath = (idPath='') => {
	return trim( idPath, '/' ).replace(/\//g, '-');
};

/**
 *
 * @param idPath
 * @returns {Array}
 */
export const getItemIdArrayFromIdPath = ( idPath = '' ) => {
	
	if( idPath.length === 0 ) {
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
 * @returns {number}
 */
export const getItemIdFromIdPath = ( idPath = '' ) => {
	
	if( idPath.length === 0 ) {
		return null;
	} else {
		return last( getItemIdArrayFromIdPath(idPath) );
	}
	
};

/**
 * Returns the itemId from a path
 * @param idPath
 * @returns {number}
 */
export const getParentItemIdFromIdPath = ( idPath = '') => {
	
	if( idPath.length === 0 ) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >=2 ? array[array.length-2] : 0;
	}
	
};

/**
 * Get the path to the parent
 * @param idPath
 */
export const getParentIdPath = ( idPath = '') => {
	
	const array_id = initial( getItemIdArrayFromIdPath( idPath ), 1 );
	
	if( array_id.length === 0 ) {
		return '';
	} else {
		return `/${array_id.join('/')}/`;
	}
	
};

/**
 *
 * @param idPath
 * @returns {number}
 */
export const getParentParentItemId = (idPath) => {
	
	if (idPath.length === 0) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >= 3 ? array[array.length - 3] : 0;
	}
	
};