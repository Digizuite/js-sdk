import {attachEndpoint} from '../connector';
import {Endpoint} from '../common/endpoint';
import {UpdateContainer} from '../utilities/updateContainer';
import {BatchUpdate} from '../request/batchUpdateService/batchUpdate';
import { Member as MemberRequest } from '../request/searchService/member';

export class Member extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
		
		this.loggedInMemberId = args.loggedInMemberId;
	}
	
	/**
	 * Returns a promise that resolves to a member model
	 * @param args
	 * @returns {Promise.<MemberModel>}
	 */
	getMemberById( args = {} ) {
		
		if( !args.hasOwnProperty('id') ) {
			throw new Error('getMemberById expects a id as parameter');
		}
		
		const memberRequest = new MemberRequest({
			apiUrl: this.apiUrl
		});
		
		return memberRequest.execute({
			id : args.id
		});
	}
	
	/**
	 * Returns a promise that resolves to the member model of the currently logged in member
	 * @returns {Promise.<MemberModel>}
	 */
	getMemberLoggedIn() {
		return this.getMemberById({
			id : this.loggedInMemberId
		});
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
		apiUrl          : instance.apiUrl,
		loggedInMemberId: instance.state.user.memberId
	});
};

attachEndpoint({ name, getter });