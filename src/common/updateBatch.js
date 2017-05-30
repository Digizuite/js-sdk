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

export class UpdateBatch {
	
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
	static get BATCH_TYPE() {
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
	 * @param {String} args.id
	 * @param {String} args.fieldId
	 * @param {String} args.fieldName
	 * @param {String} args.containerType
	 * @param {Array} args.itemIds
	 * @param {Number} args.rowId
	 */
	constructor(args = {}) {
		
		this.fieldId       = args.fieldId || uniqueId('Container');
		this.id            = this.fieldId;
		this.fieldName     = args.fieldName || 'asset';
		this.containerType = args.type;
		this.itemIds       = Array.isArray(args.itemIds) ? args.itemIds : [args.itemIds];
		this.rowId         = args.hasOwnProperty('rowId') ? parseInt(args.rowId, 10) || UpdateBatch.ROW_ID.NonIncremental : UpdateBatch.ROW_ID.NonIncremental;
		
		this.values = [];
		this.xml    = (new DOMParser()).parseFromString('<r></r>', 'text/xml');
	}
	
	/**
	 * Append a value to the batch
	 * @param args
	 */
	appendValue( args = {} ) {
		
		const fieldId = args.fieldId || (`${this.id}Field${this.values.length + 1}`);
		
		this.addToValues({
			FieldId: fieldId,
			Type   : args.valueType,
			Values : Array.isArray(args.value) ? args.value : [args.value]
		});
		
		this.addToXML({
			fieldId   : fieldId,
			fieldName : args.fieldName,
			properties: args.fieldProperties
		});
		
	}
	
	/**
	 *
	 * @param xmlSet
	 */
	addToXML( xmlSet = {} ) {
		
		const containers = this.selectByXPath(this.xml, `//${this.fieldName}[@fieldId="${this.id}"]`);
		let container;
		
		// Create container if it doesn't exist yet
		if (containers.length === 0) {
			container = this.xml.createElement(this.fieldName);
			container.setAttribute('fieldId', this.id);
			this.xml.firstChild.appendChild(container);
			
			// Otherwise select matched container
		} else if (containers.length === 1) {
			container = containers[0];
			
			// If more than one matching element was found, an error has
			// occurred...
		} else {
			throw new Error('BatchUpdateXMLInvalid', `More than one batch was found with id "${this.id}".`);
		}
		
		const field = this.xml.createElement(xmlSet.fieldName);
		field.setAttribute('fieldId', xmlSet.fieldId);
		
		Object.keys(xmlSet.properties || []).forEach((name) => {
			field.setAttribute(name, xmlSet.properties[name]);
		});
	
		container.appendChild(field);
	}
	
	/**
	 * Add to value set
	 * @param valueSet
	 */
	addToValues(valueSet = {}) {
		
		// Search if the value already exists
		const valueIndex = this.values.findIndex((thisValue)=>{
			return thisValue.FieldId === valueSet.FieldId;
		});
		
		if( valueIndex === -1 ) {
			this.values.push(valueSet);
		} else {
			this.values[valueIndex].type = valueSet.type;
			this.values[valueIndex].values = valueSet.values;
		}
		
	}
	
	/**
	 * Select by XPath
	 * @param xml
	 * @param xPath
	 * @returns {Array}
	 */
	selectByXPath(xml, xPath) {
		
		// Evaluate XPath
		const xpe = new XPathEvaluator();
		const nsResolver = xpe.createNSResolver(xml.ownerDocument === null ? xml.documentElement : xml.ownerDocument.documentElement);
		const result = xpe.evaluate(xPath, xml, nsResolver, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
		
		const a = [];
		for (let i = 0; i < result.snapshotLength; i++) {
			a[i] = result.snapshotItem(i);
		}
		
		return a;
	}
	
	/**
	 * Stringify XML
	 * @param xmlDoc
	 * @returns {string}
	 */
	stringifyXML(xmlDoc) {
		
		let result = '';
		const serializer = new XMLSerializer();
		
		for (let i = 0; i < xmlDoc.firstChild.childNodes.length; i++) {
			result += serializer.serializeToString(xmlDoc.firstChild.childNodes[i]);
		}
		
		return result;
	}
	
	/**
	 * XML part of the batch
	 * @returns {string}
	 */
	getBatchXML() {
		return this.stringifyXML(this.xml);
	}
	
	/**
	 * JSON parts of the batch
	 * @returns {{Id: (String), FieldId: (String), FieldName: (String), ContainerType: (String), ItemIds: (Array), RowId: (Number), Values: Array}}
	 */
	getBatchJSON() {
		return {
			Id           : this.id,
			FieldId      : this.fieldId,
			FieldName    : this.fieldName,
			ContainerType: this.containerType,
			ItemIds      : this.itemIds,
			RowId        : this.rowId,
			Values       : this.values
		};
	}
}