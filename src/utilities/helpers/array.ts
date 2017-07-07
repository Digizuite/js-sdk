/**
 * Transforms a value to array
 * @param value
 * @returns []
 */
export const toArray = ( value ) => {
	
	if( Array.isArray(value) ) {
		return value;
	}
	
	return (value || value === 0) ? [value] : [];
};