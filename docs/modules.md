[@masa-finance/masa-sdk](README.md) / Exports

# @masa-finance/masa-sdk

## Table of contents

### Classes

- [Masa](classes/Masa.md)

### Interfaces

- [Addresses](interfaces/Addresses.md)
- [Attribute](interfaces/Attribute.md)
- [ICreditReport](interfaces/ICreditReport.md)
- [IISoulName](interfaces/IISoulName.md)
- [IIdentity](interfaces/IIdentity.md)
- [IIdentityContracts](interfaces/IIdentityContracts.md)
- [LoadContractArgs](interfaces/LoadContractArgs.md)

### Type Aliases

- [PaymentMethod](modules.md#paymentmethod)

### Variables

- [addresses](modules.md#addresses)

### Functions

- [loadIdentityContracts](modules.md#loadidentitycontracts)

## Type Aliases

### PaymentMethod

Ƭ **PaymentMethod**: ``"eth"`` \| ``"weth"`` \| ``"stable"`` \| ``"utility"``

#### Defined in

[src/contracts/contract-service.ts:8](https://github.com/masa-finance/masa-sdk/blob/adcda96/src/contracts/contract-service.ts#L8)

## Variables

### addresses

• `Const` **addresses**: [`Addresses`](interfaces/Addresses.md)

#### Defined in

[src/contracts/index.ts:25](https://github.com/masa-finance/masa-sdk/blob/adcda96/src/contracts/index.ts#L25)

## Functions

### loadIdentityContracts

▸ **loadIdentityContracts**(`__namedParameters`): `Promise`<[`IIdentityContracts`](interfaces/IIdentityContracts.md)\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `__namedParameters` | [`LoadContractArgs`](interfaces/LoadContractArgs.md) |

#### Returns

`Promise`<[`IIdentityContracts`](interfaces/IIdentityContracts.md)\>

#### Defined in

[src/contracts/index.ts:34](https://github.com/masa-finance/masa-sdk/blob/adcda96/src/contracts/index.ts#L34)
