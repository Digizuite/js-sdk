import {IFilterArgs, IFilterSearchPayload, Filter} from './filter';
import {isValidDate} from "../../utilities/helpers/dateTime";

export interface IFilterDateTimeGeneric {
    from : Date|number;
    to: Date|number;
}

export class DateBetweenFilter extends Filter<IFilterDateTimeGeneric> {

    protected from : Date;
    protected to : Date;


    static get TYPE() {
        return 'datebetween';
    }

    get TYPE() {
        return DateBetweenFilter.TYPE;
    }

    /**
	 * C-tor
	 * @param args
	 */
	constructor(args: IFilterArgs) {
        super(args);
	}

    /**
     * Setter for value
     * @param {IFilterDateTimeGeneric} value
     */
    public setValue( value : IFilterDateTimeGeneric ) {

        if (!value.from && !value.to) {
            throw new Error('Expected DateFilter to have a from or a to parameter!');
        }

        this.from =  value.from instanceof Date ? value.from : new Date(value.from * 1000);
        this.to =  value.to instanceof Date ? value.to : new Date(value.to * 1000);

        if( !isValidDate(this.from) ) {
            throw new Error('Expected DateFilter to a valid from parameter!');
        }

        if( !isValidDate(this.to) ) {
            throw new Error('Expected DateFilter to a valid to parameter!');
        }

        super.setValue(value);
    }

    /**
     * Formats the date to the expected API value
     * @param {Date} date
     * @returns {string}
     */
	protected _toDotNetTime(date: Date): string {
		const dateString = date.toISOString();
		return dateString.substr(0, dateString.length - 1); // We need to get rid of the 'Z' at the end
	}

    /**
     * Returns the search payload
     * @returns {IFilterSearchPayload}
     */
    public getAsSearchPayload(): IFilterSearchPayload {
        return {
            [`${this.parameterName}`]: this._toDotNetTime(this.from),
            [`${this.parameterName}_type_date`]: `${this.parameterName}_end`,
            [`${this.parameterName}_end`]: this._toDotNetTime(this.to),
        };
    }

}
