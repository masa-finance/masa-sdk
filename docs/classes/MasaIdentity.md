[# Masa SDK
 - v3.14.4](../README.md) / [Exports](../modules.md) / MasaIdentity

# Class: MasaIdentity

## Hierarchy

- `MasaBase`

  ↳ **`MasaIdentity`**

## Table of contents

### Constructors

- [constructor](MasaIdentity.md#constructor)

### Properties

- [masa](MasaIdentity.md#masa)

### Methods

- [burn](MasaIdentity.md#burn)
- [create](MasaIdentity.md#create)
- [createWithSoulName](MasaIdentity.md#createwithsoulname)
- [load](MasaIdentity.md#load)
- [show](MasaIdentity.md#show)

## Constructors

### constructor

• **new MasaIdentity**(`masa`): [`MasaIdentity`](MasaIdentity.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `masa` | [`MasaInterface`](../interfaces/MasaInterface.md) |

#### Returns

[`MasaIdentity`](MasaIdentity.md)

#### Inherited from

MasaBase.constructor

## Properties

### masa

• `Protected` `Readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

MasaBase.masa

## Methods

### burn

▸ **burn**(): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

___

### create

▸ **create**(): `Promise`\<[`BaseResultWithTokenId`](../interfaces/BaseResultWithTokenId.md)\>

#### Returns

`Promise`\<[`BaseResultWithTokenId`](../interfaces/BaseResultWithTokenId.md)\>

___

### createWithSoulName

▸ **createWithSoulName**(`paymentMethod`, `soulName`, `duration`, `style?`): `Promise`\<\{ `identityId?`: `string` \| `BigNumber`  } & [`CreateSoulNameResult`](../interfaces/CreateSoulNameResult.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `paymentMethod` | [`PaymentMethod`](../modules.md#paymentmethod) |
| `soulName` | `string` |
| `duration` | `number` |
| `style?` | `string` |

#### Returns

`Promise`\<\{ `identityId?`: `string` \| `BigNumber`  } & [`CreateSoulNameResult`](../interfaces/CreateSoulNameResult.md)\>

___

### load

▸ **load**(`address?`): `Promise`\<\{ `address`: `string` ; `identityId?`: `BigNumber`  }\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

#### Returns

`Promise`\<\{ `address`: `string` ; `identityId?`: `BigNumber`  }\>

___

### show

▸ **show**(`address?`): `Promise`\<`undefined` \| [`IdentityDetails`](../interfaces/IdentityDetails.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `address?` | `string` |

#### Returns

`Promise`\<`undefined` \| [`IdentityDetails`](../interfaces/IdentityDetails.md)\>
