[@masa-finance/masa-sdk](../README.md) / [Exports](../modules.md) / Masa

# Class: Masa

## Table of contents

### Constructors

- [constructor](Masa.md#constructor)

### Properties

- [account](Masa.md#account)
- [arweaveClient](Masa.md#arweaveclient)
- [client](Masa.md#client)
- [config](Masa.md#config)
- [contracts](Masa.md#contracts)
- [creditScore](Masa.md#creditscore)
- [identity](Masa.md#identity)
- [metadata](Masa.md#metadata)
- [session](Masa.md#session)
- [soulNames](Masa.md#soulnames)
- [utils](Masa.md#utils)

## Constructors

### constructor

• **new Masa**(`__namedParameters`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | `MasaArgs` |

#### Defined in

[src/masa.ts:51](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L51)

## Properties

### account

• **account**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getBalances` | (`address`: `string`) => `Promise`<`undefined` \| { `ethBalance`: `BigNumber` ; `masaBalance`: `BigNumber` ; `usdcBalance`: `BigNumber` ; `wethBalance`: `BigNumber`  }\> |

#### Defined in

[src/masa.ts:100](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L100)

___

### arweaveClient

• `Readonly` **arweaveClient**: `default`

#### Defined in

[src/masa.ts:49](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L49)

___

### client

• `Readonly` **client**: `default`

#### Defined in

[src/masa.ts:48](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L48)

___

### config

• **config**: `MasaConfig`

#### Defined in

[src/masa.ts:75](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L75)

___

### contracts

• **contracts**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `addresses` | [`Addresses`](../interfaces/Addresses.md) |
| `loadIdentityContracts` | () => `Promise`<[`IIdentityContracts`](../interfaces/IIdentityContracts.md)\> |
| `service` | `ContractService` |

#### Defined in

[src/masa.ts:136](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L136)

___

### creditScore

• **creditScore**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`creditReportId`: `number`) => `Promise`<`void`\> |
| `create` | () => `Promise`<`void`\> |
| `list` | (`address?`: `string`) => `Promise`<`void`\> |
| `load` | (`identityId`: `BigNumber`) => `Promise`<`any`[]\> |
| `mint` | (`address`: `string`, `signature`: `string`) => `Promise`<`undefined` \| { `message`: `any` ; `success`: `any`  }\> |

#### Defined in

[src/masa.ts:122](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L122)

___

### identity

• **identity**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | () => `Promise`<`void`\> |
| `create` | (`soulName`: `string`, `duration`: `number`, `paymentMethod`: [`PaymentMethod`](../modules.md#paymentmethod)) => `Promise`<`void`\> |
| `load` | (`address?`: `string`) => `Promise`<`undefined` \| `BigNumber`\> |
| `show` | (`address?`: `string`) => `Promise`<`void`\> |

#### Defined in

[src/masa.ts:89](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L89)

___

### metadata

• **metadata**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `getMetadata` | (`url`: `string`) => `Promise`<`any`\> |
| `metadataStore` | (`soulName`: `string`) => `Promise`<`any`\> |
| `patchMetadataUrl` | (`tokenUri`: `string`) => `string` |

#### Defined in

[src/masa.ts:116](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L116)

___

### session

• **session**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `checkLogin` | () => `Promise`<`boolean`\> |
| `login` | () => `Promise`<`undefined` \| { `address`: `string` ; `cookie`: `any` = challengeData.cookie; `userId`: `any` = checkSignatureData.id }\> |
| `logout` | () => `Promise`<`void`\> |
| `sessionLogout` | () => `Promise`<`any`\> |

#### Defined in

[src/masa.ts:82](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L82)

___

### soulNames

• **soulNames**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `burn` | (`soulName`: `string`) => `Promise`<`void`\> |
| `create` | (`soulName`: `string`, `duration`: `number`, `paymentMethod`: [`PaymentMethod`](../modules.md#paymentmethod)) => `Promise`<`void`\> |
| `list` | (`address?`: `string`) => `Promise`<`void`\> |
| `loadSoulNamesByIdentityId` | (`identityId`: `BigNumber`) => `Promise`<{ `index`: `string` = nameIndex; `metadata`: `any` ; `tokenDetails`: [`string`, `BigNumber`, `BigNumber`, `BigNumber`, `boolean`] & { `active`: `boolean` ; `expirationDate`: `BigNumber` ; `identityId`: `BigNumber` ; `sbtName`: `string` ; `tokenId`: `BigNumber`  } ; `tokenUri`: `string`  }[]\> |

#### Defined in

[src/masa.ts:104](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L104)

___

### utils

• **utils**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `version` | () => { `contractsVersion`: `string` ; `sdkVersion`: `string`  } |

#### Defined in

[src/masa.ts:132](https://github.com/masa-finance/masa-sdk/blob/d4e7116/src/masa.ts#L132)
