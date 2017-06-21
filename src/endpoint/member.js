import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {UpdateContainer} from '../utilities/updateContainer';
import {BatchUpdate} from '../request/batchUpdateService/batchUpdate';

export class Member extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
	}
	
	/**
	 *
	 * @param {Object} args
	 * @param {Object} args.member
	 * @param {Number} args.languageId
	 * @returns {Promise}
	 */
	changeLanguage( args = {} ) {
		
		if( !args.hasOwnProperty('member') ) {
			throw new Error('changeLanguage expects a member as parameter');
		}
		
		if( !args.hasOwnProperty('languageId') ) {
			throw new Error('changeLanguage expects a languageId as parameter');
		}
		
		// Create an update batch
		const updateContainer = new UpdateContainer({
			type     : UpdateContainer.CONTAINER_TYPE.ItemIdsValuesRowid,
			itemIds  : [ args.member.id ],
			fieldName: 'member'
		});
		
		updateContainer.addItem({
			fieldName: 'defaultmetafieldlanguageid',
			valueType: UpdateContainer.VALUE_TYPE.Int,
			value    : args.languageId
		});
		
		const batchUpdateRequest = new BatchUpdate({
			apiUrl : this.apiUrl,
		});
		
		return batchUpdateRequest.execute({
			containers : [ updateContainer ]
		});
		
	}
	
}

// Attach endpoint
const name   = 'member';
const getter = function (instance) {
	return new Member({
		apiUrl   : instance.apiUrl,
	});
};

attachEndpoint({ name, getter });