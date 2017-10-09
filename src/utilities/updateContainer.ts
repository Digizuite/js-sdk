import 'core-js/fn/array/includes';
import 'core-js/fn/object/values';
/**
 * Dear future developer,
 *
 * Do not try to understand what happens here.
 * Do not try to rewrite this.
 * If it works, don't touch it. Don't even open this file.
 *
 * Treat this file like a black-box because below lies madness!
 * You have been warned!
 *
 * /Stefan
 */
import uniqueId from 'lodash-es/uniqueId';
import {toArray} from './helpers/array';

export interface IUpdateContainerAddItemArgs {
	fieldName?: string;
	valueType?: number;
	value?: any;
	fieldId?: string;
	fieldProperties?: object;
}

export interface IUpdateContainerJson {
	Id: any;
	FieldId: any;
	FieldName: string;
	ContainerType: any;
	ItemIds: number[];
	RowId: number;
	Values: Array<{ FieldId: (string | any); Type: (string | number | any); Values: any[] }>;
}

export class UpdateContainer {
	public rowId: number;
	public containerId: any;
	public type: any;
	private containerItems: any[];
	private itemIds: number[];
	private containerFieldName: string;

	/**
	 * C-tor
	 * @param {Object} args
	 * @param {Number} args.type
	 * @param {Number[]} args.itemIds
	 * @param {String} [args.id]
	 * @param {String} [args.fieldName]
	 * @param {Number} [args.rowId]
	 */
	constructor(args: { type?: number, itemIds?: number[], id?: string, fieldName?: string, rowId?: number | string }) {

		if (
			!args.hasOwnProperty('type') ||
			!Object.values(UpdateContainer.CONTAINER_TYPE).includes(args.type!)
		) {
			throw new Error('UpdateContainer expects a known type parameter!');
		}

		if (!args.hasOwnProperty('itemIds') || !Array.isArray(args.itemIds) || args.itemIds.length === 0) {
			throw new Error('UpdateContainer expects an array of itemIds parameter!');
		}

		// Set values
		this.type = args.type;
		this.itemIds = args.itemIds;

		this.containerId = args.id || uniqueId('Container');
		this.containerFieldName = args.fieldName || 'asset';

		// rowId
		const rowId = UpdateContainer.ROW_ID.NonIncremental;

		if (args.hasOwnProperty('rowId')) {
			const parsedRowId = parseInt(args.rowId as any as string, 10);
			if (Number.isNaN(parsedRowId)) {
				throw new Error('UpdateContainer expects a valid rowId!');
			}
		}

		this.rowId = rowId;

		// values
		this.containerItems = [];
	}

	static get ROW_ID() {
		return {
			NonIncremental: 1,
		};
	}

	/**
	 * Batch types
	 */
	static get CONTAINER_TYPE() {
		return {
			Values: 1, // Container with values
			Delete: 2, // Delete container
			ValuesRowid: 3, // Container with rowid values
			DeleteRowid: 4, // Rowid delete container
			ItemIdsValues: 5, // container with itemId values
			ItemIdsDelete: 6, // ItemId delete container
			ItemIdsValuesRowid: 7, // ItemId rowId container
			ItemIdsDeleteRowid: 8, // Delete itemid rowid container
		};
	}

	/**
	 * Value types
	 */
	static get VALUE_TYPE() {
		return {
			String: 1,
			Bool: 2,
			Int: 3,
			DateTime: 4,
			Float: 5,
			IntList: 6,
			Folder: 7,
			AssetType: 8,
			StringRow: 9,
			BoolRow: 10,
			IntRow: 11,
			DateTimeRow: 12,
			FloatRow: 13,
			IntListRow: 14,
			Delete: 15,
			ValueExtraValue: 16,
			StringList: 17,
			StringListRow: 18,
		};
	}

	/**
	 * Append a value to the container
	 * @param {Object}  args
	 * @param {String} args.fieldName
	 * @param {Number} args.valueType
	 * @param {*} args.value
	 * @param {String} [args.fieldId]
	 * @param {Object} [args.fieldProperties]
	 */
	public addItem(args: IUpdateContainerAddItemArgs) {

		if (
			!args.hasOwnProperty('valueType') ||
			!Object.values(UpdateContainer.VALUE_TYPE).includes(args.valueType!)
		) {
			throw new Error('appendValue expects a known value type parameter!');
		}

		if (!args.hasOwnProperty('fieldName')) {
			throw new Error('appendValue expects a fieldName parameter!');
		}

		if (!args.hasOwnProperty('value')) {
			throw new Error('appendValue expects a value parameter!');
		}

		this.containerItems.push({
			fieldId: args.fieldId || (`${this.containerId}Field${this.containerItems.length + 1}`),
			fieldName: args.fieldName,
			fieldProperties: args.fieldProperties || {},
			valueType: args.valueType,
			value: toArray(args.value),
		});

	}

	/**
	 * Create an XML snippet for a given item in container
	 * @param thisItem
	 * @returns {string}
	 * @private
	 */
	public _getItemXml(thisItem: any) {

		// create an array with all the attributes the field will have
		const fieldAttributes = Object.assign(
			{
				fieldId: thisItem.fieldId,
			},
			thisItem.fieldProperties,
		);

		const attributes = Object.keys(fieldAttributes)
			.map((thisKey) => `${thisKey}="${fieldAttributes[thisKey]}"`)
			.join(' ');

		return `<${thisItem.fieldName} ${attributes}/>`;
	}

	/**
	 * Returns the XML part of the UpdateContainer
	 * PS: I am not insane! I am choosing to build the XML using string gymnastics
	 * because XML and DOM APIs are not available natively on nodejs or workers.
	 *
	 * @returns {string}
	 */
	public getContainerXML() {

		// fields
		const items = this.containerItems
			.map(thisItem => this._getItemXml(thisItem))
			.join('');

		// wrap the fields in a container
		return `<${this.containerFieldName} fieldId="${this.containerId}">${items}</${this.containerFieldName}>`;
	}

	/**
	 * JSON parts of the batch
	 */
	public getContainerJSON(): IUpdateContainerJson {
		return {
			Id: this.containerId,
			FieldId: this.containerId,
			FieldName: this.containerFieldName,
			ContainerType: this.type,
			ItemIds: this.itemIds,
			RowId: this.rowId,
			Values: this._getContainerJSONValues(),
		};
	}

	/**
	 * Returns the container values of the JSON
	 * @returns {Array}
	 */
	private _getContainerJSONValues() {
		return this.containerItems.map(thisItem => {
			return {
				FieldId: thisItem.fieldId,
				Type: thisItem.valueType,
				Values: thisItem.value,
			};
		});
	}

}
