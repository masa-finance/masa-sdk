[# Masa SDK
 - v3.3.0](../README.md) / [Exports](../modules.md) / SSSBT

# Class: SSSBT<Contract\>

## Type parameters

| Name | Type |
| :------ | :------ |
| `Contract` | extends `ReferenceSBTSelfSovereign` |

## Hierarchy

- [`SBT`](SBT.md)<`Contract`\>

  ↳ **`SSSBT`**

## Table of contents

### Constructors

- [constructor](SSSBT.md#constructor)

### Properties

- [instances](SSSBT.md#instances)
- [masa](SSSBT.md#masa)

### Methods

- [attach](SSSBT.md#attach)
- [checkOrGiveAllowance](SSSBT.md#checkorgiveallowance)
- [connect](SSSBT.md#connect)
- [formatPrice](SSSBT.md#formatprice)
- [getMintPrice](SSSBT.md#getmintprice)
- [getPaymentAddress](SSSBT.md#getpaymentaddress)
- [verify](SSSBT.md#verify)
- [wrapper](SSSBT.md#wrapper)
- [addSlippage](SSSBT.md#addslippage)
- [loadSBTContract](SSSBT.md#loadsbtcontract)

## Constructors

### constructor

• **new SSSBT**<`Contract`\>(`masa`, `instances`)

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Contract` | extends `ReferenceSBTSelfSovereign`<`Contract`\> |

#### Parameters

| Name | Type |
| :------ | :------ |
| `masa` | [`MasaInterface`](../interfaces/MasaInterface.md) |
| `instances` | [`IIdentityContracts`](../interfaces/IIdentityContracts.md) |

#### Inherited from

[SBT](SBT.md).[constructor](SBT.md#constructor)

## Properties

### instances

• `Protected` **instances**: [`IIdentityContracts`](../interfaces/IIdentityContracts.md)

#### Inherited from

[SBT](SBT.md).[instances](SBT.md#instances)

___

### masa

• `Protected` `Readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

[SBT](SBT.md).[masa](SBT.md#masa)

## Methods

### attach

▸ **attach**(`sbtContract`): [`SSSBTContractWrapper`](../interfaces/SSSBTContractWrapper.md)<`Contract`\>

attaches the contract function to an existing instances

#### Parameters

| Name | Type |
| :------ | :------ |
| `sbtContract` | `Contract` |

#### Returns

[`SSSBTContractWrapper`](../interfaces/SSSBTContractWrapper.md)<`Contract`\>

#### Overrides

[SBT](SBT.md).[attach](SBT.md#attach)

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

[SBT](SBT.md).[checkOrGiveAllowance](SBT.md#checkorgiveallowance)

___

### connect

▸ **connect**(`address`, `factory?`): `Promise`<[`SBTContractWrapper`](../interfaces/SBTContractWrapper.md)<`Contract`\>\>

loads an sbt instance and connects the contract functions to it

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `address` | `string` | `undefined` |
| `factory` | [`ContractFactory`](ContractFactory.md) | `MasaSBT__factory` |

#### Returns

`Promise`<[`SBTContractWrapper`](../interfaces/SBTContractWrapper.md)<`Contract`\>\>

#### Inherited from

[SBT](SBT.md).[connect](SBT.md#connect)

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

[SBT](SBT.md).[formatPrice](SBT.md#formatprice)

___

### getMintPrice

▸ `Protected` **getMintPrice**(`paymentMethod`, `contract`, `slippage?`): `Promise`<{ `formattedMintFee`: `string` ; `formattedPrice`: `string` ; `formattedProtocolFee`: `string` ; `mintFee`: `BigNumber` ; `paymentAddress`: `string` ; `price`: `BigNumber` ; `protocolFee`: `BigNumber`  }\>

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) | `undefined` |
| `contract` | `MasaSBTSelfSovereign` \| `MasaSBTAuthority` \| `MasaSBT` | `undefined` |
| `slippage` | `undefined` \| `number` | `250` |

#### Returns

`Promise`<{ `formattedMintFee`: `string` ; `formattedPrice`: `string` ; `formattedProtocolFee`: `string` ; `mintFee`: `BigNumber` ; `paymentAddress`: `string` ; `price`: `BigNumber` ; `protocolFee`: `BigNumber`  }\>

#### Inherited from

[SBT](SBT.md).[getMintPrice](SBT.md#getmintprice)

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

[SBT](SBT.md).[getPaymentAddress](SBT.md#getpaymentaddress)

___

### verify

▸ `Protected` **verify**(`errorMessage`, `contract`, `domain`, `types`, `value`, `signature`, `authorityAddress`): `Promise`<`void`\>

verify a signature created during one of the SBT signing flows

#### Parameters

| Name | Type |
| :------ | :------ |
| `errorMessage` | `string` |
| `contract` | `SoulLinker` \| `SoulStore` \| `MasaSBTSelfSovereign` \| `MasaSBTAuthority` \| `MasaSBT` |
| `domain` | `TypedDataDomain` |
| `types` | `Record`<`string`, `TypedDataField`[]\> |
| `value` | `Record`<`string`, `string` \| `number` \| `BigNumber`\> |
| `signature` | `string` |
| `authorityAddress` | `string` |

#### Returns

`Promise`<`void`\>

#### Inherited from

[SBT](SBT.md).[verify](SBT.md#verify)

___

### wrapper

▸ `Protected` **wrapper**(`sbtContract`): [`SSSBTContractWrapper`](../interfaces/SSSBTContractWrapper.md)<`Contract`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `sbtContract` | `Contract` |

#### Returns

[`SSSBTContractWrapper`](../interfaces/SSSBTContractWrapper.md)<`Contract`\>

#### Overrides

[SBT](SBT.md).[wrapper](SBT.md#wrapper)

___

### addSlippage

▸ `Static` `Protected` **addSlippage**(`price`, `slippage`): `BigNumber`

adds a percentage to the price as slippage

#### Parameters

| Name | Type |
| :------ | :------ |
| `price` | `BigNumber` |
| `slippage` | `number` |

#### Returns

`BigNumber`

#### Inherited from

[SBT](SBT.md).[addSlippage](SBT.md#addslippage)

___

### loadSBTContract

▸ `Static` `Protected` **loadSBTContract**<`Contract`\>(`masaConfig`, `address`, `factory`): `Promise`<`Contract`\>

#### Type parameters

| Name | Type |
| :------ | :------ |
| `Contract` | extends `MasaSBTSelfSovereign` \| `MasaSBTAuthority` \| `MasaSBT` |

#### Parameters

| Name | Type |
| :------ | :------ |
| `masaConfig` | [`MasaConfig`](../interfaces/MasaConfig.md) |
| `address` | `string` |
| `factory` | [`ContractFactory`](ContractFactory.md) |

#### Returns

`Promise`<`Contract`\>

#### Inherited from

[SBT](SBT.md).[loadSBTContract](SBT.md#loadsbtcontract)