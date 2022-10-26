[@masa-finance/masa-sdk](../README.md) / [Exports](../modules.md) / MasaClient

# Class: MasaClient

## Table of contents

### Constructors

- [constructor](MasaClient.md#constructor)

### Properties

- [cookie](MasaClient.md#cookie)
- [middlewareClient](MasaClient.md#middlewareclient)

### Methods

- [checkSignature](MasaClient.md#checksignature)
- [creditScoreMint](MasaClient.md#creditscoremint)
- [getChallenge](MasaClient.md#getchallenge)
- [getMetadata](MasaClient.md#getmetadata)
- [sessionCheck](MasaClient.md#sessioncheck)
- [sessionLogout](MasaClient.md#sessionlogout)
- [storeMetadata](MasaClient.md#storemetadata)

## Constructors

### constructor

• **new MasaClient**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `Object` |
| `__namedParameters.apiUrl` | `string` |
| `__namedParameters.cookie?` | `string` |

#### Defined in

[src/utils/clients/middleware.ts:13](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L13)

## Properties

### cookie

• `Optional` **cookie**: `string`

#### Defined in

[src/utils/clients/middleware.ts:11](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L11)

___

### middlewareClient

• `Private` **middlewareClient**: `AxiosInstance`

#### Defined in

[src/utils/clients/middleware.ts:10](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L10)

## Methods

### checkSignature

▸ **checkSignature**(`address`, `signature`, `cookie?`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signature` | `string` |
| `cookie?` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/clients/middleware.ts:101](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L101)

___

### creditScoreMint

▸ **creditScoreMint**(`address`, `signature`): `Promise`<`undefined` \| { `message`: `string` ; `success`: `boolean` ; `tokenId`: `string` \| `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address` | `string` |
| `signature` | `string` |

#### Returns

`Promise`<`undefined` \| { `message`: `string` ; `success`: `boolean` ; `tokenId`: `string` \| `BigNumber`  }\>

#### Defined in

[src/utils/clients/middleware.ts:132](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L132)

___

### getChallenge

▸ **getChallenge**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/clients/middleware.ts:79](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L79)

___

### getMetadata

▸ **getMetadata**(`uri`): `Promise`<`undefined` \| [`ICreditReport`](../interfaces/ICreditReport.md) \| [`IIdentity`](../interfaces/IIdentity.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `uri` | `string` |

#### Returns

`Promise`<`undefined` \| [`ICreditReport`](../interfaces/ICreditReport.md) \| [`IIdentity`](../interfaces/IIdentity.md)\>

#### Defined in

[src/utils/clients/middleware.ts:41](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L41)

___

### sessionCheck

▸ **sessionCheck**(): `Promise`<`any`\>

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/clients/middleware.ts:23](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L23)

___

### sessionLogout

▸ **sessionLogout**(): `Promise`<`undefined` \| { `status`: `string`  }\>

#### Returns

`Promise`<`undefined` \| { `status`: `string`  }\>

#### Defined in

[src/utils/clients/middleware.ts:173](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L173)

___

### storeMetadata

▸ **storeMetadata**(`soulName`): `Promise`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `soulName` | `string` |

#### Returns

`Promise`<`any`\>

#### Defined in

[src/utils/clients/middleware.ts:56](https://github.com/masa-finance/masa-sdk/blob/3002684/src/utils/clients/middleware.ts#L56)
