import {Constants} from 'const';

describe('Sanity', () => {

	it('should work', ()=>{
		expect(Constants.GUID.LAST_MODIFIED).to.be.equal('BF26CA13-BE60-4B34-8087-C7F8345158F7');
	});
	
});