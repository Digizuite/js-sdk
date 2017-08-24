interface ObjectConstructor {
    values(o: any): any[];
}

interface Array<T> {
    includes(t: T): boolean;
}