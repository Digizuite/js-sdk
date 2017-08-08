import 'core-js';
import 'whatwg-fetch';

// main
export {Connector, getConnectorInstance} from './connector';
export {Constants, SORT_DIRECTION, SORT_BY, ASSET_TYPE, DOWNLOAD_QUALITY, FILTER_TYPE, GUID, ASSET_TYPE_REVERSE} from './const';

// endpoints
import './endpoint/auth';
import './endpoint/config';
import './endpoint/batch';
import './endpoint/content';
import './endpoint/download';
import './endpoint/metadata';
import './endpoint/upload';
import './endpoint/version';
import './endpoint/member';

// filters
export {AssetTypeFilter} from './model/filter/assetTypeFilter';
export {AssetFreeTextFilter} from './model/filter/assetFreeTextFilter';
export {AssetCreatedFilter} from './model/filter/assetCreatedFilter';

// metadata groups
export {MetadataGroup} from './model/metadata/metadataGroup';
export {IterativeMetadataGroup} from './model/metadata/iterativeMetadataGroup';
export {LanguageMetadataGroup} from './model/metadata/languageMetadataGroup';

// metadata items
export {BitMetadataItem} from './model/metadata/bitMetadataItem';
export {StringMetadataItem} from './model/metadata/stringMetadataItem';
export {NoteMetadataItem} from './model/metadata/noteMetadataItem';
export {EditMultiComboValueMetadataItem} from './model/metadata/editMultiComboValueMetadataItem';
export {TreeMetadataItem} from './model/metadata/treeMetadataItem';
export {LinkMetadataItem} from './model/metadata/linkMetadataItem';
export {ComboValueMetadataItem} from './model/metadata/comboValueMetadataItem';
export {DateTimeMetadataItem} from './model/metadata/dateTimeMetadataItem';
export {FloatMetadataItem} from './model/metadata/floatMetadataItem';
export {IntMetadataItem} from './model/metadata/intMetadataItem';
export {MoneyMetadataItem} from './model/metadata/moneyMetadataItem';
export {MultiComboValueMetadataItem} from './model/metadata/multiComboValueMetadataItem';
export {UniqueVersionMetadataItem} from './model/metadata/uniqueVersionMetadataItem';
export {EditComboValueMetadataItem} from './model/metadata/editComboValueMetadataItem';

// metadata options
export {ComboOption} from './model/metadata/comboOption';
export {TreeOption} from './model/metadata/treeOption';
export {UniqueOption} from './model/metadata/uniqueOption';

// Batch
export {UpdateContainer} from './utilities/updateContainer';
export {BatchUpdate} from './request/batchUpdateService/batchUpdate';

// models
export {CloudFile} from './model/cloudFile';