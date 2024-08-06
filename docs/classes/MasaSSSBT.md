[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / MasaSSSBT

# Class: MasaSSSBT

## Extends

- `MasaBase`

## Constructors

### new MasaSSSBT()

> **new MasaSSSBT**(`masa`): [`MasaSSSBT`](MasaSSSBT.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Returns

[`MasaSSSBT`](MasaSSSBT.md)

#### Inherited from

`MasaBase.constructor`

## Properties

### masa

> `protected` `readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

`MasaBase.masa`

## Methods

### attach()

> **attach**\<`Contract`\>(`contract`): [`MasaSSSBTWrapper`](MasaSSSBTWrapper.md)\<`Contract`\>

#### Type Parameters

• **Contract** *extends* `ReferenceSBTSelfSovereign`

#### Parameters

• **contract**: `Contract`

#### Returns

[`MasaSSSBTWrapper`](MasaSSSBTWrapper.md)\<`Contract`\>

***

### connect()

> **connect**\<`Contract`\>(`address`, `factory`): `Promise`\<[`MasaSSSBTWrapper`](MasaSSSBTWrapper.md)\<`Contract`\>\>

#### Type Parameters

• **Contract** *extends* `ReferenceSBTSelfSovereign`

#### Parameters

• **address**: `string`

• **factory**: [`ContractFactory`](ContractFactory.md) = `ReferenceSBTSelfSovereign__factory`

#### Returns

`Promise`\<[`MasaSSSBTWrapper`](MasaSSSBTWrapper.md)\<`Contract`\>\>
