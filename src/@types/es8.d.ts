interface ObjectConstructor {
    values(o: any): any[];

    entries(o: any): [string, any][];
}

interface Array<T> {
    includes(t: T): boolean;
}