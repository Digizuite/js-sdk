interface ObjectConstructor {
	values(o: any): any[];

	entries(o: any): Array<[string, any]>;
}

interface Array<T> {
	includes(t: T): boolean;
}
