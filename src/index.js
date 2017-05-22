import {Connector as ConnectorClass} from 'connector';
import {Constants as ConstantsClass} from 'const';
import {AssetTypeFilter as AssetTypeFilterClass} from 'common/filter/assetTypeFilter';
import {AssetNameFilter as AssetNameFilterClass} from 'common/filter/assetNameFilter';
import {AssetCreatedFilter as AssetCreatedFilterClass} from 'common/filter/assetCreatedFilter';

export const Connector = ConnectorClass;
export const Constants = ConstantsClass;
export const Search    = {
	AssetTypeFilter   : AssetTypeFilterClass,
	AssetNameFilter   : AssetNameFilterClass,
	AssetCreatedFilter: AssetCreatedFilterClass,
};