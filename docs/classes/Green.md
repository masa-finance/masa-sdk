[# Masa SDK
 - v1.12.5](../README.md) / [Exports](../modules.md) / Green

# Class: Green

## Hierarchy

- [`MasaModuleBase`](MasaModuleBase.md)

  ↳ **`Green`**

## Table of contents

### Constructors

- [constructor](Green.md#constructor)

### Properties

- [instances](Green.md#instances)
- [masa](Green.md#masa)
- [types](Green.md#types)

### Methods

- [addSlippage](Green.md#addslippage)
- [checkOrGiveAllowance](Green.md#checkorgiveallowance)
- [formatPrice](Green.md#formatprice)
- [getPaymentAddress](Green.md#getpaymentaddress)
- [getPrice](Green.md#getprice)
- [mint](Green.md#mint)
- [sign](Green.md#sign)
- [verify](Green.md#verify)

## Constructors

### constructor

• **new Green**(`masa`, `instances`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `masa` | [`Masa`](Masa.md) |
| `instances` | [`IIdentityContracts`](../interfaces/IIdentityContracts.md) |

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[constructor](MasaModuleBase.md#constructor)

## Properties

### instances

• `Protected` **instances**: [`IIdentityContracts`](../interfaces/IIdentityContracts.md)

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[instances](MasaModuleBase.md#instances)

___

### masa

• `Protected` **masa**: [`Masa`](Masa.md)

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[masa](MasaModuleBase.md#masa)

___

### types

• **types**: `Object`

#### Type declaration

| Name | Type |
| :------ | :------ |
| `MintGreen` | { `name`: `string` = "to"; `type`: `string` = "address" }[] |

## Methods

### addSlippage

▸ `Protected` **addSlippage**(`price`, `slippage`): `BigNumber`

adds a percentage to the price as slippage

#### Parameters

| Name | Type |
| :------ | :------ |
| `price` | `BigNumber` |
| `slippage` | `number` |

#### Returns

`BigNumber`

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[addSlippage](MasaModuleBase.md#addslippage)

___

### checkOrGiveAllowance

▸ `Private` **checkOrGiveAllowance**(`paymentAddress`, `paymentMethod`, `spenderAddress`, `price`): `Promise`<`undefined` \| `ContractReceipt`\>

Checks or gives allowance on ERC20 tokens

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentAddress` | `string` |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) |
| `spenderAddress` | `string` |
| `price` | `BigNumber` |

#### Returns

`Promise`<`undefined` \| `ContractReceipt`\>

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[checkOrGiveAllowance](MasaModuleBase.md#checkorgiveallowance)

___

### formatPrice

▸ `Protected` **formatPrice**(`paymentAddress`, `price`): `Promise`<`string`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentAddress` | `string` |
| `price` | `BigNumber` |

#### Returns

`Promise`<`string`\>

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[formatPrice](MasaModuleBase.md#formatprice)

___

### getPaymentAddress

▸ `Private` **getPaymentAddress**(`paymentMethod`): `string`

Gets the payment address for a given payment method

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) |

#### Returns

`string`

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[getPaymentAddress](MasaModuleBase.md#getpaymentaddress)

___

### getPrice

▸ **getPrice**(`paymentMethod`, `slippage?`): `Promise`<{ `formattedMintTransactionFee`: `string` ; `formattedPrice`: `string` ; `mintTransactionEstimatedGas`: `BigNumber` ; `mintTransactionFee`: `BigNumber` ; `paymentAddress`: `string` ; `price`: `BigNumber`  }\>

Gets the price for a masa green

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) | `undefined` |
| `slippage` | `undefined` \| `number` | `250` |

#### Returns

`Promise`<{ `formattedMintTransactionFee`: `string` ; `formattedPrice`: `string` ; `mintTransactionEstimatedGas`: `BigNumber` ; `mintTransactionFee`: `BigNumber` ; `paymentAddress`: `string` ; `price`: `BigNumber`  }\>

___

### mint

▸ **mint**(`paymentMethod`, `receiver`, `authorityAddress`, `signatureDate`, `signature`, `slippage?`): `Promise`<`ContractTransaction`\>

Purchase a masa green

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) | `undefined` |
| `receiver` | `string` | `undefined` |
| `authorityAddress` | `string` | `undefined` |
| `signatureDate` | `number` | `undefined` |
| `signature` | `string` | `undefined` |
| `slippage` | `undefined` \| `number` | `250` |

#### Returns

`Promise`<`ContractTransaction`\>

___

### sign

▸ **sign**(`receiver`): `Promise`<`undefined` \| { `authorityAddress`: `string` ; `signature`: `string` ; `signatureDate`: `number`  }\>

Signs a masa green

#### Parameters

| Name | Type |
| :------ | :------ |
| `receiver` | `string` |

#### Returns

`Promise`<`undefined` \| { `authorityAddress`: `string` ; `signature`: `string` ; `signatureDate`: `number`  }\>

___

### verify

▸ `Protected` **verify**(`errorMessage`, `contract`, `domain`, `types`, `value`, `signature`, `authorityAddress`): `Promise`<`void`\>

verify a signature created during one of the SBT signing flows

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMessage` | `string` |
| `contract` | `SoulLinker` \| `SoulStore` \| `MasaSBTSelfSovereign` |
| `domain` | `TypedDataDomain` |
| `types` | `Record`<`string`, `TypedDataField`[]\> |
| `value` | `Record`<`string`, `string` \| `number` \| `BigNumber`\> |
| `signature` | `string` |
| `authorityAddress` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[MasaModuleBase](MasaModuleBase.md).[verify](MasaModuleBase.md#verify)