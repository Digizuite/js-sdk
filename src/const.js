export const GUID = {
    LAST_MODIFIED: 'BF26CA13-BE60-4B34-8087-C7F8345158F7',
    PUBLISH_IN_PROGRESS: 'C31F9FA7-550F-40BF-BD63-1BD45163354C',
};

export const ERROR_CODE = {
  USER_NOT_ALLOWED_PRODUCT_ACCESS : 403
};

// Filter types
export const FILTER_TYPE = {
    STRING: 'string',
    COMBO: 'combo',
    MULTICOMBO: 'multicombo',
    BOOL: 'bool',
    ASSET_TYPE: 'assettype',
    DATE_INTERVAL: 'datebetween',
    TREE: 'tree',
};

// Sort criteria
export const SORT_BY = {
    DATE: 'Date',
    NAME: 'Alphabetic',
};
// Sort directions
export const SORT_DIRECTION = {
    DESCENDING: 'Desc',
    ASCENDING: 'Asc',
};

export const DOWNLOAD_QUALITY = {
    ORIGINAL: 1,
    HIGH_RES: 2,
    LOW_RES: 3
};

// ASSET TYPE
export const ASSET_TYPE = {
    VIDEO: 1,
    AUDIO: 2,
    IMAGE: 4,
    POWERPOINT: 5,
    HTML: 6,
    TEXT: 7,
    WORD: 8,
    EXCEL: 9,
    INDESIGN: 10,
    ZIP: 11,
    ARCHIVE: 15,
    LIVE: 1000,
    META: 12,
    PDF: 14,
    ODF: 110,
    ODG: 107,
    ODB: 109,
    ODM: 111,
    ODP: 105,
    ODS: 102,
    OTH: 112,
    OTP: 106,
    ODT: 100,
    OTG: 108,
    OTS: 103,
    OTT: 101,
    PHOTOSHOP: 16,
    ILLUSTRATOR: 17
};

// export const ASSET_TYPE_REVERSE = [];
export const ASSET_TYPE_REVERSE = Object.keys(ASSET_TYPE)
    .map(type => [type, ASSET_TYPE[type]])
    .reduce((sum, [type, assetType]) => Object.assign({}, sum, {[assetType]: type}), {});

(function () {
	for (let type in ASSET_TYPE) {
		if (ASSET_TYPE.hasOwnProperty(type)) {
			ASSET_TYPE_REVERSE[ASSET_TYPE[type]] = type;
		}
	}
})();

export const Constants = {
    GUID,
    ERROR_CODE,
    FILTER_TYPE,
    SORT_BY,
    SORT_DIRECTION,
    DOWNLOAD_QUALITY,
    ASSET_TYPE,
    ASSET_TYPE_REVERSE
};
