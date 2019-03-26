export function getGlobalContext(): any {
	if (typeof self !== 'undefined') {
		return self;
	}

	if (typeof window !== 'undefined') {
		return window;
	}

	if (typeof global !== 'undefined') {
		return global;
	}
}
