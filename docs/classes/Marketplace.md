[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / Marketplace

# Class: Marketplace

## Extends

- `MasaContractModuleBase`

## Constructors

### new Marketplace()

> **new Marketplace**(`masa`, `instances`): [`Marketplace`](Marketplace.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

• **instances**: [`IIdentityContracts`](../interfaces/IIdentityContracts.md)

#### Returns

[`Marketplace`](Marketplace.md)

#### Inherited from

`MasaContractModuleBase.constructor`

## Properties

### instances

> `protected` **instances**: [`IIdentityContracts`](../interfaces/IIdentityContracts.md)

#### Inherited from

`MasaContractModuleBase.instances`

***

### masa

> `protected` `readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

`MasaContractModuleBase.masa`

## Methods

### createOverrides()

> `protected` **createOverrides**(`value`?): `Promise`\<`PayableOverrides`\>

#### Parameters

• **value?**: `BigNumber`

#### Returns

`Promise`\<`PayableOverrides`\>

#### Inherited from

`MasaContractModuleBase.createOverrides`

***

### estimateGasWithSlippage()

> `protected` **estimateGasWithSlippage**(`estimateGas`, `args`?, `overrides`?): `Promise`\<`BigNumber`\>

#### Parameters

• **estimateGas**

• **args?**: `unknown`[]

• **overrides?**: `PayableOverrides`

#### Returns

`Promise`\<`BigNumber`\>

#### Inherited from

`MasaContractModuleBase.estimateGasWithSlippage`

***

### formatPrice()

> `protected` **formatPrice**(`paymentAddress`, `price`): `Promise`\<`string`\>

#### Parameters

• **paymentAddress**: `string`

• **price**: `BigNumber`

#### Returns

`Promise`\<`string`\>

#### Inherited from

`MasaContractModuleBase.formatPrice`

***

### getNetworkFeeInformation()

> `protected` **getNetworkFeeInformation**(): `Promise`\<`undefined` \| `FeeData`\>

#### Returns

`Promise`\<`undefined` \| `FeeData`\>

#### Inherited from

`MasaContractModuleBase.getNetworkFeeInformation`

***

### verify()

> `protected` **verify**(`errorMessage`, `contract`, `domain`, `types`, `value`, `signature`, `authorityAddress`): `Promise`\<`void`\>

verify a signature created during one of the SBT signing flows

#### Parameters

• **errorMessage**: `string`

• **contract**: `SoulLinker` \| `SoulStore` \| `MasaSBT` \| `MasaSBTSelfSovereign` \| `MasaSBTAuthority`

• **domain**: `TypedDataDomain`

• **types**: `Record`\<`string`, `TypedDataField`[]\>

• **value**: `Record`\<`string`, `string` \| `number` \| `boolean` \| `BigNumber`\>

• **signature**: `string`

• **authorityAddress**: `string`

#### Returns

`Promise`\<`void`\>

#### Inherited from

`MasaContractModuleBase.verify`

***

### addSlippage()

> `protected` `static` **addSlippage**(`price`, `slippage`): `BigNumber`

adds a percentage to the price as slippage

#### Parameters

• **price**: `BigNumber`

• **slippage**: `number`

#### Returns

`BigNumber`

#### Inherited from

`MasaContractModuleBase.addSlippage`
