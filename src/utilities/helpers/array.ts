/**
 * Transforms a value to array
 * @param value
 * @returns []
 */
export function toArray<K>(value: Array<K> | K): Array<K> {
	
	if( Array.isArray(value) ) {
		return value;
	}
	
	return (value || value === 0) ? [value] : [];
}