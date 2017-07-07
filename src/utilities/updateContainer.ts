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
import uniqueId from 'lodash/uniqueId';
import {toArray} from './helpers/array';

export class UpdateContainer {
	
	static get ROW_ID() {
		return {
			NonIncremental : 1
		};
	}
	
	/**
	 * Batch types
	 * @returns {{Values: number, Delete: number, ValuesRowid: number, DeleteRowid: number, ItemIdsValues: number, ItemIdsDelete: number, ItemIdsValuesRowid: number, ItemIdsDeleteRowid: number}}
	 * @constructor
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
			ItemIdsDeleteRowid: 8 // Delete itemid rowid container
		};
	}
	
	/**
	 * Value types
	 * @returns {{String: number, Bool: number, Int: number, DateTime: number, Float: number, IntList: number, Folder: number, AssetType: number, StringRow: number, BoolRow: number, IntRow: number, DateTimeRow: number, FloatRow: number, IntListRow: number, Delete: number, ValueExtraValue: number, StringList: number, StringListRow: number}}
	 * @constructor
	 */
	static get VALUE_TYPE() {
		return {
			String         : 1,
			Bool           : 2,
			Int            : 3,
			DateTime       : 4,
			Float          : 5,
			IntList        : 6,
			Folder         : 7,
			AssetType      : 8,
			StringRow      : 9,
			BoolRow        : 10,
			IntRow         : 11,
			DateTimeRow    : 12,
			FloatRow       : 13,
			IntListRow     : 14,
			Delete         : 15,
			ValueExtraValue: 16,
			StringList     : 17,
			StringListRow  : 18
		};
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {Number} args.type
	 * @param {Number[]} args.itemIds
	 * @param {String} [args.id]
	 * @param {String} [args.fieldName]
	 * @param {Number} [args.rowId]
	 */
	constructor(args = {}) {
		
		if(
			!args.hasOwnProperty('type') ||
			!Object.values(UpdateContainer.CONTAINER_TYPE).includes( args.type )
		) {
			throw new Error('UpdateContainer expects a known type parameter!');
		}
		
		if( !args.hasOwnProperty('itemIds') || !Array.isArray(args.itemIds) || args.itemIds.length === 0) {
			throw new Error('UpdateContainer expects an array of itemIds parameter!');
		}
		
		// Set values
		this.type    = args.type;
		this.itemIds = args.itemIds;
		
		this.containerId        = args.id || uniqueId('Container');
		this.containerFieldName = args.fieldName || 'asset';
		
		// rowId
		let rowId = UpdateContainer.ROW_ID.NonIncremental;
		
		if( args.hasOwnProperty('rowId') ) {
			let parsedRowId = parseInt(args.rowId, 10);
			if( Number.isNaN(parsedRowId) ) {
				throw new Error('UpdateContainer expects a valid rowId!');
			}
		}
		
		this.rowId = rowId;
		
		// values
		this._containerItems = [];
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
	addItem( args = {} ) {
		
		if(
			!args.hasOwnProperty('valueType') ||
			!Object.values(UpdateContainer.VALUE_TYPE).includes( args.valueType )
		) {
			throw new Error('appendValue expects a known value type parameter!');
		}
		
		if( !args.hasOwnProperty('fieldName') ) {
			throw new Error('appendValue expects a fieldName parameter!');
		}
		
		if( !args.hasOwnProperty('value') ) {
			throw new Error('appendValue expects a value parameter!');
		}
		
		this._containerItems.push({
			fieldId        : args.fieldId || (`${this.containerId}Field${this._containerItems.length + 1}`),
			fieldName      : args.fieldName,
			fieldProperties: args.fieldProperties || {},
			valueType      : args.valueType,
			value          : toArray(args.value),
		});
		
	}
	
	/**
	 * Create an XML snippet for a given item in container
	 * @param thisItem
	 * @returns {string}
	 * @private
	 */
	_getItemXml( thisItem ) {
		
		// create an array with all the attributes the field will have
		const fieldAttributes = Object.assign(
			{
				fieldId : thisItem.fieldId
			},
			thisItem.fieldProperties
		);
		
		const attributes = Object.keys(fieldAttributes)
			.map( (thisKey) => `${thisKey}="${fieldAttributes[thisKey]}"` )
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
	getContainerXML() {
		
		// fields
		const items = this._containerItems
			.map( thisItem => this._getItemXml(thisItem) )
			.join('');
		
		// wrap the fields in a container
		return `<${this.containerFieldName} fieldId="${this.containerId}">${items}</${this.containerFieldName}>`;
	}
	
	/**
	 * Returns the container values of the JSON
	 * @returns {Array}
	 * @private
	 */
	_getContainerJSONValues() {
		return this._containerItems.map(thisItem => {
			return {
				FieldId: thisItem.fieldId,
				Type   : thisItem.valueType,
				Values : thisItem.value
			};
		});
	}
	
	/**
	 * JSON parts of the batch
	 * @returns {{Id: (String), FieldId: (String), FieldName: (String), ContainerType: (String), ItemIds: (Array), RowId: (Number), Values: Array}}
	 */
	getContainerJSON() {
		return {
			Id           : this.containerId,
			FieldId      : this.containerId,
			FieldName    : this.containerFieldName,
			ContainerType: this.type,
			ItemIds      : this.itemIds,
			RowId        : this.rowId,
			Values       : this._getContainerJSONValues()
		};
	}
}