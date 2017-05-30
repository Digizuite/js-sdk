import {Connector as ConnectorClass} from 'connector';
import {Constants as ConstantsClass} from 'const';

import {AssetTypeFilter as AssetTypeFilterClass} from 'common/filter/assetTypeFilter';
import {AssetNameFilter as AssetNameFilterClass} from 'common/filter/assetNameFilter';
import {AssetCreatedFilter as AssetCreatedFilterClass} from 'common/filter/assetCreatedFilter';

import {MetadataGroup as MetadataGroupClass} from 'model/metadata/metadataGroup';
import {IterativeMetadataGroup as IterativeMetadataGroupClass} from 'model/metadata/iterativeMetadataGroup';
import {LanguageMetadataGroup as LanguageMetadataGroupClass} from 'model/metadata/languageMetadataGroup';

import {ComboOption as ComboOptionClass} from 'model/metadata/comboOption';

import {UpdateBatch as UpdateBatchClass} from 'common/updateBatch';

export const Connector = ConnectorClass;
export const Constants = ConstantsClass;
export const Search    = {
	AssetTypeFilter   : AssetTypeFilterClass,
	AssetNameFilter   : AssetNameFilterClass,
	AssetCreatedFilter: AssetCreatedFilterClass,
};
export const Metadata = {
	MetadataGroup    : MetadataGroupClass,
	IterativeMetadataGroup: IterativeMetadataGroupClass,
	LanguageMetadataGroup : LanguageMetadataGroupClass,
	
	ComboOption : ComboOptionClass
};
export const UpdateBatch = UpdateBatchClass;