import {BaseRequest} from 'common/request';
import {MetadataGroup} from 'model/metadata/metadataGroup';
import {IterativeMetadataGroup} from 'model/metadata/iterativeMetadataGroup';

export class MetadataGroups extends BaseRequest {
	
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
		
		payload.itemid = payload.itemId;
		
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
				new IterativeMetadataGroup(payload) :
				new MetadataGroup(payload) ;
		});
		
		groups.push(new MetadataGroup({
			id       : parseInt(response.items[0].metafieldgroupid, 10),
			name     : response.items[0].metafieldgroupname,
			sortIndex: 0,
		}));
		
		return groups;
	}
	
}