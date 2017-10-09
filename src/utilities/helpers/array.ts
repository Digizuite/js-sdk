/**
 * Transforms a value to array
 * @param value
 * @returns []
 */
export function toArray<K>(value: K[] | K): K[] {

	if (Array.isArray(value)) {
		return value;
	}

	return (value || value as any as number === 0) ? [value] : [];
}
