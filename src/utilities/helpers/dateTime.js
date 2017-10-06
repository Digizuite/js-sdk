const dotNetDateRegEx = /\/Date\(([0-9]+)(\+([0-9]+))?\)\//g;

/**
 * Parses a dotnet date to JS DateTime
 * @param str
 */
export function parseDotNetDate (str) {
	
	const dateParts = dotNetDateRegEx.exec(str);
	
	// got an invalid date
	if( !dateParts ) {
		return false;
	}
	
	// Timestamp is captured in the first group
	const date = new Date( parseInt(dateParts[1], 10) );
	
	return (date instanceof Date && isFinite(date)) ? date : false;
}