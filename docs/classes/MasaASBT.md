[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / MasaASBT

# Class: MasaASBT

## Extends

- `MasaBase`

## Constructors

### new MasaASBT()

> **new MasaASBT**(`masa`): [`MasaASBT`](MasaASBT.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Returns

[`MasaASBT`](MasaASBT.md)

#### Inherited from

`MasaBase.constructor`

## Properties

### masa

> `protected` `readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

`MasaBase.masa`

## Methods

### attach()

> **attach**\<`Contract`\>(`contract`): [`MasaASBTWrapper`](MasaASBTWrapper.md)\<`Contract`\>

#### Type Parameters

• **Contract** *extends* `ReferenceSBTAuthority`

#### Parameters

• **contract**: `Contract`

#### Returns

[`MasaASBTWrapper`](MasaASBTWrapper.md)\<`Contract`\>

***

### connect()

> **connect**\<`Contract`\>(`address`, `factory`): `Promise`\<[`MasaASBTWrapper`](MasaASBTWrapper.md)\<`Contract`\>\>

#### Type Parameters

• **Contract** *extends* `ReferenceSBTAuthority`

#### Parameters

• **address**: `string`

• **factory**: [`ContractFactory`](ContractFactory.md) = `ReferenceSBTAuthority__factory`

#### Returns

`Promise`\<[`MasaASBTWrapper`](MasaASBTWrapper.md)\<`Contract`\>\>
