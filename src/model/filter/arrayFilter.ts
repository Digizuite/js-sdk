import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';

export abstract class ArrayFilter<T> extends Filter<Array<T>> {

    /**
     * C-tor
     * @param args
     */
    constructor(args: IFilterArgs) {
        super(args);
        this.value = this.value || [];
    }

    /**
     * Append options
     * @param {Array<T>} options
     */
    public appendOptions( options : Array<T> ) {
        this.setValue(this.value!.concat(options));
    }

    /**
     * Push a value
     * @param {T} option
     */
    public appendOption( option : T ) {
        this.appendOptions([option]);
    }

    /**
     * Returns the search payload
     * @returns {IFilterSearchPayload}
     */
    public getAsSearchPayload(): IFilterSearchPayload {
        return {
            ...super.getAsSearchPayload(),
            ...this.getMultiTypeForPayload()
        };
    }

    /**
     * Returns multitype
     * @returns {{[p: string]: string}}
     */
    protected abstract getMultiTypeForPayload() : { [key : string] : string };

}
