import {UpdateContainer} from '../../../src/utilities/updateContainer';

/**
 * Helper method
 * @returns {UpdateContainer}
 */
const createUpdateProfilePictureUpdateContainer = function() {
	const batch = new UpdateContainer({
		type: UpdateContainer.CONTAINER_TYPE.ItemIdsValuesRowid,
		itemIds: [9963],
		id : 'Container1'
	});
	
	batch.addItem({
		
		fieldName: 'metafield',
		fieldProperties: {
			standardGuid: '17C54460-E6CC-4BDA-ABE3-628532617EBD'
		},
		// Update integer-list to contain currently selected favorites
		valueType: UpdateContainer.VALUE_TYPE.Bool,
		value: 0
	});
	
	batch.addItem({
		
		fieldName: 'state',
		
		// Update integer-list to contain currently selected favorites
		valueType: UpdateContainer.VALUE_TYPE.Int,
		value: -1
	});
	
	batch.addItem({
		
		fieldName: 'layoutIsPublic',
		
		// Update integer-list to contain currently selected favorites
		valueType: UpdateContainer.VALUE_TYPE.Bool,
		value: 0
	});
	
	return batch;
};

describe('UpdateContainer', () => {

	it('should provide safe-guards in constructor', ()=>{
		
		expect(()=>{
			new UpdateContainer({ itemIds : [1] });
		}).toThrow();
		
		
		expect(()=>{
			new UpdateContainer({ itemIds : [] });
		}).toThrow();
		
		
		expect(()=>{
			new UpdateContainer({ type : 666, itemIds : [1] });
		}).toThrow();
		
		
		expect(()=>{
			new UpdateContainer({ type : 1, itemIds : [1] });
		}).not.toThrow();
		
	});
	
	it('should provide safe-guards in when adding items', ()=>{
		
		const batch = new UpdateContainer({ type : 1, itemIds : [1] });
		
		expect(()=>{
			batch.addItem({
				fieldName : 'asset',
				value : 1,
			});
		}).toThrow();
		
		
		expect(()=>{
			batch.addItem({
				valueType : 1,
				value : 1,
			});
		}).toThrow();
		
		
		expect(()=>{
			batch.addItem({
				valueType : 1,
				fieldName : 'asset',
			});
		}).toThrow();
		
		expect(()=>{
			batch.addItem({
				valueType : 1,
				fieldName : 'asset',
				value : 1,
			});
		}).not.toThrow();
		
	});
	
	describe('XML', ()=>{
		it('should create an update XML', ()=>{
			
			const batch = createUpdateProfilePictureUpdateContainer();
			
			const expectedXML = '<asset fieldId="Container1"><metafield fieldId="Container1Field1" standardGuid="17C54460-E6CC-4BDA-ABE3-628532617EBD"/><state fieldId="Container1Field2"/><layoutIsPublic fieldId="Container1Field3"/></asset>';

			expect( batch.getContainerXML() ).toBe(expectedXML);
		});
	});
	
	describe('JSON', ()=>{
		it('should create an update JSON', ()=>{
			
			const batch = createUpdateProfilePictureUpdateContainer();
			
			const expectedJSON = '{"Id":"Container1","FieldId":"Container1","FieldName":"asset","ContainerType":7,"ItemIds":[9963],"RowId":1,"Values":[{"FieldId":"Container1Field1","Type":2,"Values":[0]},{"FieldId":"Container1Field2","Type":3,"Values":[-1]},{"FieldId":"Container1Field3","Type":2,"Values":[0]}]}';
			
			expect( JSON.stringify(batch.getContainerJSON()) ).toBe(expectedJSON);
		});
	});
	
	
});