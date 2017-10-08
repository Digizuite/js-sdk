# InformationItems Model

InformationItem models are used to store data about an asset information. 
InformationItem is an abstract model. The SDK will never returns an instance of InformationItems, but rather 
an instance of data enforced information items, which inherits from InformationItem. 

## Models which inherit from InformationItem

Below is a list of Model which inherit from InformationItem

| Information type | Data type enforced | Notes |
|---------------|--------------------|-------|
| ArrayInformationItem | array | |
| BoolInformationItem | boolean | |
| DateTimeInformationItem | Date | |
| IntInformationItem | number | |
| LongInformationItem | number | |
| StringInformationItem | string | |

## Proprieties

| Propriety name | Data type | Description |
|-------|------|------|
| id | string | ID of the information item |
| label | string | name/label of the information |
| value | mixed | value of the information. Data type is determined by the data enforced model |

## Methods

| Method name | Arguments | Return data type | Description |
|-------|------|------|------|
| getFormattedValue | -  | String | Returns the value of the information item, following the formatting directions received  from the API |