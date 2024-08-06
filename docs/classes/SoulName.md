[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / SoulName

# Class: SoulName

## Extends

- `MasaContractModuleBase`

## Constructors

### new SoulName()

> **new SoulName**(`masa`, `instances`): [`SoulName`](SoulName.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

• **instances**: [`IIdentityContracts`](../interfaces/IIdentityContracts.md)

#### Returns

[`SoulName`](SoulName.md)

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

***

### types

> `readonly` **types**: `Record`\<`string`, `TypedDataField`[]\>

## Methods

### burn()

> **burn**(`soulName`): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

#### Parameters

• **soulName**: `string`

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

***

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

### getSoulnameData()

> **getSoulnameData**(`soulName`): `Promise`\<`object`\>

Returns detailed information for a soul name

#### Parameters

• **soulName**: `string`

#### Returns

`Promise`\<`object`\>

##### exists

> **exists**: `boolean`

##### tokenId

> **tokenId**: `BigNumber`

***

### renew()

> **renew**(`soulName`, `years`): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

#### Parameters

• **soulName**: `string`

• **years**: `number`

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

***

### transfer()

> **transfer**(`soulName`, `receiver`): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

#### Parameters

• **soulName**: `string`

• **receiver**: `string`

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

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
