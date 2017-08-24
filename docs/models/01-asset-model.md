# Asset Model

Asset models are used to store data about an asset and provide convenience/helpers methods for interacting with it. 

## Proprieties

| Propriety name | Data type | Description |
|-------|------|------|
| id | Integer  | The ID of the asset |
| name | String  | The title/name of the asset |
| type | Integer  | A constant representing the asset type. Matches a value from Digizuite.Constants.ASSET_TYPE |
| thumbnail | String  | A URL to the asset thumbnail. If case the asset does not have a thumbnail, an empty string is returned |
| publishedDate | Date  | The date at which the asset was published |
| lastEditedDate | Date  | The date at which the asset was last updated |

## Methods

| Method name | Arguments | Return data type | Description |
|-------|------|------|------|
| getFileExtension | -  | String | Returns the extension of the asset filename |