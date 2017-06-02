(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Digizuite", [], factory);
	else if(typeof exports === 'object')
		exports["Digizuite"] = factory();
	else
		root["Digizuite"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 77);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_requestError__ = __webpack_require__(36);


class BaseRequest {
	
	/**
	 * To be overwritten
	 * @returns {string}
	 */
	get endpointUrl() {
		return this.apiUrl;
	}
	
	/**
	 * To be overwritten
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {};
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {} ) {
		
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = args.apiUrl;
		
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData( payload = {} ) {
		return payload;
	}
	
	/**
	 * Pass-through
	 * @param {Object} response
	 * @returns {Object}
	 */
	processResponseData( response = {} ) {
		return response;
	}
	
	/**
	 * Execute!
	 * @param payload
	 * @returns {Promise}
	 */
	execute( payload = {} ) {
	
		// Merge the payload with the default one and pass it though the pre-process
		const requestData = this.processRequestData(
			Object.assign({}, this.defaultPayload, payload)
		);
		
		const request = new Request(
			this.endpointUrl,
			{
				method : 'POST',
				mode   : 'cors',
				headers: new Headers({
					'Content-Type'     : 'application/x-www-form-urlencoded',
					'X-Clacks-Overhead': 'GNU Terry Pratchett' //A man is not dead while his name is still spoken.
				}),
				body   : this.toQueryString(requestData)
			}
		);
		
		return fetch(request, {credentials: 'include'})
			.then(rawResponse => rawResponse.json())
			.then((response) => {
				
				if (BaseRequest.containsError(response)) {
					throw new __WEBPACK_IMPORTED_MODULE_0_common_requestError__["a" /* RequestError */](
						BaseRequest.getErrorMessage(response),
						BaseRequest.getErrorCode(response)
					);
				}
				
				return this.processResponseData(response);
			});

	}
	
	/**
	 * Determines if a request fails based on the received response
	 * @param response
	 * @returns {boolean}
	 */
	static containsError( response ) {
		return (response.success === 'false' || response.success === false);
	}
	
	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {boolean}
	 */
	static getErrorMessage( response ) {
		return response.error;
	}
	
	/**
	 * Returns the error message from the response
	 * @param response
	 * @returns {Number}
	 */
	static getErrorCode( response ) {
		if( response.hasOwnProperty('warnings') ) {
			return parseInt(response.warnings[0].Code, 10);
		}
		
		return 0;
	}
	
	/**
	 * Yeah....
	 * @param paramsObject
	 * @returns {string}
	 */
	toQueryString( paramsObject = {} ) {
		return Object
			.keys(paramsObject)
			.filter( key => paramsObject[key] !== undefined && paramsObject[key] !== null )
			.map(key => {
				return Array.isArray( paramsObject[key] ) ?
					this.toTraditionalArray(key, paramsObject[key]) :
					`${encodeURIComponent(key)}=${encodeURIComponent(paramsObject[key])}`;
			})
			.join('&');
	}
	
	/**
	 *
	 * @param key
	 * @param array
	 * @returns {string}
	 */
	toTraditionalArray( key, array ) {
		return array.map((thisVal)=>{
			return `${encodeURIComponent(key)}=${encodeURIComponent(thisVal)}`;
		}).join('&');
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BaseRequest;


/***/ }),
/* 1 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MetadataItem {

	/**
	 *
	 * @param args
	 */
	constructor( args = {} ) {
		this.guid = args.guid;
		this.name = args.name;
		this.labelId = args.labelId;
		this.required = !!args.required;
		this.value = args.value;
	}
	
	/**
	 *
	 * @param args
	 * @returns {*}
	 */
	static createFromAPIResponse( args = {} ) {
		const item = new this();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 *
	 * @param args
	 */
	setValueFromAPI( args = {}) {
		this.guid  = args.metafieldid.metafieldItemGuid;
		this.name = args.metafieldid.metafieldName;
		this.labelId = parseInt(args.metafieldLabelId, 10);
		this.required = !!parseInt(args.metafieldid.metafieldIsRequired, 10);
		this.value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid[0].metaValue : '';
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = null;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		this.value = value;
	}
	
	/**
	 * Returns the value of the item
	 * @returns {*}
	 */
	getValue() {
		return this.value;
	}
	
	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	getBatchValue() {
		return this.getValue();
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MetadataItem;


/***/ }),
/* 2 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {} ) {
		
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = args.apiUrl;
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Endpoint;


/***/ }),
/* 3 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class ComboOption {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		
		this.id    = args.id;
		this.value = args.value;
		this._optionvalue = args.optionvalue;
		
	}
	
	/**
	 *
	 * @param args
	 * @returns {ComboOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new ComboOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Sets values from the API response to itself
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		
		this.id    = parseInt(args.item_combo_valueid, 10);
		
		// Yes, this can be in multiple proprieties.
		if( args.hasOwnProperty('combooptionvalue') ) {
			this._optionvalue = args.combooptionvalue;
		} else if( args.hasOwnProperty('optionvalue')  ) {
			this._optionvalue = args.optionvalue;
		}
		
		if( args.hasOwnProperty('metaValue') ) {
			this.value = args.metaValue;
		} else if( args.hasOwnProperty('combovalue')  ) {
			this.value = args.combovalue;
		}
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ComboOption;


/***/ }),
/* 4 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comboOption__ = __webpack_require__(3);



class ComboValueMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 68; }
	static get VALUE_TYPE() { return 3; }
	
	get TYPE() { return ComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return ComboValueMetadataItem.VALUE_TYPE; }
	
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Sets value from API
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		
		super.setValueFromAPI(args);
		
		this.value = Array.isArray(args.item_metafield_valueid) ?
			__WEBPACK_IMPORTED_MODULE_1__comboOption__["a" /* ComboOption */].createFromAPIResponse(args.item_metafield_valueid[0]) :
			null;
		
	}
	
	/**
	 * Sets a value
	 * @param {ComboOption} comboOption
	 */
	setValue(comboOption) {
		
		if( !(comboOption instanceof __WEBPACK_IMPORTED_MODULE_1__comboOption__["a" /* ComboOption */]) ) {
			throw new Error('setValue expects comboOption to be instance of ComboOption.');
		}
		
		super.setValue(comboOption);
	}
	
	getBatchValue() {
		return this.value ? this.value.id : null;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ComboValueMetadataItem;


/***/ }),
/* 5 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);


class StringMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 60; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return StringMetadataItem.TYPE; }
	get VALUE_TYPE() { return StringMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
		this.value = '';
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
	}
	
	/**
	 * Set the value
	 * @param value
	 */
	setValue( value = '' ) {
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		super.setValue(value);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringMetadataItem;


/***/ }),
/* 6 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class MetadataGroup {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.id = args.id;
		this.name = args.name;
		this.sortIndex = args.sortIndex;
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MetadataGroup;


/***/ }),
/* 7 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comboValueMetadataItem__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__comboOption__ = __webpack_require__(3);



class MultiComboValueMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__comboValueMetadataItem__["a" /* ComboValueMetadataItem */] {
	
	static get TYPE() { return 67; }
	static get VALUE_TYPE() { return 6; }
	
	get TYPE() { return MultiComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return MultiComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI(args = {}) {
		
		super.setValueFromAPI(args);
		
		
		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisComboValue) => __WEBPACK_IMPORTED_MODULE_1__comboOption__["a" /* ComboOption */].createFromAPIResponse(thisComboValue));
	}
	
	/**
	 * Append a value to the combo
	 * @param comboOption
	 */
	appendOption( comboOption ) {
		this.appendOptions([comboOption]);
	}
	
	/**
	 * Appends a series of values to the tree
	 * @param comboOptions
	 */
	appendOptions( comboOptions = [] ) {
		this.setValue( this.value.concat( comboOptions ) );
	}
	
	/**
	 * Remove a combo option
	 * @param comboOption
	 */
	removeOption( comboOption ) {
		
		if( !(comboOption instanceof __WEBPACK_IMPORTED_MODULE_1__comboOption__["a" /* ComboOption */]) ) {
			throw new Error('removeOption requires that values of comboOptions be instances of ComboOption');
		}
		
		this.value = this.value.filter( (thisComboOption) => thisComboOption.value !== comboOption.value );
	}
	
	/**
	 * Remove a combo option
	 * @param comboOptions
	 */
	removeOptions( comboOptions ) {
		
		if( !Array.isArray(comboOptions) ) {
			throw new Error('removeOptions expect comboOptions to be an array!');
		}
		
		comboOptions.forEach( (thisComboOption) => { this.removeOption(thisComboOption); });
	}
	
	/**
	 * Set Values
	 * @param comboOptions
	 */
	setValue( comboOptions = [] ) {
		
		if( !Array.isArray(comboOptions) ) {
			throw new Error('setValue expect comboValues to be an array!');
		}
		
		comboOptions.forEach((thisComboOption) => {
			if( !(thisComboOption instanceof __WEBPACK_IMPORTED_MODULE_1__comboOption__["a" /* ComboOption */]) ) {
				throw new Error('setValue requires that values of comboOptions be instances of ComboOption');
			}
		});
		
		this.value = comboOptions;
	}
	
	clearValue() {
		this.value = [];
	}
	
	getBatchValue() {
		return this.value.map( thisComboValue => thisComboValue.id );
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MultiComboValueMetadataItem;


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(16);

/**
 * Converts `value` to a string. An empty string is returned for `null`
 * and `undefined` values. The sign of `-0` is preserved.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.toString(null);
 * // => ''
 *
 * _.toString(-0);
 * // => '-0'
 *
 * _.toString([1, 2, 3]);
 * // => '1,2,3'
 */
function toString(value) {
  return value == null ? '' : baseToString(value);
}

module.exports = toString;


/***/ }),
/* 9 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
const Constants = {
	
	GUID : {
		LAST_MODIFIED : 'BF26CA13-BE60-4B34-8087-C7F8345158F7'
	},
	
	// Filter types
	FILTER_TYPE: {
		STRING       : 'string',
		COMBO        : 'combo',
		MULTICOMBO   : 'multicombo',
		BOOL         : 'bool',
		ASSET_TYPE   : 'assettype',
		DATE_INTERVAL: 'datebetween',
		TREE         : 'tree',
	},
	
	// Sort criteria
	SORT_BY: {
		DATE: 'Date',
		NAME: 'Alphabetic',
	},
	
	// Sort directions
	SORT_DIRECTION: {
		DESCENDING: 'Desc',
		ASCENDING : 'Asc',
	},
	
	DOWNLOAD_QUALITY: {
		ORIGINAL: 1,
		HIGH_RES: 2,
		LOW_RES : 3
	},
	
	// ASSET TYPE
	ASSET_TYPE: {
		VIDEO      : 1,
		AUDIO      : 2,
		IMAGE      : 4,
		POWERPOINT : 5,
		HTML       : 6,
		TEXT       : 7,
		WORD       : 8,
		EXCEL      : 9,
		INDESIGN   : 10,
		ZIP        : 11,
		ARCHIVE    : 15,
		LIVE       : 1000,
		META       : 12,
		PDF        : 14,
		ODF        : 110,
		ODG        : 107,
		ODB        : 109,
		ODM        : 111,
		ODP        : 105,
		ODS        : 102,
		OTH        : 112,
		OTP        : 106,
		ODT        : 100,
		OTG        : 108,
		OTS        : 103,
		OTT        : 101,
		PHOTOSHOP  : 16,
		ILLUSTRATOR: 17
	}
	
};
/* harmony export (immutable) */ __webpack_exports__["a"] = Constants;


/***/ }),
/* 10 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fecha__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_fecha___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_fecha__);



class DateTimeMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 64; }
	static get VALUE_TYPE() { return 4; }
	
	get TYPE() { return DateTimeMetadataItem.TYPE; }
	get VALUE_TYPE() { return DateTimeMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 * Set the value
	 * @param value
	 */
	setValue( value ) {
		
		if( !(value instanceof Date) ) {
			throw new Error('Parameter value needs to be of type Date');
		}
		
		super.setValue(value);
	}
	
	/**
	 * Sets value from a string
	 * @param value
	 * @param format
	 */
	setValueFromString( value = '', format = 'DD-MM-YYYY HH:mm:ss' ) {
		
		if( typeof value !== 'string' ) {
			throw new Error('Parameter value needs to be of type string');
		}
		
		this.setValue( __WEBPACK_IMPORTED_MODULE_1_fecha___default.a.parse(value, format) );
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? __WEBPACK_IMPORTED_MODULE_1_fecha___default.a.parse(this.value, 'DD-MM-YYYY HH:mm:ss') : null;
	}
	
	/**
	 * Returns the value of the item
	 * @returns {string|null}
	 */
	getBatchValue() {
		const format = 'YYYY-MM-DDTHH:mm:ss.SSS';
		return this.value ? __WEBPACK_IMPORTED_MODULE_1_fecha___default.a.format(this.value, format): null;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DateTimeMetadataItem;


/***/ }),
/* 11 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__comboValueMetadataItem__ = __webpack_require__(4);


class EditComboValueMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__comboValueMetadataItem__["a" /* ComboValueMetadataItem */] {
	
	static get TYPE() { return 69; }
	static get VALUE_TYPE() { return 1; }
	
	get TYPE() { return EditComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return EditComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	getBatchValue() {
		return this.value ? this.value.value : null;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EditComboValueMetadataItem;


/***/ }),
/* 12 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__multiComboValueMetadataItem__ = __webpack_require__(7);


class EditMultiComboValueMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__multiComboValueMetadataItem__["a" /* MultiComboValueMetadataItem */] {
	
	static get TYPE() { return 169; }
	static get VALUE_TYPE() { return 17; }
	
	get TYPE() { return EditMultiComboValueMetadataItem.TYPE; }
	get VALUE_TYPE() { return EditMultiComboValueMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	getBatchValue() {
		return this.value.map( thisComboValue => thisComboValue.value );
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = EditMultiComboValueMetadataItem;


/***/ }),
/* 13 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__ = __webpack_require__(14);



class TreeMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 300; }
	static get VALUE_TYPE() { return 6; }
	
	get TYPE() { return TreeMetadataItem.TYPE; }
	get VALUE_TYPE() { return TreeMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 * Set values from the API
	 * @param args
	 */
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		
		const value = Array.isArray(args.item_metafield_valueid) ? args.item_metafield_valueid : [];
		this.value = value.map((thisTreeOption) => __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__["a" /* TreeOption */].createFromAPIResponse(thisTreeOption));
	}
	
	/**
	 * Append a value to the tree
	 * @param treeOption
	 */
	appendOption( treeOption ) {
		this.appendOptions([treeOption]);
	}
	
	/**
	 * Appends a series of values to the tree
	 * @param treeOptions
	 */
	appendOptions( treeOptions = [] ) {
		
		const newValues = [];

		// Verify that the option is not already in the value
		treeOptions.forEach( (thisOption) => {
			
			const index = this.value.findIndex( (thisExistingOption)=> thisExistingOption.id === thisOption.id);
			
			if( index === -1 ) {
				newValues.push(thisOption);
			}
		});
		
		if( newValues.length ) {
			this.setValue(this.value.concat(newValues));
		}
	}
	
	/**
	 * Set Values
	 * @param treeOptions
	 */
	setValue( treeOptions = [] ) {
		
		if( !Array.isArray(treeOptions) ) {
			throw new Error('setValue expect treeOptions to be an array!');
		}
		
		treeOptions.forEach((thisTreeOption) => {
			if( !(thisTreeOption instanceof __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__["a" /* TreeOption */]) ) {
				throw new Error('setValue requires that values of treeOptions be instances of TreeOption');
			}
		});
		
		this.value = treeOptions;
	}
	
	/**
	 * Remove a combo option
	 * @param treeOption
	 */
	removeOption( treeOption ) {
		
		if( !(treeOption instanceof __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__["a" /* TreeOption */]) ) {
			throw new Error('removeOption requires that values of treeOption be instances of TreeOption');
		}
		
		this.value = this.value.filter( (thisTreeOption) => thisTreeOption.id !== treeOption.id );
	}
	
	/**
	 * Remove a combo option
	 * @param treeOptions
	 */
	removeOptions( treeOptions ) {
		
		if( !Array.isArray(treeOptions) ) {
			throw new Error('removeOptions expect treeOptions to be an array!');
		}
		
		treeOptions.forEach( (thisTreeOption) => { this.removeOption(thisTreeOption); });
	}
	
	/**
	 * Clear value
	 */
	clearValue() {
		this.value = [];
	}
	
	/**
	 * Get batch value
	 * @returns {Array}
	 */
	getBatchValue() {
		return this.value.map( thisTreeOption => thisTreeOption.id );
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TreeMetadataItem;


/***/ }),
/* 14 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class TreeOption {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this.id = args.id;
		this.value = args.value;
		this.path = args.path;
		this.hasChildren = !!args.hasChildren;
	}
	
	/**
	 *
	 * @param args
	 * @returns {TreeOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new TreeOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Motto of the day: consistency is overrated
	 * @param args
	 */
	setValueFromAPI(args = {}) {
	
		if( args.hasOwnProperty('item_tree_valueid') ) {
			this.id = parseInt(args.item_tree_valueid, 10);
		} else if( args.hasOwnProperty('id') ) {
			this.id = parseInt(args.id, 10);
		}
		
		// IdPath
		if( args.hasOwnProperty('idpath') ) {
			this.path = args.idpath;
		} else if( args.hasOwnProperty('idPath') ) {
			this.path = args.idPath;
		}
		
		// Value
		if( args.hasOwnProperty('metaValue') ) {
			this.value = args.metaValue;
		} else if( args.hasOwnProperty('text') ) {
			this.value = args.text;
		}
		
		this.hasChildren = parseInt(args.Children, 10) > 0;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TreeOption;


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

var root = __webpack_require__(55);

/** Built-in value references. */
var Symbol = root.Symbol;

module.exports = Symbol;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(15),
    arrayMap = __webpack_require__(43),
    isArray = __webpack_require__(60),
    isSymbol = __webpack_require__(35);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0;

/** Used to convert symbols to primitives and strings. */
var symbolProto = Symbol ? Symbol.prototype : undefined,
    symbolToString = symbolProto ? symbolProto.toString : undefined;

/**
 * The base implementation of `_.toString` which doesn't convert nullish
 * values to empty strings.
 *
 * @private
 * @param {*} value The value to process.
 * @returns {string} Returns the string.
 */
function baseToString(value) {
  // Exit early for strings to avoid a performance hit in some environments.
  if (typeof value == 'string') {
    return value;
  }
  if (isArray(value)) {
    // Recursively convert values (susceptible to call stack limits).
    return arrayMap(value, baseToString) + '';
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : '';
  }
  var result = (value + '');
  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
}

module.exports = baseToString;


/***/ }),
/* 17 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Filter {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		
		if(!args.id) {
			throw new Error('Expecting Filter to have id as parameter!');
		}
		
		this.id = args.id;
	}
	
	/**
	 * Generic method. Shall be overwritten
	 * @returns {{}}
	 */
	getAsSearchPayload() {
		return {};
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Filter;


/***/ }),
/* 18 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_trim__ = __webpack_require__(66);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_trim___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_trim__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_last__ = __webpack_require__(62);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_lodash_last___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_lodash_last__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_initial__ = __webpack_require__(59);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_initial___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_initial__);




/**
 * Transforms a slug to idPath
 * @param slug
 * @returns {string}
 */
const unslugIdPath = (slug = '')=> {
	return `/${slug.replace(/-/g, '/')}/`;
};
/* unused harmony export unslugIdPath */


/**
 * Slugs an idpath
 * @param {string} idPath
 * @returns {string}
 */
const slugIdPath = (idPath='') => {
	return __WEBPACK_IMPORTED_MODULE_0_lodash_trim___default()( idPath, '/' ).replace(/\//g, '-');
};
/* unused harmony export slugIdPath */


/**
 *
 * @param idPath
 * @returns {Array}
 */
const getItemIdArrayFromIdPath = ( idPath = '' ) => {
	
	if( idPath.length === 0 ) {
		return [];
	} else {
		return __WEBPACK_IMPORTED_MODULE_0_lodash_trim___default()(idPath, '/')
			.split('/')
			.map(Number);
	}
	
};
/* unused harmony export getItemIdArrayFromIdPath */


/**
 * Returns the itemId from a path
 * @param idPath
 * @returns {number|null}
 */
const getItemIdFromIdPath = ( idPath = '' ) => {
	
	if( idPath.length === 0 ) {
		return null;
	} else {
		return __WEBPACK_IMPORTED_MODULE_1_lodash_last___default()( getItemIdArrayFromIdPath(idPath) );
	}
	
};
/* harmony export (immutable) */ __webpack_exports__["a"] = getItemIdFromIdPath;


/**
 * Returns the itemId from a path
 * @param idPath
 * @returns {number|null}
 */
const getParentItemIdFromIdPath = ( idPath = '') => {
	
	if( idPath.length === 0 ) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >=2 ? array[array.length-2] : 0;
	}
	
};
/* unused harmony export getParentItemIdFromIdPath */


/**
 * Get the path to the parent
 * @param idPath
 */
const getParentIdPath = ( idPath = '') => {
	
	const array_id = __WEBPACK_IMPORTED_MODULE_2_lodash_initial___default()( getItemIdArrayFromIdPath( idPath ), 1 );
	
	if( array_id.length === 0 ) {
		return '';
	} else {
		return `/${array_id.join('/')}/`;
	}
	
};
/* unused harmony export getParentIdPath */


/**
 *
 * @param idPath
 * @returns {number|null}
 */
const getParentParentItemId = (idPath) => {
	
	if (idPath.length === 0) {
		return null;
	} else {
		const array = getItemIdArrayFromIdPath(idPath);
		return array.length >= 3 ? array[array.length - 3] : 0;
	}
	
};
/* unused harmony export getParentParentItemId */


/***/ }),
/* 19 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);


class BitMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 61; }
	static get VALUE_TYPE() { return 2; }
	
	get TYPE() { return BitMetadataItem.TYPE; }
	get VALUE_TYPE() { return BitMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = !!parseInt(this.value, 10);
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = false;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( typeof value !== 'boolean' ) {
			throw new Error('Parameter value needs to be of type boolean');
		}
		
		this.value = value;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BitMetadataItem;


/***/ }),
/* 20 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);


class FloatMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 82; }
	static get VALUE_TYPE() { return 5; }
	
	get TYPE() { return FloatMetadataItem.TYPE; }
	get VALUE_TYPE() { return FloatMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseFloat(this.value) : null;
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = 0;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( typeof value !== 'number' || Number.isNaN(value)) {
			throw new Error('Parameter value needs to be of type number');
		}
		
		super.setValue(value);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = FloatMetadataItem;


/***/ }),
/* 21 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);


class IntMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 51; }
	static get VALUE_TYPE() { return 3; }
	
	get TYPE() { return IntMetadataItem.TYPE; }
	get VALUE_TYPE() { return IntMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = this.value ? parseInt(this.value, 10) : null;
	}
	
	/**
	 * Clears a value
	 */
	clearValue() {
		this.value = 0;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( !Number.isInteger(value) ) {
			throw new Error('Parameter value needs to be of type number');
		}
		
		super.setValue(value);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IntMetadataItem;


/***/ }),
/* 22 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataGroup__ = __webpack_require__(6);


class IterativeMetadataGroup extends __WEBPACK_IMPORTED_MODULE_0__metadataGroup__["a" /* MetadataGroup */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		super(args);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IterativeMetadataGroup;


/***/ }),
/* 23 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataGroup__ = __webpack_require__(6);


class LanguageMetadataGroup extends __WEBPACK_IMPORTED_MODULE_0__metadataGroup__["a" /* MetadataGroup */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		super(args);
		
		this.languageId = args.languageId;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LanguageMetadataGroup;


/***/ }),
/* 24 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__ = __webpack_require__(5);


class LinkMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__["a" /* StringMetadataItem */] {
	
	static get TYPE() { return 350; }
	
	get TYPE() { return LinkMetadataItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 *
	 * @param value
	 */
	setValue( value = '' ) {
		// If you feel masochistic, you are more than welcome to validate
		// and check if it is a real link. Good luck, you are on your own with that.
		super.setValue(value);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = LinkMetadataItem;


/***/ }),
/* 25 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__ = __webpack_require__(5);


class MoneyMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__["a" /* StringMetadataItem */] {

	constructor( args = {} ) {
		super(args);
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MoneyMetadataItem;


/***/ }),
/* 26 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__ = __webpack_require__(5);


class NoteMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__stringMetadataItem__["a" /* StringMetadataItem */] {
	
	static get TYPE() { return 70; }
	
	get TYPE() { return NoteMetadataItem.TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	setValueFromAPI( args = {}) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.note) ? args.note[0].note : '';
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = NoteMetadataItem;


/***/ }),
/* 27 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class UniqueOption {
	
	get unique() {
		return this._unique;
	}
	
	
	get version() {
		return this._version;
	}
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
		
		this._unique = args.unique;
		this._version = args.version;
		
	}
	
	/**
	 *
	 * @param args
	 * @returns {UniqueOption}
	 */
	static createFromAPIResponse(args = {}) {
		const item = new UniqueOption();
		item.setValueFromAPI(args);
		return item;
	}
	
	/**
	 * Set values from API
	 * @param args
	 */
	setValueFromAPI(args = {}) {
		this._unique = args.metaValue;
		this._version = args.extraValue;
		
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UniqueOption;


/***/ }),
/* 28 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__metadataItem__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__uniqueOption__ = __webpack_require__(27);



class UniqueVersionMetadataItem extends __WEBPACK_IMPORTED_MODULE_0__metadataItem__["a" /* MetadataItem */] {
	
	static get TYPE() { return 200; }
	static get VALUE_TYPE() { return 16; }
	
	get TYPE() { return UniqueVersionMetadataItem.TYPE; }
	get VALUE_TYPE() { return UniqueVersionMetadataItem.VALUE_TYPE; }
	
	constructor( args = {} ) {
		super(args);
	}
	
	/**
	 * Set value from API response
	 * @param args
	 */
	setValueFromAPI( args = {} ) {
		super.setValueFromAPI(args);
		this.value = Array.isArray(args.item_metafield_valueid) ? __WEBPACK_IMPORTED_MODULE_1__uniqueOption__["a" /* UniqueOption */].createFromAPIResponse(args.item_metafield_valueid[0]) : null;
	}
	
	/**
	 * Sets a value
	 * @param value
	 */
	setValue(value) {
		
		if( !(value instanceof __WEBPACK_IMPORTED_MODULE_1__uniqueOption__["a" /* UniqueOption */]) ) {
			throw new Error('Parameter value needs to be of instance UniqueOption');
		}
		
		super.setValue(value);
	}
	
	/**
	 * Returns the batch value of the item
	 * @returns {*}
	 */
	getBatchValue() {
		return this.value ? [ this.value.unique, this.value.version ] : [];
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = UniqueVersionMetadataItem;


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

var baseFindIndex = __webpack_require__(46),
    baseIsNaN = __webpack_require__(48),
    strictIndexOf = __webpack_require__(56);

/**
 * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseIndexOf(array, value, fromIndex) {
  return value === value
    ? strictIndexOf(array, value, fromIndex)
    : baseFindIndex(array, baseIsNaN, fromIndex);
}

module.exports = baseIndexOf;


/***/ }),
/* 30 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30);

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;


/***/ }),
/* 32 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsZWJ = '\\u200d';

/** Used to detect strings with [zero-width joiners or code points from the astral planes](http://eev.ee/blog/2015/09/12/dark-corners-of-unicode/). */
var reHasUnicode = RegExp('[' + rsZWJ + rsAstralRange  + rsComboRange + rsVarRange + ']');

/**
 * Checks if `string` contains Unicode symbols.
 *
 * @private
 * @param {string} string The string to inspect.
 * @returns {boolean} Returns `true` if a symbol is found, else `false`.
 */
function hasUnicode(string) {
  return reHasUnicode.test(string);
}

module.exports = hasUnicode;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

var asciiToArray = __webpack_require__(44),
    hasUnicode = __webpack_require__(32),
    unicodeToArray = __webpack_require__(57);

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;


/***/ }),
/* 34 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return value != null && (type == 'object' || type == 'function');
}

module.exports = isObject;


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

var baseGetTag = __webpack_require__(47),
    isObjectLike = __webpack_require__(61);

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && baseGetTag(value) == symbolTag);
}

module.exports = isSymbol;


/***/ }),
/* 36 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class RequestError extends Error {
	
	/**
	 * Error c-tor
	 * @param message
	 * @param code
	 */
	constructor( message = '' , code = 0 ) {
		super();
		this.message = message;
		this.code = code;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = RequestError;


/***/ }),
/* 37 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_endpoint_auth__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_endpoint_config__ = __webpack_require__(72);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_endpoint_content__ = __webpack_require__(73);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_endpoint_download__ = __webpack_require__(74);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_endpoint_upload__ = __webpack_require__(76);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_endpoint_metadata__ = __webpack_require__(75);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_utilities_helpers_url__ = __webpack_require__(99);








class Connector {
	
	/**
	 * Getter for the auth endpoint
	 * @returns {Auth}
	 */
	get auth() {
		
		if( !this._authEndpoint ) {
			this._authEndpoint = new __WEBPACK_IMPORTED_MODULE_0_endpoint_auth__["a" /* Auth */]( {
				apiUrl : this.apiUrl
			} );
		}
		
		return this._authEndpoint;
	}
	
	/**
	 * Getter for the config endpoint
	 * @returns {Config}
	 */
	get config() {
		
		if( !this._configEndpoint ) {
			this._configEndpoint = new __WEBPACK_IMPORTED_MODULE_1_endpoint_config__["a" /* Config */]( {
				apiUrl : this.apiUrl
			} );
		}
		
		return this._configEndpoint;
	}
	
	/**
	 * Getter for the content endpoint
	 * @returns {Content}
	 */
	get content() {
		
		if (!this._contentEndpoint) {
			this._contentEndpoint = new __WEBPACK_IMPORTED_MODULE_2_endpoint_content__["a" /* Content */]({
				apiUrl          : this.apiUrl,
				metafieldLabelId: this.state.config.PortalMenu.metafieldLabelId,
				sLayoutFolderId : this.state.config.MainSearchFolderId,
				labels          : this.state.labels,
				sortTypes       : this.state.config.SortTypes,
				defaultSortType : this.state.config.SortType
			});
		}
		
		return this._contentEndpoint;
	}
	
	/**
	 * Getter for the download endpoint
	 * @returns {Download}
	 */
	get download() {
		
		if( !this._downloadEndpoint ) {
			this._downloadEndpoint = new __WEBPACK_IMPORTED_MODULE_3_endpoint_download__["a" /* Download */]( {
				apiUrl : this.apiUrl,
				memberId : this.state.user.memberId,
				accessKey : this.state.user.accessKey,
				//TODO: un-hard-code this when we get a product
				lowResMediaFormatIds : [50038,50036],
				highResMediaFormatIds : [50040, 50033],
				mediaUrl : 'https://mm-dam.dev.digizuite.com/'
			} );
		}
		
		return this._downloadEndpoint;
	}
	
	/**
	 * Getter for the upload endpoint
	 * @returns {Upload}
	 */
	get upload() {
		
		if( !this._uploadEndpoint ) {
			this._uploadEndpoint = new __WEBPACK_IMPORTED_MODULE_4_endpoint_upload__["a" /* Upload */]( {
				apiUrl : this.apiUrl,
				computerName : this.state.config.UploadName
			} );
		}
		
		return this._uploadEndpoint;
	}
	
	/**
	 * Getter for the upload endpoint
	 * @returns {Metadata}
	 */
	get metadata() {
		if( !this._metadataEndpoint ) {
			this._metadataEndpoint = new __WEBPACK_IMPORTED_MODULE_5_endpoint_metadata__["a" /* Metadata */]( {
				apiUrl : this.apiUrl,
				language : this.state.user.languageId,
				languages : this.state.config.languages
			} );
		}
		
		return this._metadataEndpoint;
	}
	
	//noinspection JSUnusedGlobalSymbols
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor( args = {} ) {
		
		if( typeof args.apiUrl !== 'string' || args.apiUrl.length === 0 ) {
			throw new Error( 'apiUrl is a required parameter' );
		}
		
		this.apiUrl = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_6_utilities_helpers_url__["a" /* ensureTrailingSeparator */])(args.apiUrl);
		this.keepAliveInterval = args.keepAliveInterval || 60000;
		
		this.state = {
			user : {},
			config : {}
		};
	}
	
	/**
	 * Initialize the connector
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise}.<Connector> - a promise that will be resolved once the
	 */
	static getConnectorInstance( args = {} ) {
		
		const digizuiteInstance = new Connector( args );
		return digizuiteInstance.initializeConnector( {
			username  : args.username,
			password  : args.password
		} );
		
	}
	
	/**
	 * Initializes a connector instance. Logs in and fetches the configs
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @returns {Promise.<Connector>}
	 */
	initializeConnector( args = {} ) {
		
		if( typeof args.username !== 'string' || args.username.length === 0 ) {
			return Promise.reject( new Error( 'username is a required parameter' ) );
		}
		
		if( typeof args.password !== 'string' || args.password.length === 0 ) {
			return Promise.reject( new Error( 'password is a required parameter' ) );
		}
		
		return this.auth.login({
			username : args.username,
			password : args.password
		}).then((loginResponse)=>{
			this.state.user = loginResponse;
			this._initKeepAlive({
				username : args.username,
				password : args.password
			});
		}).then(()=>{
			return Promise.all([
				this.config.getAppConfiguration(),
				this.config.getAppLabels()
			]);
		}).then(([configResponse, labelsResponse])=> {
			this.state.config = configResponse;
			this.state.labels = labelsResponse;
			return this;
		});
		
	}
	
	/**
	 * Initialize keep alive connection logic
	 * @param {Object} args
	 * @param {String} args.username - username to authenticate with.
	 * @param {String} args.password - password.
	 * @private
	 */
	_initKeepAlive( args = {} ) {
		
		this.state.keepAliveInterval = setInterval(()=>{
			
			this.auth.keepAlive()
				.then((response)=>{
					if( !response.isLoggedIn ) {
						this.auth.login({
							username : args.username,
							password : args.password
						});
					}
				})
				.catch(()=>{
					this.auth.login({
						username : args.username,
						password : args.password
					});
				});
			
		}, this.keepAliveInterval);
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Connector;


/***/ }),
/* 38 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__dateFilter__ = __webpack_require__(80);


class AssetCreatedFilter extends __WEBPACK_IMPORTED_MODULE_0__dateFilter__["a" /* DateFilter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id  : 'sDateBetween',
			from: args.from ? args.from : 0,
			to  : args.to ? args.to : Math.floor( Date.now() / 1000)
		});
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AssetCreatedFilter;


/***/ }),
/* 39 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__stringFilter__ = __webpack_require__(81);


class AssetNameFilter extends __WEBPACK_IMPORTED_MODULE_0__stringFilter__["a" /* StringFilter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id : 'freetext',
			value : args.name
		});
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = AssetNameFilter;


/***/ }),
/* 40 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__arrayFilter__ = __webpack_require__(79);


class AssetTypeFilter extends __WEBPACK_IMPORTED_MODULE_0__arrayFilter__["a" /* ArrayFilter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super({
			id  : 'sAssetType',
			values : args.types
		});
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AssetTypeFilter;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*
 * JavaScript MD5
 * https://github.com/blueimp/JavaScript-MD5
 *
 * Copyright 2011, Sebastian Tschan
 * https://blueimp.net
 *
 * Licensed under the MIT license:
 * https://opensource.org/licenses/MIT
 *
 * Based on
 * A JavaScript implementation of the RSA Data Security, Inc. MD5 Message
 * Digest Algorithm, as defined in RFC 1321.
 * Version 2.2 Copyright (C) Paul Johnston 1999 - 2009
 * Other contributors: Greg Holt, Andrew Kepert, Ydnar, Lostinet
 * Distributed under the BSD License
 * See http://pajhome.org.uk/crypt/md5 for more info.
 */

/* global define */

;(function ($) {
  'use strict'

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
  function safeAdd (x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF)
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
    return (msw << 16) | (lsw & 0xFFFF)
  }

  /*
  * Bitwise rotate a 32-bit number to the left.
  */
  function bitRotateLeft (num, cnt) {
    return (num << cnt) | (num >>> (32 - cnt))
  }

  /*
  * These functions implement the four basic operations the algorithm uses.
  */
  function md5cmn (q, a, b, x, s, t) {
    return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
  }
  function md5ff (a, b, c, d, x, s, t) {
    return md5cmn((b & c) | ((~b) & d), a, b, x, s, t)
  }
  function md5gg (a, b, c, d, x, s, t) {
    return md5cmn((b & d) | (c & (~d)), a, b, x, s, t)
  }
  function md5hh (a, b, c, d, x, s, t) {
    return md5cmn(b ^ c ^ d, a, b, x, s, t)
  }
  function md5ii (a, b, c, d, x, s, t) {
    return md5cmn(c ^ (b | (~d)), a, b, x, s, t)
  }

  /*
  * Calculate the MD5 of an array of little-endian words, and a bit length.
  */
  function binlMD5 (x, len) {
    /* append padding */
    x[len >> 5] |= 0x80 << (len % 32)
    x[(((len + 64) >>> 9) << 4) + 14] = len

    var i
    var olda
    var oldb
    var oldc
    var oldd
    var a = 1732584193
    var b = -271733879
    var c = -1732584194
    var d = 271733878

    for (i = 0; i < x.length; i += 16) {
      olda = a
      oldb = b
      oldc = c
      oldd = d

      a = md5ff(a, b, c, d, x[i], 7, -680876936)
      d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
      c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
      b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
      a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
      d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
      c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
      b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
      a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
      d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
      c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
      b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
      a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
      d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
      c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
      b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

      a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
      d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
      c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
      b = md5gg(b, c, d, a, x[i], 20, -373897302)
      a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
      d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
      c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
      b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
      a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
      d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
      c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
      b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
      a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
      d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
      c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
      b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

      a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
      d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
      c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
      b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
      a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
      d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
      c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
      b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
      a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
      d = md5hh(d, a, b, c, x[i], 11, -358537222)
      c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
      b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
      a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
      d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
      c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
      b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

      a = md5ii(a, b, c, d, x[i], 6, -198630844)
      d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
      c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
      b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
      a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
      d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
      c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
      b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
      a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
      d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
      c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
      b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
      a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
      d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
      c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
      b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

      a = safeAdd(a, olda)
      b = safeAdd(b, oldb)
      c = safeAdd(c, oldc)
      d = safeAdd(d, oldd)
    }
    return [a, b, c, d]
  }

  /*
  * Convert an array of little-endian words to a string
  */
  function binl2rstr (input) {
    var i
    var output = ''
    var length32 = input.length * 32
    for (i = 0; i < length32; i += 8) {
      output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
    }
    return output
  }

  /*
  * Convert a raw string to an array of little-endian words
  * Characters >255 have their high-byte silently ignored.
  */
  function rstr2binl (input) {
    var i
    var output = []
    output[(input.length >> 2) - 1] = undefined
    for (i = 0; i < output.length; i += 1) {
      output[i] = 0
    }
    var length8 = input.length * 8
    for (i = 0; i < length8; i += 8) {
      output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
    }
    return output
  }

  /*
  * Calculate the MD5 of a raw string
  */
  function rstrMD5 (s) {
    return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
  }

  /*
  * Calculate the HMAC-MD5, of a key and some data (raw strings)
  */
  function rstrHMACMD5 (key, data) {
    var i
    var bkey = rstr2binl(key)
    var ipad = []
    var opad = []
    var hash
    ipad[15] = opad[15] = undefined
    if (bkey.length > 16) {
      bkey = binlMD5(bkey, key.length * 8)
    }
    for (i = 0; i < 16; i += 1) {
      ipad[i] = bkey[i] ^ 0x36363636
      opad[i] = bkey[i] ^ 0x5C5C5C5C
    }
    hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
    return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
  }

  /*
  * Convert a raw string to a hex string
  */
  function rstr2hex (input) {
    var hexTab = '0123456789abcdef'
    var output = ''
    var x
    var i
    for (i = 0; i < input.length; i += 1) {
      x = input.charCodeAt(i)
      output += hexTab.charAt((x >>> 4) & 0x0F) +
      hexTab.charAt(x & 0x0F)
    }
    return output
  }

  /*
  * Encode a string as utf-8
  */
  function str2rstrUTF8 (input) {
    return unescape(encodeURIComponent(input))
  }

  /*
  * Take string arguments and return either raw or hex encoded strings
  */
  function rawMD5 (s) {
    return rstrMD5(str2rstrUTF8(s))
  }
  function hexMD5 (s) {
    return rstr2hex(rawMD5(s))
  }
  function rawHMACMD5 (k, d) {
    return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
  }
  function hexHMACMD5 (k, d) {
    return rstr2hex(rawHMACMD5(k, d))
  }

  function md5 (string, key, raw) {
    if (!key) {
      if (!raw) {
        return hexMD5(string)
      }
      return rawMD5(string)
    }
    if (!raw) {
      return hexHMACMD5(key, string)
    }
    return rawHMACMD5(key, string)
  }

  if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return md5
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))
  } else if (typeof module === 'object' && module.exports) {
    module.exports = md5
  } else {
    $.md5 = md5
  }
}(this))


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;(function (main) {
  'use strict';

  /**
   * Parse or format dates
   * @class fecha
   */
  var fecha = {};
  var token = /d{1,4}|M{1,4}|YY(?:YY)?|S{1,3}|Do|ZZ|([HhMsDm])\1?|[aA]|"[^"]*"|'[^']*'/g;
  var twoDigits = /\d\d?/;
  var threeDigits = /\d{3}/;
  var fourDigits = /\d{4}/;
  var word = /[0-9]*['a-z\u00A0-\u05FF\u0700-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+|[\u0600-\u06FF\/]+(\s*?[\u0600-\u06FF]+){1,2}/i;
  var literal = /\[([^]*?)\]/gm;
  var noop = function () {
  };

  function shorten(arr, sLen) {
    var newArr = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      newArr.push(arr[i].substr(0, sLen));
    }
    return newArr;
  }

  function monthUpdate(arrName) {
    return function (d, v, i18n) {
      var index = i18n[arrName].indexOf(v.charAt(0).toUpperCase() + v.substr(1).toLowerCase());
      if (~index) {
        d.month = index;
      }
    };
  }

  function pad(val, len) {
    val = String(val);
    len = len || 2;
    while (val.length < len) {
      val = '0' + val;
    }
    return val;
  }

  var dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  var monthNamesShort = shorten(monthNames, 3);
  var dayNamesShort = shorten(dayNames, 3);
  fecha.i18n = {
    dayNamesShort: dayNamesShort,
    dayNames: dayNames,
    monthNamesShort: monthNamesShort,
    monthNames: monthNames,
    amPm: ['am', 'pm'],
    DoFn: function DoFn(D) {
      return D + ['th', 'st', 'nd', 'rd'][D % 10 > 3 ? 0 : (D - D % 10 !== 10) * D % 10];
    }
  };

  var formatFlags = {
    D: function(dateObj) {
      return dateObj.getDate();
    },
    DD: function(dateObj) {
      return pad(dateObj.getDate());
    },
    Do: function(dateObj, i18n) {
      return i18n.DoFn(dateObj.getDate());
    },
    d: function(dateObj) {
      return dateObj.getDay();
    },
    dd: function(dateObj) {
      return pad(dateObj.getDay());
    },
    ddd: function(dateObj, i18n) {
      return i18n.dayNamesShort[dateObj.getDay()];
    },
    dddd: function(dateObj, i18n) {
      return i18n.dayNames[dateObj.getDay()];
    },
    M: function(dateObj) {
      return dateObj.getMonth() + 1;
    },
    MM: function(dateObj) {
      return pad(dateObj.getMonth() + 1);
    },
    MMM: function(dateObj, i18n) {
      return i18n.monthNamesShort[dateObj.getMonth()];
    },
    MMMM: function(dateObj, i18n) {
      return i18n.monthNames[dateObj.getMonth()];
    },
    YY: function(dateObj) {
      return String(dateObj.getFullYear()).substr(2);
    },
    YYYY: function(dateObj) {
      return dateObj.getFullYear();
    },
    h: function(dateObj) {
      return dateObj.getHours() % 12 || 12;
    },
    hh: function(dateObj) {
      return pad(dateObj.getHours() % 12 || 12);
    },
    H: function(dateObj) {
      return dateObj.getHours();
    },
    HH: function(dateObj) {
      return pad(dateObj.getHours());
    },
    m: function(dateObj) {
      return dateObj.getMinutes();
    },
    mm: function(dateObj) {
      return pad(dateObj.getMinutes());
    },
    s: function(dateObj) {
      return dateObj.getSeconds();
    },
    ss: function(dateObj) {
      return pad(dateObj.getSeconds());
    },
    S: function(dateObj) {
      return Math.round(dateObj.getMilliseconds() / 100);
    },
    SS: function(dateObj) {
      return pad(Math.round(dateObj.getMilliseconds() / 10), 2);
    },
    SSS: function(dateObj) {
      return pad(dateObj.getMilliseconds(), 3);
    },
    a: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0] : i18n.amPm[1];
    },
    A: function(dateObj, i18n) {
      return dateObj.getHours() < 12 ? i18n.amPm[0].toUpperCase() : i18n.amPm[1].toUpperCase();
    },
    ZZ: function(dateObj) {
      var o = dateObj.getTimezoneOffset();
      return (o > 0 ? '-' : '+') + pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4);
    }
  };

  var parseFlags = {
    D: [twoDigits, function (d, v) {
      d.day = v;
    }],
    Do: [new RegExp(twoDigits.source + word.source), function (d, v) {
      d.day = parseInt(v, 10);
    }],
    M: [twoDigits, function (d, v) {
      d.month = v - 1;
    }],
    YY: [twoDigits, function (d, v) {
      var da = new Date(), cent = +('' + da.getFullYear()).substr(0, 2);
      d.year = '' + (v > 68 ? cent - 1 : cent) + v;
    }],
    h: [twoDigits, function (d, v) {
      d.hour = v;
    }],
    m: [twoDigits, function (d, v) {
      d.minute = v;
    }],
    s: [twoDigits, function (d, v) {
      d.second = v;
    }],
    YYYY: [fourDigits, function (d, v) {
      d.year = v;
    }],
    S: [/\d/, function (d, v) {
      d.millisecond = v * 100;
    }],
    SS: [/\d{2}/, function (d, v) {
      d.millisecond = v * 10;
    }],
    SSS: [threeDigits, function (d, v) {
      d.millisecond = v;
    }],
    d: [twoDigits, noop],
    ddd: [word, noop],
    MMM: [word, monthUpdate('monthNamesShort')],
    MMMM: [word, monthUpdate('monthNames')],
    a: [word, function (d, v, i18n) {
      var val = v.toLowerCase();
      if (val === i18n.amPm[0]) {
        d.isPm = false;
      } else if (val === i18n.amPm[1]) {
        d.isPm = true;
      }
    }],
    ZZ: [/([\+\-]\d\d:?\d\d|Z)/, function (d, v) {
      if (v === 'Z') v = '+00:00';
      var parts = (v + '').match(/([\+\-]|\d\d)/gi), minutes;

      if (parts) {
        minutes = +(parts[1] * 60) + parseInt(parts[2], 10);
        d.timezoneOffset = parts[0] === '+' ? minutes : -minutes;
      }
    }]
  };
  parseFlags.dd = parseFlags.d;
  parseFlags.dddd = parseFlags.ddd;
  parseFlags.DD = parseFlags.D;
  parseFlags.mm = parseFlags.m;
  parseFlags.hh = parseFlags.H = parseFlags.HH = parseFlags.h;
  parseFlags.MM = parseFlags.M;
  parseFlags.ss = parseFlags.s;
  parseFlags.A = parseFlags.a;


  // Some common format strings
  fecha.masks = {
    default: 'ddd MMM DD YYYY HH:mm:ss',
    shortDate: 'M/D/YY',
    mediumDate: 'MMM D, YYYY',
    longDate: 'MMMM D, YYYY',
    fullDate: 'dddd, MMMM D, YYYY',
    shortTime: 'HH:mm',
    mediumTime: 'HH:mm:ss',
    longTime: 'HH:mm:ss.SSS'
  };

  /***
   * Format a date
   * @method format
   * @param {Date|number} dateObj
   * @param {string} mask Format of the date, i.e. 'mm-dd-yy' or 'shortDate'
   */
  fecha.format = function (dateObj, mask, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof dateObj === 'number') {
      dateObj = new Date(dateObj);
    }

    if (Object.prototype.toString.call(dateObj) !== '[object Date]' || isNaN(dateObj.getTime())) {
      throw new Error('Invalid Date in fecha.format');
    }

    mask = fecha.masks[mask] || mask || fecha.masks['default'];

    var literals = [];

    // Make literals inactive by replacing them with ??
    mask = mask.replace(literal, function($0, $1) {
      literals.push($1);
      return '??';
    });
    // Apply formatting rules
    mask = mask.replace(token, function ($0) {
      return $0 in formatFlags ? formatFlags[$0](dateObj, i18n) : $0.slice(1, $0.length - 1);
    });
    // Inline literal values back into the formatted value
    return mask.replace(/\?\?/g, function() {
      return literals.shift();
    });
  };

  /**
   * Parse a date string into an object, changes - into /
   * @method parse
   * @param {string} dateStr Date string
   * @param {string} format Date parse format
   * @returns {Date|boolean}
   */
  fecha.parse = function (dateStr, format, i18nSettings) {
    var i18n = i18nSettings || fecha.i18n;

    if (typeof format !== 'string') {
      throw new Error('Invalid format in fecha.parse');
    }

    format = fecha.masks[format] || format;

    // Avoid regular expression denial of service, fail early for really long strings
    // https://www.owasp.org/index.php/Regular_expression_Denial_of_Service_-_ReDoS
    if (dateStr.length > 1000) {
      return false;
    }

    var isValid = true;
    var dateInfo = {};
    format.replace(token, function ($0) {
      if (parseFlags[$0]) {
        var info = parseFlags[$0];
        var index = dateStr.search(info[0]);
        if (!~index) {
          isValid = false;
        } else {
          dateStr.replace(info[0], function (result) {
            info[1](dateInfo, result, i18n);
            dateStr = dateStr.substr(index + result.length);
            return result;
          });
        }
      }

      return parseFlags[$0] ? '' : $0.slice(1, $0.length - 1);
    });

    if (!isValid) {
      return false;
    }

    var today = new Date();
    if (dateInfo.isPm === true && dateInfo.hour != null && +dateInfo.hour !== 12) {
      dateInfo.hour = +dateInfo.hour + 12;
    } else if (dateInfo.isPm === false && +dateInfo.hour === 12) {
      dateInfo.hour = 0;
    }

    var date;
    if (dateInfo.timezoneOffset != null) {
      dateInfo.minute = +(dateInfo.minute || 0) - +dateInfo.timezoneOffset;
      date = new Date(Date.UTC(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0));
    } else {
      date = new Date(dateInfo.year || today.getFullYear(), dateInfo.month || 0, dateInfo.day || 1,
        dateInfo.hour || 0, dateInfo.minute || 0, dateInfo.second || 0, dateInfo.millisecond || 0);
    }
    return date;
  };

  /* istanbul ignore next */
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = fecha;
  } else if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function () {
      return fecha;
    }.call(exports, __webpack_require__, exports, module),
				__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {
    main.fecha = fecha;
  }
})(this);


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.map` for arrays without support for iteratee
 * shorthands.
 *
 * @private
 * @param {Array} [array] The array to iterate over.
 * @param {Function} iteratee The function invoked per iteration.
 * @returns {Array} Returns the new mapped array.
 */
function arrayMap(array, iteratee) {
  var index = -1,
      length = array == null ? 0 : array.length,
      result = Array(length);

  while (++index < length) {
    result[index] = iteratee(array[index], index, array);
  }
  return result;
}

module.exports = arrayMap;


/***/ }),
/* 44 */
/***/ (function(module, exports) {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.clamp` which doesn't coerce arguments.
 *
 * @private
 * @param {number} number The number to clamp.
 * @param {number} [lower] The lower bound.
 * @param {number} upper The upper bound.
 * @returns {number} Returns the clamped number.
 */
function baseClamp(number, lower, upper) {
  if (number === number) {
    if (upper !== undefined) {
      number = number <= upper ? number : upper;
    }
    if (lower !== undefined) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}

module.exports = baseClamp;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.findIndex` and `_.findLastIndex` without
 * support for iteratee shorthands.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {Function} predicate The function invoked per iteration.
 * @param {number} fromIndex The index to search from.
 * @param {boolean} [fromRight] Specify iterating from right to left.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function baseFindIndex(array, predicate, fromIndex, fromRight) {
  var length = array.length,
      index = fromIndex + (fromRight ? 1 : -1);

  while ((fromRight ? index-- : ++index < length)) {
    if (predicate(array[index], index, array)) {
      return index;
    }
  }
  return -1;
}

module.exports = baseFindIndex;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(15),
    getRawTag = __webpack_require__(53),
    objectToString = __webpack_require__(54);

/** `Object#toString` result references. */
var nullTag = '[object Null]',
    undefinedTag = '[object Undefined]';

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * The base implementation of `getTag` without fallbacks for buggy environments.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the `toStringTag`.
 */
function baseGetTag(value) {
  if (value == null) {
    return value === undefined ? undefinedTag : nullTag;
  }
  return (symToStringTag && symToStringTag in Object(value))
    ? getRawTag(value)
    : objectToString(value);
}

module.exports = baseGetTag;


/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.isNaN` without support for number objects.
 *
 * @private
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
 */
function baseIsNaN(value) {
  return value !== value;
}

module.exports = baseIsNaN;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(29);

/**
 * Used by `_.trim` and `_.trimEnd` to get the index of the last string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the last unmatched string symbol.
 */
function charsEndIndex(strSymbols, chrSymbols) {
  var index = strSymbols.length;

  while (index-- && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

module.exports = charsEndIndex;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

var baseIndexOf = __webpack_require__(29);

/**
 * Used by `_.trim` and `_.trimStart` to get the index of the first string symbol
 * that is not found in the character symbols.
 *
 * @private
 * @param {Array} strSymbols The string symbols to inspect.
 * @param {Array} chrSymbols The character symbols to find.
 * @returns {number} Returns the index of the first unmatched string symbol.
 */
function charsStartIndex(strSymbols, chrSymbols) {
  var index = -1,
      length = strSymbols.length;

  while (++index < length && baseIndexOf(chrSymbols, strSymbols[index], 0) > -1) {}
  return index;
}

module.exports = charsStartIndex;


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var castSlice = __webpack_require__(31),
    hasUnicode = __webpack_require__(32),
    stringToArray = __webpack_require__(33),
    toString = __webpack_require__(8);

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

module.exports = freeGlobal;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(69)))

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var Symbol = __webpack_require__(15);

/** Used for built-in method references. */
var objectProto = Object.prototype;

/** Used to check objects for own properties. */
var hasOwnProperty = objectProto.hasOwnProperty;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/** Built-in value references. */
var symToStringTag = Symbol ? Symbol.toStringTag : undefined;

/**
 * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
 *
 * @private
 * @param {*} value The value to query.
 * @returns {string} Returns the raw `toStringTag`.
 */
function getRawTag(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag),
      tag = value[symToStringTag];

  try {
    value[symToStringTag] = undefined;
    var unmasked = true;
  } catch (e) {}

  var result = nativeObjectToString.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag] = tag;
    } else {
      delete value[symToStringTag];
    }
  }
  return result;
}

module.exports = getRawTag;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var nativeObjectToString = objectProto.toString;

/**
 * Converts `value` to a string using `Object.prototype.toString`.
 *
 * @private
 * @param {*} value The value to convert.
 * @returns {string} Returns the converted string.
 */
function objectToString(value) {
  return nativeObjectToString.call(value);
}

module.exports = objectToString;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var freeGlobal = __webpack_require__(52);

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

module.exports = root;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * A specialized version of `_.indexOf` which performs strict equality
 * comparisons of values, i.e. `===`.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {*} value The value to search for.
 * @param {number} fromIndex The index to search from.
 * @returns {number} Returns the index of the matched value, else `-1`.
 */
function strictIndexOf(array, value, fromIndex) {
  var index = fromIndex - 1,
      length = array.length;

  while (++index < length) {
    if (array[index] === value) {
      return index;
    }
  }
  return -1;
}

module.exports = strictIndexOf;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/** Used to compose unicode character classes. */
var rsAstralRange = '\\ud800-\\udfff',
    rsComboMarksRange = '\\u0300-\\u036f',
    reComboHalfMarksRange = '\\ufe20-\\ufe2f',
    rsComboSymbolsRange = '\\u20d0-\\u20ff',
    rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange,
    rsVarRange = '\\ufe0e\\ufe0f';

/** Used to compose unicode capture groups. */
var rsAstral = '[' + rsAstralRange + ']',
    rsCombo = '[' + rsComboRange + ']',
    rsFitz = '\\ud83c[\\udffb-\\udfff]',
    rsModifier = '(?:' + rsCombo + '|' + rsFitz + ')',
    rsNonAstral = '[^' + rsAstralRange + ']',
    rsRegional = '(?:\\ud83c[\\udde6-\\uddff]){2}',
    rsSurrPair = '[\\ud800-\\udbff][\\udc00-\\udfff]',
    rsZWJ = '\\u200d';

/** Used to compose unicode regexes. */
var reOptMod = rsModifier + '?',
    rsOptVar = '[' + rsVarRange + ']?',
    rsOptJoin = '(?:' + rsZWJ + '(?:' + [rsNonAstral, rsRegional, rsSurrPair].join('|') + ')' + rsOptVar + reOptMod + ')*',
    rsSeq = rsOptVar + reOptMod + rsOptJoin,
    rsSymbol = '(?:' + [rsNonAstral + rsCombo + '?', rsCombo, rsRegional, rsSurrPair, rsAstral].join('|') + ')';

/** Used to match [string symbols](https://mathiasbynens.be/notes/javascript-unicode). */
var reUnicode = RegExp(rsFitz + '(?=' + rsFitz + ')|' + rsSymbol + rsSeq, 'g');

/**
 * Converts a Unicode `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function unicodeToArray(string) {
  return string.match(reUnicode) || [];
}

module.exports = unicodeToArray;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

var baseClamp = __webpack_require__(45),
    baseToString = __webpack_require__(16),
    toInteger = __webpack_require__(64),
    toString = __webpack_require__(8);

/**
 * Checks if `string` ends with the given target string.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to inspect.
 * @param {string} [target] The string to search for.
 * @param {number} [position=string.length] The position to search up to.
 * @returns {boolean} Returns `true` if `string` ends with `target`,
 *  else `false`.
 * @example
 *
 * _.endsWith('abc', 'c');
 * // => true
 *
 * _.endsWith('abc', 'b');
 * // => false
 *
 * _.endsWith('abc', 'b', 2);
 * // => true
 */
function endsWith(string, target, position) {
  string = toString(string);
  target = baseToString(target);

  var length = string.length;
  position = position === undefined
    ? length
    : baseClamp(toInteger(position), 0, length);

  var end = position;
  position -= target.length;
  return position >= 0 && string.slice(position, end) == target;
}

module.exports = endsWith;


/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(30);

/**
 * Gets all but the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {Array} Returns the slice of `array`.
 * @example
 *
 * _.initial([1, 2, 3]);
 * // => [1, 2]
 */
function initial(array) {
  var length = array == null ? 0 : array.length;
  return length ? baseSlice(array, 0, -1) : [];
}

module.exports = initial;


/***/ }),
/* 60 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 61 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return value != null && typeof value == 'object';
}

module.exports = isObjectLike;


/***/ }),
/* 62 */
/***/ (function(module, exports) {

/**
 * Gets the last element of `array`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Array
 * @param {Array} array The array to query.
 * @returns {*} Returns the last element of `array`.
 * @example
 *
 * _.last([1, 2, 3]);
 * // => 3
 */
function last(array) {
  var length = array == null ? 0 : array.length;
  return length ? array[length - 1] : undefined;
}

module.exports = last;


/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

var toNumber = __webpack_require__(65);

/** Used as references for various `Number` constants. */
var INFINITY = 1 / 0,
    MAX_INTEGER = 1.7976931348623157e+308;

/**
 * Converts `value` to a finite number.
 *
 * @static
 * @memberOf _
 * @since 4.12.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted number.
 * @example
 *
 * _.toFinite(3.2);
 * // => 3.2
 *
 * _.toFinite(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toFinite(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toFinite('3.2');
 * // => 3.2
 */
function toFinite(value) {
  if (!value) {
    return value === 0 ? value : 0;
  }
  value = toNumber(value);
  if (value === INFINITY || value === -INFINITY) {
    var sign = (value < 0 ? -1 : 1);
    return sign * MAX_INTEGER;
  }
  return value === value ? value : 0;
}

module.exports = toFinite;


/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

var toFinite = __webpack_require__(63);

/**
 * Converts `value` to an integer.
 *
 * **Note:** This method is loosely based on
 * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to convert.
 * @returns {number} Returns the converted integer.
 * @example
 *
 * _.toInteger(3.2);
 * // => 3
 *
 * _.toInteger(Number.MIN_VALUE);
 * // => 0
 *
 * _.toInteger(Infinity);
 * // => 1.7976931348623157e+308
 *
 * _.toInteger('3.2');
 * // => 3
 */
function toInteger(value) {
  var result = toFinite(value),
      remainder = result % 1;

  return result === result ? (remainder ? result - remainder : result) : 0;
}

module.exports = toInteger;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(34),
    isSymbol = __webpack_require__(35);

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = toNumber;


/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

var baseToString = __webpack_require__(16),
    castSlice = __webpack_require__(31),
    charsEndIndex = __webpack_require__(49),
    charsStartIndex = __webpack_require__(50),
    stringToArray = __webpack_require__(33),
    toString = __webpack_require__(8);

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/**
 * Removes leading and trailing whitespace or specified characters from `string`.
 *
 * @static
 * @memberOf _
 * @since 3.0.0
 * @category String
 * @param {string} [string=''] The string to trim.
 * @param {string} [chars=whitespace] The characters to trim.
 * @param- {Object} [guard] Enables use as an iteratee for methods like `_.map`.
 * @returns {string} Returns the trimmed string.
 * @example
 *
 * _.trim('  abc  ');
 * // => 'abc'
 *
 * _.trim('-_-abc-_-', '_-');
 * // => 'abc'
 *
 * _.map(['  foo  ', '  bar  '], _.trim);
 * // => ['foo', 'bar']
 */
function trim(string, chars, guard) {
  string = toString(string);
  if (string && (guard || chars === undefined)) {
    return string.replace(reTrim, '');
  }
  if (!string || !(chars = baseToString(chars))) {
    return string;
  }
  var strSymbols = stringToArray(string),
      chrSymbols = stringToArray(chars),
      start = charsStartIndex(strSymbols, chrSymbols),
      end = charsEndIndex(strSymbols, chrSymbols) + 1;

  return castSlice(strSymbols, start, end).join('');
}

module.exports = trim;


/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

var toString = __webpack_require__(8);

/** Used to generate unique IDs. */
var idCounter = 0;

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @example
 *
 * _.uniqueId('contact_');
 * // => 'contact_104'
 *
 * _.uniqueId();
 * // => '105'
 */
function uniqueId(prefix) {
  var id = ++idCounter;
  return toString(prefix) + id;
}

module.exports = uniqueId;


/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

var createCaseFirst = __webpack_require__(51);

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;


/***/ }),
/* 69 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 70 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_uniqueId__ = __webpack_require__(67);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_uniqueId___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_uniqueId__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_utilities_helpers_array__ = __webpack_require__(98);
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



class UpdateBatch {
	
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
		
		this.fieldId       = args.fieldId || __WEBPACK_IMPORTED_MODULE_0_lodash_uniqueId___default()('Container');
		this.id            = this.fieldId;
		this.fieldName     = args.fieldName || 'asset';
		this.containerType = args.type;
		this.itemIds       = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_utilities_helpers_array__["a" /* toArray */])(args.itemIds);
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
			Values : __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_utilities_helpers_array__["a" /* toArray */])(args.value)
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
/* harmony export (immutable) */ __webpack_exports__["a"] = UpdateBatch;


/***/ }),
/* 71 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_connectService_login__ = __webpack_require__(85);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_request_connectService_keepAlive__ = __webpack_require__(84);




class Auth extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Number} [args.keepAliveInterval] - Timeout for making a keep alive request
	 */
	constructor( args = {}  ) {
		super(args);
		this.keepAliveInterval = args.keepAliveInterval || 60000;
	}
	
	/**
	 * Logs in a user
	 * @param {String} username - username to log in with
	 * @param {String} password - password of said user
	 * @returns {Promise}
	 */
	login( { username = '', password = '' } ) {
		
		const loginRequest = new __WEBPACK_IMPORTED_MODULE_1_request_connectService_login__["a" /* Login */]({
			apiUrl : this.apiUrl
		});
		
		return loginRequest.execute({
			username, password
		});

	}
	
	/**
	 * Ahh, Ahh, Ahh, Ahh, Staying alive, staying alive
	 * @returns {Promise}
	 */
	keepAlive() {
		
		const keepAliveRequest = new __WEBPACK_IMPORTED_MODULE_2_request_connectService_keepAlive__["a" /* KeepAlive */]({
			apiUrl : this.apiUrl
		});
		
		return keepAliveRequest.execute();
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Auth;


/***/ }),
/* 72 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_searchService_appConfiguration__ = __webpack_require__(92);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_request_configService_appLabels__ = __webpack_require__(83);




class Config extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
	}
	
	/**
	 * Get app configurations
	 * @returns {Promise}
	 */
	getAppConfiguration() {
		
		const appConfigRequest = new __WEBPACK_IMPORTED_MODULE_1_request_searchService_appConfiguration__["a" /* AppConfiguration */]({
			apiUrl : this.apiUrl
		});
		
		return appConfigRequest.execute();
	}
	
	/**
	 * Get app labels
	 * @returns {Promise}
	 */
	getAppLabels() {
		const appConfigRequest = new __WEBPACK_IMPORTED_MODULE_2_request_configService_appLabels__["a" /* AppLabels */]({
			apiUrl : this.apiUrl
		});
		
		return appConfigRequest.execute();
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Config;


/***/ }),
/* 73 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_searchService_folders__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_request_searchService_filters__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_request_searchService_assets__ = __webpack_require__(93);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst__ = __webpack_require__(68);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst__);






class Content extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	get SORT_TYPES() {
		if(!this._sortTypes) {
			this._sortTypes = this._parseSortTypes(this.rawSortTypes);
		}
		return this._sortTypes;
	}
	
	/**
	 * Default search
	 * @returns {string}
	 * @constructor
	 */
	get DEFAULT_SEARCH() {
		return 'DigiZuite_System_Framework_Search';
	}
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 * @param {String} args.metafieldLabelId - metafieldLabelId of the menu
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.metafieldLabelId = args.metafieldLabelId;
		this.sLayoutFolderId = args.sLayoutFolderId;
		this.labels = args.labels;
		this.rawSortTypes = args.sortTypes;
		this.defaultSortType = __WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst___default()(args.defaultSortType);
		
		this.cache  = {
			total : {},
			filters : {},
			facetResult : {}
		};
	}
	
	/**
	 * Return a list of available sort by fields
	 * @returns {Array}
	 */
	getSortBy() {
		return this.SORT_TYPES;
	}
	
	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.path] - Path under which to search for folders
	 * @returns {Promise}
	 */
	getFolders( args = {} ) {
		
		const foldersRequest = new __WEBPACK_IMPORTED_MODULE_1_request_searchService_folders__["a" /* Folders */]({
			apiUrl : this.apiUrl
		});
		
		return foldersRequest.execute({
			sfMetafieldLabelId : this.metafieldLabelId,
			path : args.path || '/'
		});
	}
	
	/**
	 * Get a list of folders
	 * @param args
	 * @param {String} [args.searchName] - The search for which to obtain the filters
	 * @returns {Promise}
	 */
	getFilters( args = {} ) {
	
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		
		if( this.cache.filters.hasOwnProperty(searchName) ) {
			return Promise.resolve(this.cache.filters[searchName]);
		}
		
		const filtersRequest = new __WEBPACK_IMPORTED_MODULE_2_request_searchService_filters__["a" /* Filters */]({
			apiUrl : this.apiUrl,
			labels : this.labels
		});
		
		return filtersRequest.execute({
			searchName
		}).then( (response) => {
			this.cache.filters[searchName] = response;
			return response;
		});
		
	}
	
	/**
	 * Get a list of assets
	 * @param args
	 * @param {String} [args.path] - The path holding the assets
	 * @returns {Promise}
	 */
	getAssets( args = {} ) {
		
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		
		const assetsRequest = new __WEBPACK_IMPORTED_MODULE_3_request_searchService_assets__["a" /* Assets */]({
			apiUrl         : this.apiUrl,
			sLayoutFolderId: this.sLayoutFolderId,
			filters        : this.cache.filters[searchName],
			sortTypes      : this.SORT_TYPES,
			defaultSortType: this.defaultSortType
		});
		
		return assetsRequest.execute(args)
			.then(({assets, facetResult, navigation})=>{
				this.cache.facetResult[ searchName ] = facetResult;
				return {assets, navigation };
			});
	}
	
	/**
	 * Get a list of facet results
	 * @param args
	 * @param {String} [args.searchName] - The path holding the assets
	 * @returns {Object}
	 */
	getFacetResult( args = {} ) {
		const searchName = args.searchName || this.DEFAULT_SEARCH;
		return Promise.resolve(this.cache.facetResult[ searchName ]);
	}
	
	/**
	 * Parses sort types
	 * @param sortTypes
	 * @returns {*|Array}
	 * @private
	 */
	_parseSortTypes( sortTypes= [] ) {
		return sortTypes.map((thisSortType) => {
			const sortParts = thisSortType.split(',');
			return {
				by              : __WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst___default()(sortParts[0]),
				name            : this.labels[`LBL_CCC_SORT_TYPE_${sortParts[0].toUpperCase()}`],
				defaultDirection: __WEBPACK_IMPORTED_MODULE_4_lodash_upperFirst___default()(sortParts[1])
			};
		});
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Content;


/***/ }),
/* 74 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_memberService_downloadQualities__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_const__ = __webpack_require__(9);




class Download extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args = {}) {
		super(args);
		
		this.memberId              = args.memberId;
		this.accessKey             = args.accessKey;
		this.lowResMediaFormatIds  = args.lowResMediaFormatIds;
		this.highResMediaFormatIds = args.highResMediaFormatIds;
		this.mediaUrl              = args.mediaUrl;
		
		this.cache = {
			qualities: null
		};
	}
	
	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.quality
	 * @returns {Promise.<string>}
	 */
	getDownloadURL(args = {}) {
		
		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}
		
		return this._getAllDownloadQualities().then((qualities) => {
			
			// get only the qualities for the current asset type
			const assetQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === args.asset.type);
			const quality = args.quality || __WEBPACK_IMPORTED_MODULE_2_const__["a" /* Constants */].DOWNLOAD_QUALITY.ORIGINAL;
			let mediaFormatId = -1;
			
			if( quality !== __WEBPACK_IMPORTED_MODULE_2_const__["a" /* Constants */].DOWNLOAD_QUALITY.ORIGINAL ) {
				
				if(!assetQualities) {
					throw new Error('Requested quality not found for the asset!');
				}
				
				let searchArray = quality === __WEBPACK_IMPORTED_MODULE_2_const__["a" /* Constants */].DOWNLOAD_QUALITY.HIGH_RES ?
					this.highResMediaFormatIds : this.lowResMediaFormatIds;
				
				// Make voodoo and intersect these array to find the format id
				searchArray.forEach( (thisMediaFormatId)=> {
					const format = assetQualities.formats.find((thisFormat) => thisFormat.mediaformatId === thisMediaFormatId);
					if(format) {
						mediaFormatId = thisMediaFormatId;
					}
				});

			}
			
			return this._getDownloadURLForFormat({asset: args.asset, mediaFormatId});
		});
		
	}
	
	/**
	 * Returns a promise that resolves to the download URL of the asset
	 * @param {Object} args
	 * @param {Asset} args.asset
	 * @param {Number} args.mediaFormatId
	 * @returns {String}
	 */
	_getDownloadURLForFormat(args = {}) {
		
		const transcode = args.asset.getTranscodeForMediaFormat(args.mediaFormatId);
		
		// Build download URL as defined by House og Co.
		let downloadUrl = `${this.mediaUrl}dmm3bwsv3/AssetStream.aspx?assetid=i${args.asset.id}&download=true&accesskey=${this.accessKey}&cachebust=${Date.now()}`;

		// since source copies are not stored as a different transcode
		// we don't need to set a format ID or destination ID
		if (args.mediaFormatId === -1) {
			downloadUrl += '&AssetOutputIdent=Download';
		} else {
			downloadUrl += `&downloadName=&mediaformatid=${transcode.mediaFormatId}&destinationid=${transcode.mediaTranscodeDestinationId}`;
		}

		return downloadUrl;
	}
	
	/**
	 *
	 * @param args
	 * @returns {Promise}
	 */
	getAllDownloadURL( args = {} ) {
		
		if (!args.asset) {
			throw new Error('getDownloadURL expected an asset as parameter!');
		}
		
		return this._getAllDownloadQualities().then((qualities) => {
			
			let result = [];
			
			const assetQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === args.asset.type);
			
			assetQualities.formats.forEach((thisFormat) => {
				const thisTranscode = args.asset.getTranscodeForMediaFormat( thisFormat.mediaformatId );
				if( thisTranscode ) {
					result.push({
						quality : thisFormat.label,
						url : this._getDownloadURLForFormat({ asset : args.asset, mediaFormatId : thisFormat.mediaformatId })
					});
				}
			});
			
			const allAssetTypeQualities = qualities.find((thisQualityGroup)=> thisQualityGroup.assetType === 0);
			if( allAssetTypeQualities ) {
				result.push({
					quality : 'Original',
					url : this._getDownloadURLForFormat({ asset : args.asset, mediaFormatId : -1 })
				});
			}
			
			return result;
		});
	}
	
	/**
	 *  Returns a list of download qualities
	 * @returns {Object}
	 * @private
	 */
	_getAllDownloadQualities() {
		
		const downloadQualitiesRequest = new __WEBPACK_IMPORTED_MODULE_1_request_memberService_downloadQualities__["a" /* DownloadQualities */]({
			apiUrl: this.apiUrl
		});
		
		if (this.cache.qualities) {
			return Promise.resolve(this.cache.qualities);
		}
		
		return downloadQualitiesRequest.execute().then((downloadQualities)=>{
			this.cache.qualities = downloadQualities;
			return downloadQualities;
		});
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Download;


/***/ }),
/* 75 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_metadataService_metadataGroups__ = __webpack_require__(89);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_request_metadataService_metadataItems__ = __webpack_require__(90);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_request_metadataService_comboOptions__ = __webpack_require__(87);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_request_metadataService_treeOptions__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_request_metadataService_isUniqueVersion__ = __webpack_require__(88);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_request_batchUpdateService_batchUpdate__ = __webpack_require__(82);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_model_metadata_languageMetadataGroup__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_model_metadata_treeMetadataItem__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_model_metadata_comboValueMetadataItem__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_model_metadata_editComboValueMetadataItem__ = __webpack_require__(11);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_model_metadata_multiComboValueMetadataItem__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_model_metadata_editMultiComboValueMetadataItem__ = __webpack_require__(12);














class Metadata extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
		this.language = args.language;
		this.languages = args.languages;
	}
	
	/**
	 * Returns a list of metadata groups
	 * @param {Object} args
	 * @param {Asset} args.asset - Asset for which to get the metadata
	 */
	getMetadataGroups( args = {} ) {
		
		if (!args.asset) {
			throw new Error('getMetadataGroups expected an asset as parameter!');
		}
		
		const groupRequest = new __WEBPACK_IMPORTED_MODULE_1_request_metadataService_metadataGroups__["a" /* MetadataGroups */]({
			apiUrl : this.apiUrl,
		});
		
		// Add this.getLanguageMetadataGroups()
		// for language specific metadata. Beware of not being completed.
		return Promise.all([
			groupRequest.execute({ assetId : args.asset.id }),
			Promise.resolve([]),
		]).then(([metadataGroups, languageGroups]) => {
			
			const groups = [ ...languageGroups, ...metadataGroups ];
			
			groups.sort((a, b) => {
				return a.sortIndex - b.sortIndex;
			});
			
			return groups;
		});
	}
	
	/**
	 * Returns a list of language metadata
	 * @returns {Promise.<Array>}
	 */
	getLanguageMetadataGroups() {
		
		const groups = this.languages.map((thisLanguage) => {
			return new __WEBPACK_IMPORTED_MODULE_7_model_metadata_languageMetadataGroup__["a" /* LanguageMetadataGroup */]({
				id        : thisLanguage.languageId,
				languageId: thisLanguage.languageId,
				name      : thisLanguage.languageName,
				sortIndex : Infinity
			});
		});
		
		return Promise.resolve(groups);
	}
	
	/**
	 * Returns a list of metadata items in a group
	 * @param args
	 * @param {Asset} args.asset
	 * @param {MetadataGroup} args.group
	 * @returns {Promise.<T>}
	 */
	getMetadataItems( args = {}) {
		if (!args.asset) {
			throw new Error('getMetadataItems expected an asset as parameter!');
		}
		
		if (!args.group) {
			throw new Error('getMetadataItems expected an group as parameter!');
		}
		
		const metadataItemsRequest = new __WEBPACK_IMPORTED_MODULE_2_request_metadataService_metadataItems__["a" /* MetadataItems */]({
			apiUrl : this.apiUrl,
		});
		
		return metadataItemsRequest.execute({
			id      : args.group.id,
			assetId : args.asset.id,
			language: this.language
		});
	}
	
	/**
	 *
	 * @param args
	 * @param {Asset} args.asset
	 * @param {Array} args.metadataItems
	 * @returns {Promise.<T>}
	 */
	updateMetadataItems( args = {} ) {
		
		if (!args.asset) {
			throw new Error('updateMetadataItems expected an asset as parameter!');
		}
		
		if (!args.metadataItems) {
			throw new Error('updateMetadataItems expected an metadataItems as parameter!');
		}
		
		const batchUpdateRequest = new __WEBPACK_IMPORTED_MODULE_6_request_batchUpdateService_batchUpdate__["a" /* BatchUpdate */]({
			apiUrl : this.apiUrl,
		});
		
		return batchUpdateRequest.execute({
			asset        : args.asset,
			metadataItems: args.metadataItems,
		});
	}
	
	/**
	 * Get metadata options
	 * @param args
	 */
	getMetadataItemOptions( args = {} ) {
		
		if( args.metadataItem instanceof __WEBPACK_IMPORTED_MODULE_8_model_metadata_treeMetadataItem__["a" /* TreeMetadataItem */] ) {
			
			return this.getTreeOptions(args);
			
		} else if(
			(args.metadataItem instanceof __WEBPACK_IMPORTED_MODULE_9_model_metadata_comboValueMetadataItem__["a" /* ComboValueMetadataItem */]) ||
			(args.metadataItem instanceof __WEBPACK_IMPORTED_MODULE_10_model_metadata_editComboValueMetadataItem__["a" /* EditComboValueMetadataItem */]) ||
			(args.metadataItem instanceof __WEBPACK_IMPORTED_MODULE_11_model_metadata_multiComboValueMetadataItem__["a" /* MultiComboValueMetadataItem */]) ||
			(args.metadataItem instanceof __WEBPACK_IMPORTED_MODULE_12_model_metadata_editMultiComboValueMetadataItem__["a" /* EditMultiComboValueMetadataItem */])
		) {
			
			return this.getComboOptions(args);
			
		} else {
			throw new Error('getMetadataItemOptions required a metadata item of type tree or combo value');
		}
		
	}
	
	/**
	 * Get tree options
	 * @param args
	 * @returns {Promise}
	 */
	getTreeOptions( args = {} ) {
		
		if (!args.metadataItem) {
			throw new Error('updateMetadataItem expected an metadataItems as parameter!');
		}
		
		const treeOptionsRequest = new __WEBPACK_IMPORTED_MODULE_4_request_metadataService_treeOptions__["a" /* TreeOptions */]({
			apiUrl : this.apiUrl,
		});
		
		return treeOptionsRequest.execute({
			metadataItem: args.metadataItem,
			path: args.path,
		});
	}
	
	/**
	 * Get combo options
	 * @param args
	 * @returns {Promise}
	 */
	getComboOptions( args = {} ) {
		
		if (!args.metadataItem) {
			throw new Error('updateMetadataItem expected an metadataItems as parameter!');
		}
		
		const comboOptionsRequest = new __WEBPACK_IMPORTED_MODULE_3_request_metadataService_comboOptions__["a" /* ComboOptions */]({
			apiUrl : this.apiUrl,
		});
		
		return comboOptionsRequest.execute({
			metadataItem: args.metadataItem,
			query: args.query,
		});
		
	}
	
	/**
	 * Checks if a version is unique
	 * @param args
	 * @param {Asset} args.asset
	 * @param {UniqueVersionMetadataItem} args.metadataItem
	 * @returns {Promise}
	 */
	verifyUniqueVersion( args = {} ) {
		
		if (!args.asset) {
			throw new Error('verifyUniqueVersion expected an asset as parameter!');
		}
		
		if (!args.metadataItem) {
			throw new Error('verifyUniqueVersion expected an metadataItem as parameter!');
		}
		
		if(!args.metadataItem.value) {
			throw new Error('verifyUniqueVersion expected an metadataItem  with a value set!');
		}
		
		if(!args.metadataItem.value.version || !args.metadataItem.value.unique) {
			throw new Error('verifyUniqueVersion expected an metadataItem  with a value set!');
		}
		
		const isUniqueVersionRequest = new __WEBPACK_IMPORTED_MODULE_5_request_metadataService_isUniqueVersion__["a" /* IsUniqueVersion */]({
			apiUrl : this.apiUrl,
		});
		
		return isUniqueVersionRequest.execute({
			metadataItem: args.metadataItem,
			asset: args.asset
		});
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Metadata;


/***/ }),
/* 76 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_endpoint__ = __webpack_require__(2);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_request_uploadService_createUpload__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_request_uploadService_itemIdUpload__ = __webpack_require__(97);




class Upload extends __WEBPACK_IMPORTED_MODULE_0_common_endpoint__["a" /* Endpoint */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor(args = {}) {
		super(args);
		this.computerName = args.computerName;
	}
	
	/**
	 * Upload a file
	 * @param {Object} args
	 * @param args.file
	 */
	uploadAsset( args = {} ) {
	
		if(!args.file) {
			throw new Error('Upload expect a file as parameter');
		}
		
		return this._getUploadId(args.file)
			.then((result) => console.log(result));
	}
	
	/**
	 * Finishes an upload
	 * @param args
	 * @private
	 */
	_finishUpload( args = {} ) {
	
	}
	
	/**
	 * Get upload ID
	 * @param file
	 * @private
	 */
	_getUploadId( file ) {
		
		const createUploadRequest = new __WEBPACK_IMPORTED_MODULE_1_request_uploadService_createUpload__["a" /* CreateUpload */]({
			apiUrl : this.apiUrl
		});
		
		const itemIdUploadRequest = new __WEBPACK_IMPORTED_MODULE_2_request_uploadService_itemIdUpload__["a" /* ItemIdUpload */]({
			apiUrl : this.apiUrl
		});
		
		// Create an upload request
		return createUploadRequest.execute({
			computerName: this.computerName,
			file        : file
		}).then(( { uploadId } )=>{
			
			return itemIdUploadRequest.execute({
				uploadId
			}).then(({itemId}) => { return {itemId, uploadId}; });
			
		});
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Upload;


/***/ }),
/* 77 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_connector__ = __webpack_require__(37);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Connector", function() { return __WEBPACK_IMPORTED_MODULE_0_connector__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_const__ = __webpack_require__(9);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "Constants", function() { return __WEBPACK_IMPORTED_MODULE_1_const__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_filter_assetTypeFilter__ = __webpack_require__(40);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AssetTypeFilter", function() { return __WEBPACK_IMPORTED_MODULE_2_model_filter_assetTypeFilter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_model_filter_assetNameFilter__ = __webpack_require__(39);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AssetNameFilter", function() { return __WEBPACK_IMPORTED_MODULE_3_model_filter_assetNameFilter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_model_filter_assetCreatedFilter__ = __webpack_require__(38);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "AssetCreatedFilter", function() { return __WEBPACK_IMPORTED_MODULE_4_model_filter_assetCreatedFilter__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_model_metadata_metadataGroup__ = __webpack_require__(6);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MetadataGroup", function() { return __WEBPACK_IMPORTED_MODULE_5_model_metadata_metadataGroup__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_model_metadata_iterativeMetadataGroup__ = __webpack_require__(22);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "IterativeMetadataGroup", function() { return __WEBPACK_IMPORTED_MODULE_6_model_metadata_iterativeMetadataGroup__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_model_metadata_languageMetadataGroup__ = __webpack_require__(23);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LanguageMetadataGroup", function() { return __WEBPACK_IMPORTED_MODULE_7_model_metadata_languageMetadataGroup__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_model_metadata_bitMetadataItem__ = __webpack_require__(19);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "BitMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_8_model_metadata_bitMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_model_metadata_stringMetadataItem__ = __webpack_require__(5);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "StringMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_9_model_metadata_stringMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_model_metadata_noteMetadataItem__ = __webpack_require__(26);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "NoteMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_10_model_metadata_noteMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_model_metadata_editMultiComboValueMetadataItem__ = __webpack_require__(12);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "EditMultiComboValueMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_11_model_metadata_editMultiComboValueMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_model_metadata_treeMetadataItem__ = __webpack_require__(13);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_12_model_metadata_treeMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_model_metadata_linkMetadataItem__ = __webpack_require__(24);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "LinkMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_13_model_metadata_linkMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_model_metadata_comboValueMetadataItem__ = __webpack_require__(4);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ComboValueMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_14_model_metadata_comboValueMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15_model_metadata_dateTimeMetadataItem__ = __webpack_require__(10);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "DateTimeMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_15_model_metadata_dateTimeMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16_model_metadata_floatMetadataItem__ = __webpack_require__(20);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "FloatMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_16_model_metadata_floatMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17_model_metadata_intMetadataItem__ = __webpack_require__(21);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "IntMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_17_model_metadata_intMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18_model_metadata_moneyMetadataItem__ = __webpack_require__(25);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MoneyMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_18_model_metadata_moneyMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19_model_metadata_multiComboValueMetadataItem__ = __webpack_require__(7);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "MultiComboValueMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_19_model_metadata_multiComboValueMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20_model_metadata_uniqueVersionMetadataItem__ = __webpack_require__(28);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UniqueVersionMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_20_model_metadata_uniqueVersionMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21_model_metadata_editComboValueMetadataItem__ = __webpack_require__(11);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "EditComboValueMetadataItem", function() { return __WEBPACK_IMPORTED_MODULE_21_model_metadata_editComboValueMetadataItem__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22_model_metadata_comboOption__ = __webpack_require__(3);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "ComboOption", function() { return __WEBPACK_IMPORTED_MODULE_22_model_metadata_comboOption__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23_model_metadata_treeOption__ = __webpack_require__(14);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "TreeOption", function() { return __WEBPACK_IMPORTED_MODULE_23_model_metadata_treeOption__["a"]; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24_model_metadata_uniqueOption__ = __webpack_require__(27);
/* harmony reexport (binding) */ __webpack_require__.d(__webpack_exports__, "UniqueOption", function() { return __WEBPACK_IMPORTED_MODULE_24_model_metadata_uniqueOption__["a"]; });
// main



// filters




// metadata groups




// metadata items















// metadata options





/***/ }),
/* 78 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
class Asset {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor( args = {} ) {
	
		this.id = parseInt(args.itemId, 10);
		this.name = args.name;
		this.type = parseInt(args.assetType, 10);
		this.thumbnail =  args.thumb.indexOf('?mptdid=0') === -1 ? args.thumb : '';
		
		this._transcodes = args.transcodeFilename;
	
	}
	
	/**
	 *
	 * @param mediaFormatId
	 * @returns {*|T}
	 */
	getTranscodeForMediaFormat( mediaFormatId ) {
		return this._transcodes.find( (transcode)=> parseInt(transcode.mediaFormatId,10) === mediaFormatId );
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Asset;


/***/ }),
/* 79 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter__ = __webpack_require__(17);


class ArrayFilter extends __WEBPACK_IMPORTED_MODULE_0__filter__["a" /* Filter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super(args);
		
		if( !args.values ) {
			throw new Error('Expected StringFilter to have a values parameter!');
		}
		
		this.values = args.values;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id]                   : this.values.join(','),
			[`${this.id}_type_multiids`]: 1
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ArrayFilter;


/***/ }),
/* 80 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter__ = __webpack_require__(17);


class DateFilter extends __WEBPACK_IMPORTED_MODULE_0__filter__["a" /* Filter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super(args);
		
		if( !args.from && !args.to) {
			throw new Error('Expected DateFilter to have a from or a to parameter!');
		}
		
		this.from = args.from;
		this.to = args.to;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id] : this._unixToDotNetTime(this.from),
			[`${this.id}_type_date`] : `${this.id}_end`,
			[`${this.id}_end`] : this._unixToDotNetTime(this.to)
		};
	}
	
	/**
	 *
	 * @param time
	 * @returns {string}
	 * @private
	 */
	_unixToDotNetTime( time ) {
		
		const date = new Date(time*1000);
		
		const dateParts = [];
		const timeParts = [];
		
		dateParts.push( date.getFullYear() );
		dateParts.push( String(date.getMonth()+1).padStart(2, '0') );
		dateParts.push( String(date.getDate()).padStart(2, '0') );
		
		timeParts.push( String(date.getHours()).padStart(2, '0') );
		timeParts.push( String(date.getMinutes()).padStart(2, '0') );
		timeParts.push( String(date.getSeconds()).padStart(2, '0') );
		
		return `${dateParts.join('-')}T${timeParts.join(':')}.000`;
	}
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DateFilter;


/***/ }),
/* 81 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__filter__ = __webpack_require__(17);


class StringFilter extends __WEBPACK_IMPORTED_MODULE_0__filter__["a" /* Filter */] {
	
	/**
	 * C-tor
	 * @param args
	 */
	constructor(args = {}) {
		super(args);
		
		if( !args.value ) {
			throw new Error('Expected StringFilter to have a value parameter!');
		}
		
		this.value = args.value;
	}
	
	/**
	 * Export for search payload
	 * @returns {{freetext: *}}
	 */
	getAsSearchPayload() {
		return {
			[this.id] : this.value
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = StringFilter;


/***/ }),
/* 82 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_updateBatch__ = __webpack_require__(70);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_metadata_dateTimeMetadataItem__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_model_metadata_metadataItem__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_const__ = __webpack_require__(9);






class BatchUpdate extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}BatchUpdateService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			useMetadataVersionedAccess: 0,
			updateXML                 : '',
			values                    : null,
		};
	}
	
	/**
	 *
	 * @returns {DateTimeMetadataItem}
	 */
	getLastModifiedMetadataItem() {
		return new __WEBPACK_IMPORTED_MODULE_2_model_metadata_dateTimeMetadataItem__["a" /* DateTimeMetadataItem */]({
			guid : __WEBPACK_IMPORTED_MODULE_4_const__["a" /* Constants */].GUID.LAST_MODIFIED,
			value : new Date()
		});
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		let updateXml = '';
		let updateValues = [];
		
		console.debug("---------------------");
		
		const metadataItems = [ ...payload.metadataItems, this.getLastModifiedMetadataItem() ];
		
		// Create an update batch
		const batch = new __WEBPACK_IMPORTED_MODULE_1_common_updateBatch__["a" /* UpdateBatch */]({
			type: __WEBPACK_IMPORTED_MODULE_1_common_updateBatch__["a" /* UpdateBatch */].BATCH_TYPE.ItemIdsValuesRowid,
			itemIds: [ payload.asset.id ],
			rowId: __WEBPACK_IMPORTED_MODULE_1_common_updateBatch__["a" /* UpdateBatch */].ROW_ID.NonIncremental
		});
		
		// Compose all the metadata items into a batch
		metadataItems.forEach(
			thisMetadataItem => batch.appendValue( this.getBatchValueFromMetadataItem(thisMetadataItem) )
		);
		
		// Get the XML and JSON
		updateXml += batch.getBatchXML();
		updateValues.push( batch.getBatchJSON() );
		
		// Final strap to payload
		payload.updateXML = `<r>${updateXml}</r>`;
		payload.values = JSON.stringify(updateValues);
		payload.asset = undefined;
		payload.metadataItems = undefined;
		
		return payload;
	}
	
	/**
	 * Computes a batch value from the metadata item
	 * @param metadataItem
	 * @returns {{fieldName: string, fieldProperties: {}, valueType: (*|{String: number, Bool: number, Int: number, DateTime: number, Float: number, IntList: number, Folder: number, AssetType: number, StringRow: number, BoolRow: number, IntRow: number, DateTimeRow: number, FloatRow: number, IntListRow: number, Delete: number, ValueExtraValue: number, StringList: number, StringListRow: number}), value: (string|null)}}
	 */
	getBatchValueFromMetadataItem( metadataItem ) {
		
		const batchValue = {
			// Update the metafield with the given labelId
			fieldName      : metadataItem instanceof __WEBPACK_IMPORTED_MODULE_3_model_metadata_metadataItem__["a" /* MetadataItem */] ? 'metafield' : '',
			fieldProperties: {},
			
			// Store the value
			valueType: metadataItem.VALUE_TYPE,
			value    : metadataItem.getBatchValue()
		};
		
		// Determine if we should use labelId or GUID
		if( metadataItem.labelId ) {
			batchValue.fieldProperties.labelId = metadataItem.labelId;
		} else if( metadataItem.guid ) {
			batchValue.fieldProperties.standardGuid = metadataItem.guid;
		}
		
		return batchValue;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = BatchUpdate;


/***/ }),
/* 83 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class AppLabels extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConfigService.js`;
	}
	
	/**
	 *
	 * @returns {{method: string, page: number, limit: number, start: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'GetLabels',
			page  : 1,
			limit : 25,
			start : 0,
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		
		const cleanResponse = {};
		
		response.items.forEach((thisLabel)=>{
			cleanResponse[ thisLabel.labelConstant ] = thisLabel.label;
		});
		
		return cleanResponse;
	}
	
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AppLabels;


/***/ }),
/* 84 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class KeepAlive extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConnectService.js`;
	}
	
	
	/**
	 * default params
	 * @returns {{method: string}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'IsLoggedIn',
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = KeepAlive;


/***/ }),
/* 85 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_blueimp_md5__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_blueimp_md5___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_blueimp_md5__);



class Login extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}ConnectService.js`;
	}
	
	
	/**
	 * default parameters for the call
	 * @returns {{method: string, usertype: number, page: number, limit: number, username: null, password: null}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'LogOn',
			usertype: 2,
			page: 1,
			limit: 25,
			
			// These parameters should be specified manually
			username: null,
			password: null
		};
	}
	
	/**
	 * Process login request
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData( payload ) {
		
		// MD5 the password
		payload.password = __WEBPACK_IMPORTED_MODULE_1_blueimp_md5___default()(payload.password);
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData( response ) {
		
		const user = response.items[0];
		
		user.memberId = parseInt(user.memberId, 10);
		user.languageId = parseInt(user.languageId, 10);
		user.itemid = parseInt(user.itemid, 10);
		
		// We are only interested in the user data
		return user;
	}

}
/* harmony export (immutable) */ __webpack_exports__["a"] = Login;


/***/ }),
/* 86 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class DownloadQualities extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}MemberService.js`;
	}
	
	
	/**
	 * default params
	 * @returns {{method: string}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method: 'GetDownloadQualities',
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.downloadQualities;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = DownloadQualities;


/***/ }),
/* 87 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_comboOption__ = __webpack_require__(3);



class ComboOptions extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName        : 'DigiZuite_System_metadatav2_combobox',
			page              : 1,
			limit             : 25,
			sfMetafieldLabelId: null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.sfMetafieldLabelId = payload.metadataItem.labelId;
		payload.metadataItem = undefined;
		
		// Navigation data
		if( payload.hasOwnProperty('navigation') ) {
			
			if( payload.navigation.hasOwnProperty('page') ) {
				payload.page = payload.navigation.page;
			}
			if( payload.navigation.hasOwnProperty('limit') ) {
				payload.limit = payload.navigation.limit;
			}
			
			payload.navigation = undefined;
		}
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return {
			navigation : {total: parseInt(response.total, 10)},
			options     : response.items.map( thisOption => __WEBPACK_IMPORTED_MODULE_1_model_metadata_comboOption__["a" /* ComboOption */].createFromAPIResponse(thisOption)),
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ComboOptions;


/***/ }),
/* 88 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_comboOption__ = __webpack_require__(3);



class IsUniqueVersion extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}MetadataService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method : 'IsUniqueVersionUnique',
			rowid  : 1,
			itemId : null,
			version: null,
			unique : null,
			mlid   : null,
		};
	}
	
	/**
	 * Pre-process
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.itemId = payload.asset.id;
		payload.asset = undefined;
		
		payload.mlid = payload.metadataItem.labelId;
		payload.version = payload.metadataItem.value.version;
		payload.unique = payload.metadataItem.value.unique;
		
		payload.metadataItem = undefined;
		
		return payload;
	}
	
	/**
	 * Return empty
	 * @returns {undefined}
	 */
	processResponseData() {
		return undefined;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = IsUniqueVersion;


/***/ }),
/* 89 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_metadataGroup__ = __webpack_require__(6);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_metadata_iterativeMetadataGroup__ = __webpack_require__(22);




class MetadataGroups extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName          : 'DigiZuite_system_metadatav2_listGroups',
			limit               : 9999,
			page                : 1,
			itemid_type_multiids: 1,
			itemid              : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.itemid = payload.assetId;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		
		const groups = response.items[0].metafieldid.map((thisGroup) => {
			
			const payload = {
				id       : parseInt(thisGroup.metafieldSubGroup, 10),
				name     : thisGroup.metafieldName,
				sortIndex: parseInt(thisGroup.metafieldSortindex, 10),
			};
			
			return parseInt(thisGroup.metafieldIterated, 10) ?
				new __WEBPACK_IMPORTED_MODULE_2_model_metadata_iterativeMetadataGroup__["a" /* IterativeMetadataGroup */](payload) :
				new __WEBPACK_IMPORTED_MODULE_1_model_metadata_metadataGroup__["a" /* MetadataGroup */](payload) ;
		});
		
		groups.push(new __WEBPACK_IMPORTED_MODULE_1_model_metadata_metadataGroup__["a" /* MetadataGroup */]({
			id       : parseInt(response.items[0].metafieldgroupid, 10),
			name     : response.items[0].metafieldgroupname,
			sortIndex: 0,
		}));
		
		return groups;
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MetadataGroups;


/***/ }),
/* 90 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_stringMetadataItem__ = __webpack_require__(5);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_metadata_noteMetadataItem__ = __webpack_require__(26);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_model_metadata_editMultiComboValueMetadataItem__ = __webpack_require__(12);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_model_metadata_treeMetadataItem__ = __webpack_require__(13);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_model_metadata_linkMetadataItem__ = __webpack_require__(24);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_model_metadata_bitMetadataItem__ = __webpack_require__(19);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_model_metadata_comboValueMetadataItem__ = __webpack_require__(4);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_model_metadata_dateTimeMetadataItem__ = __webpack_require__(10);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_model_metadata_floatMetadataItem__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10_model_metadata_intMetadataItem__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11_model_metadata_moneyMetadataItem__ = __webpack_require__(25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12_model_metadata_multiComboValueMetadataItem__ = __webpack_require__(7);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13_model_metadata_uniqueVersionMetadataItem__ = __webpack_require__(28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14_model_metadata_editComboValueMetadataItem__ = __webpack_require__(11);
















class MetadataItems extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName                : 'DigiZuite_system_metadatav2_listGroupsMetafields',
			limit                     : 9999,
			page                      : 1,
			itemid_note_type_MultiIds : 1,
			itemid_value_type_MultiIds: 1,
			rowid_note                : 1,
			rowid_value               : 1,
			itemid_note               : null,
			itemid_value              : null,
			metafieldgroupid          : null,
			accesskeylanguage         : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.itemid_note  = payload.assetId;
		payload.itemid_value = payload.assetId;
		payload.assetId      = undefined;
		
		payload.accesskeylanguage = payload.language;
		payload.language          = undefined;
		
		payload.metafieldgroupid = payload.id;
		payload.id               = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		
		return response.items.map((thisItem) => {
			
			let result;
			
			// Yeahhh... no...
			switch (parseInt(thisItem.metafieldid.item_datatypeid, 10)) {
				case __WEBPACK_IMPORTED_MODULE_6_model_metadata_bitMetadataItem__["a" /* BitMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_6_model_metadata_bitMetadataItem__["a" /* BitMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_1_model_metadata_stringMetadataItem__["a" /* StringMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_1_model_metadata_stringMetadataItem__["a" /* StringMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_2_model_metadata_noteMetadataItem__["a" /* NoteMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_2_model_metadata_noteMetadataItem__["a" /* NoteMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_7_model_metadata_comboValueMetadataItem__["a" /* ComboValueMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_7_model_metadata_comboValueMetadataItem__["a" /* ComboValueMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_3_model_metadata_editMultiComboValueMetadataItem__["a" /* EditMultiComboValueMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_3_model_metadata_editMultiComboValueMetadataItem__["a" /* EditMultiComboValueMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_4_model_metadata_treeMetadataItem__["a" /* TreeMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_4_model_metadata_treeMetadataItem__["a" /* TreeMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_5_model_metadata_linkMetadataItem__["a" /* LinkMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_5_model_metadata_linkMetadataItem__["a" /* LinkMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_8_model_metadata_dateTimeMetadataItem__["a" /* DateTimeMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_8_model_metadata_dateTimeMetadataItem__["a" /* DateTimeMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_9_model_metadata_floatMetadataItem__["a" /* FloatMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_9_model_metadata_floatMetadataItem__["a" /* FloatMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_10_model_metadata_intMetadataItem__["a" /* IntMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_10_model_metadata_intMetadataItem__["a" /* IntMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_11_model_metadata_moneyMetadataItem__["a" /* MoneyMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_11_model_metadata_moneyMetadataItem__["a" /* MoneyMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_13_model_metadata_uniqueVersionMetadataItem__["a" /* UniqueVersionMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_13_model_metadata_uniqueVersionMetadataItem__["a" /* UniqueVersionMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_14_model_metadata_editComboValueMetadataItem__["a" /* EditComboValueMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_14_model_metadata_editComboValueMetadataItem__["a" /* EditComboValueMetadataItem */].createFromAPIResponse(thisItem);
					break;
				case __WEBPACK_IMPORTED_MODULE_12_model_metadata_multiComboValueMetadataItem__["a" /* MultiComboValueMetadataItem */].TYPE:
					result = __WEBPACK_IMPORTED_MODULE_12_model_metadata_multiComboValueMetadataItem__["a" /* MultiComboValueMetadataItem */].createFromAPIResponse(thisItem);
					break;
				default:
					// Lol
					break;
			}
			
			return result;
		});
		
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = MetadataItems;


/***/ }),
/* 91 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__ = __webpack_require__(14);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_utilities_helpers_treePath__ = __webpack_require__(18);




class TreeOptions extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor(args = {}) {
		super(args);
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * Default payload
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			searchName        : 'Digizuite_system_metadatav2_tree',
			page              : 1,
			limit             : 25,
			sfMetafieldLabelId: null,
			node              : 0,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		payload.sfMetafieldLabelId = payload.metadataItem.labelId;
		payload.metadataItem = undefined;
		
		// Navigation data
		if( payload.hasOwnProperty('navigation') ) {
			
			if( payload.navigation.hasOwnProperty('page') ) {
				payload.page = payload.navigation.page;
			}
			if( payload.navigation.hasOwnProperty('limit') ) {
				payload.limit = payload.navigation.limit;
			}
			
			payload.navigation = undefined;
		}
		
		if( payload.hasOwnProperty('path') ) {
			payload.node = payload.path ? __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_2_utilities_helpers_treePath__["a" /* getItemIdFromIdPath */])(payload.path) : 0;
			payload.path = undefined;
		}
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return {
			navigation : {total: parseInt(response.total, 10)},
			options     : response.items.map( thisOption => __WEBPACK_IMPORTED_MODULE_1_model_metadata_treeOption__["a" /* TreeOption */].createFromAPIResponse(thisOption)),
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = TreeOptions;


/***/ }),
/* 92 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_common_requestError__ = __webpack_require__(36);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_isObject__ = __webpack_require__(34);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_lodash_isObject___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_lodash_isObject__);




class AppConfiguration extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {{SearchName: string, page: number, limit: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'DigiZuite_System_Configs',
			page: 1,
			limit: 25,
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData( response ) {
		
		if(!Array.isArray(response.items) || !__WEBPACK_IMPORTED_MODULE_2_lodash_isObject___default()(response.items[0])) {
			throw new __WEBPACK_IMPORTED_MODULE_1_common_requestError__["a" /* RequestError */]('Malformed response in DigiZuite_System_Configs.');
		}
		
		const config = response.items[0];
		
		config.DefaultLanguage = parseInt(config.DefaultLanguage, 10);
		config.languages = config.languages.map((thisLanguage)=>{
			thisLanguage.languageId = parseInt(thisLanguage.languageId, 10);
			return thisLanguage;
		});
		
		// We are only interested in the user data
		return config;
	}
	
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = AppConfiguration;


/***/ }),
/* 93 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_utilities_helpers_treePath__ = __webpack_require__(18);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_model_asset__ = __webpack_require__(78);




class Assets extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {String} args.sLayoutFolderId - An object of labels
	 * @param {Object} args.filters - An object of labels
	 * @param {Object} args.sortTypes - An object of labels
	 * @param {String} args.defaultSortType - An object of labels
	 */
	constructor( args = {}  ) {
		super(args);
		this.sLayoutFolderId = args.sLayoutFolderId;
		this.filters = args.filters;
		this.sortTypes = args.sortTypes;
		this.defaultSortType = args.defaultSortType;
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName: 'DigiZuite_System_Framework_Search',
			sLayoutFolderId: null,
			
			// Configurations for facet search. This will be appended with other directives as we go along
			// TO BE re-enabled at a later point
			// config : [
			// 	'facet=true',
			// 	'facet.sort=count',
			// 	'facet.limit=100',
			// 	'facet.field=sAssetType'
			// ],
			
			// Pagination settings - only page should be changed when executing
			// the request, limit should be left on the recommended setting
			page: 1,
			limit: 25
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {

		// Weird shit
		payload.sLayoutFolderId = this.sLayoutFolderId;
		
		// Navigation data
		if( payload.hasOwnProperty('navigation') ) {
			
			if( payload.navigation.hasOwnProperty('page') ) {
				payload.page = payload.navigation.page;
			}
			if( payload.navigation.hasOwnProperty('limit') ) {
				payload.limit = payload.navigation.limit;
			}
			
			payload.navigation = undefined;
		}
		
		// Sorting
		let sortBy = this.defaultSortType;
		let sortDirection = '';
		
		if( payload.hasOwnProperty('sorting') ) {
			if( payload.sorting.hasOwnProperty('by') ) {
				sortBy = payload.sorting.by;
			}
			if( payload.sorting.hasOwnProperty('direction') ) {
				sortDirection = payload.sorting.direction;
			}
		}
		
		// No sort direction provided, fallback to default one
		if( !sortDirection ) {
			const selectedSortType = this.sortTypes.find((thisSortType) => thisSortType.by === sortBy );
			sortDirection = selectedSortType.defaultDirection;
		}
		
		payload.sort = `sort${sortBy}${sortDirection}`;
		payload.sorting = undefined;
		
		// Filters
		if( payload.hasOwnProperty('filters')  ) {
			payload.filters.forEach((thisFilter) => Object.assign(payload, thisFilter.getAsSearchPayload() ));
			payload.filters = undefined;
		}
		
		// Path
		if( payload.hasOwnProperty('path')  ) {
			payload.sMenu = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_utilities_helpers_treePath__["a" /* getItemIdFromIdPath */])(payload.path);
			payload.path  = undefined;
		}
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return {
			navigation : {total: parseInt(response.total, 10)},
			assets     : response.items.map( thisAsset => new __WEBPACK_IMPORTED_MODULE_2_model_asset__["a" /* Asset */](thisAsset)),
			facetResult: Array.isArray(response.extra) && response.extra.length > 1 ? response.extra[1].facet_counts.facet_fields : null
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Assets;


/***/ }),
/* 94 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class Filters extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 * @param {Object} args.labels - An object of labels
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.labels = args.labels;
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method    : 'GetVisibleSearchFields',
			searchName: null,
		};
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.searchFields.map( this._processFilterResult.bind(this) );
	}
	
	/**
	 * Nice-ify the result
	 * @param thisFilter
	 * @returns {{id: string, name: string, type: string}}
	 * @private
	 */
	_processFilterResult(thisFilter) {
		return {
			id  : thisFilter.parameterName,
			name: this.labels[thisFilter.parameterName],
			type: thisFilter.renderType
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Filters;


/***/ }),
/* 95 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_utilities_helpers_treePath__ = __webpack_require__(18);



class Folders extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}SearchService.js`;
	}
	
	/**
	 * default params
	 * @returns {{SearchName: string, page: number, limit: number}}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			SearchName        : 'Digizuite_system_metadatav2_tree',
			page              : 1,
			limit             : 9999,
			sfMetafieldLabelId: null,
			node              : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// path -> node
		payload.node = __webpack_require__.i(__WEBPACK_IMPORTED_MODULE_1_utilities_helpers_treePath__["a" /* getItemIdFromIdPath */])(payload.path);
		
		// remove unused proprieties
		payload.path = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		// We are only interested in the items
		return response.items.map(this._processFolderResult);
	}
	
	/**
	 * Nice-ify the result from the folder response
	 * @param thisFolder
	 * @returns {{path: string, name: (string), hasChildren: boolean, writable: boolean}}
	 * @private
	 */
	_processFolderResult(thisFolder) {
		return {
			path       : thisFolder.idPath,
			name       : thisFolder.text,
			hasChildren: parseInt(thisFolder.Children, 10) > 0,
			writable   : parseInt(thisFolder.writeaccess, 10) === 1
		};
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = Folders;


/***/ }),
/* 96 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class CreateUpload extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor( args = {}  ) {
		super(args);
		
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadRest.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method      : 'AddUploadFileWithNameAndSettingsNoDate',
			computername: this.computerName,
			filename    : null,
			name        : null,
			filesize    : null,
			settingsxml : null,
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// ComputerName
		payload.computername = payload.computerName;
		payload.computerName = undefined;
		
		// File name
		payload.filename = payload.file.name;
		payload.name = payload.file.name.substring( 0, payload.file.name.lastIndexOf('.')  );
		
		// File size
		payload.filesize = payload.file.size;
		
		payload.file = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items[0];
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = CreateUpload;


/***/ }),
/* 97 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_common_request__ = __webpack_require__(0);


class ItemIdUpload extends __WEBPACK_IMPORTED_MODULE_0_common_request__["a" /* BaseRequest */] {
	
	/**
	 * C-tor
	 * @param {Object} args
	 */
	constructor( args = {}  ) {
		super(args);
		
	}
	
	/**
	 * Endpoint URL
	 * @returns {string}
	 */
	get endpointUrl() {
		return `${this.apiUrl}UploadRest.js`;
	}
	
	/**
	 *
	 * @returns {Object}
	 */
	get defaultPayload() {
		return {
			// Parameters required by DigiZuite - these should never be changed
			// when executing the request!
			method      : 'GetItemidFromAssetDigiuploadid',
			UploadID : null
		};
	}
	
	/**
	 * Pass-through
	 * @param {Object} payload
	 * @returns {Object}
	 */
	processRequestData(payload = {}) {
		
		// ComputerName
		payload.UploadID = payload.uploadId;
		payload.uploadId = undefined;
		
		return payload;
	}
	
	/**
	 * Process response
	 * @param response
	 */
	processResponseData(response) {
		return response.items[0];
	}
	
}
/* harmony export (immutable) */ __webpack_exports__["a"] = ItemIdUpload;


/***/ }),
/* 98 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * Transforms a value to array
 * @param value
 * @returns []
 */
const toArray = ( value ) => {
	
	if( Array.isArray(value) ) {
		return value;
	}
	
	return value ? [value] : [];
};
/* harmony export (immutable) */ __webpack_exports__["a"] = toArray;


/***/ }),
/* 99 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_endsWith__ = __webpack_require__(58);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_lodash_endsWith___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_lodash_endsWith__);


/**
 *
 * @param url
 * @returns {string}
 */
const ensureTrailingSeparator = (url = '') => {
	return url + (__WEBPACK_IMPORTED_MODULE_0_lodash_endsWith___default()(url, '/') ? '' : '/');
};
/* harmony export (immutable) */ __webpack_exports__["a"] = ensureTrailingSeparator;


/***/ })
/******/ ]);
});
//# sourceMappingURL=digizuite.js.map