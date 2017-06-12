import {Endpoint} from 'common/endpoint';
import {MembersInformation} from 'request/memberService/membersInformation';

export class Member extends Endpoint {
	
	/**
	 * C-tor
	 * @param {Object} args
	 * @param {String} args.apiUrl - Full URL to the api end-point.
	 */
	constructor( args = {}  ) {
		super(args);
		
		this._cache = {
			member : {}
		};
	}
	
	/**
	 *
	 * @param {Object} args
	 * @param {String|Number} args.memberId
	 * @returns {Promise.<Member>}
	 */
	getMember( args ) {
	
		if( !this._cache.member[args.memberId] ) {
			const membersInformationRequest = new MembersInformation({
				apiUrl: this.apiUrl
			});
			
			this._cache.member[args.memberId] = membersInformationRequest.execute({
				memberId: [args.memberId]
			}).then(([member]) => member);
		}
		
		return this._cache.member[args.memberId];
	}
	
}