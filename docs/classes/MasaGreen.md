[**Masa SDK v3.40.0**](../README.md) • **Docs**

***

[Masa SDK v3.40.0](../globals.md) / MasaGreen

# Class: MasaGreen

## Extends

- `MasaLinkable`\<`SoulboundGreen`\>

## Constructors

### new MasaGreen()

> **new MasaGreen**(`masa`): [`MasaGreen`](MasaGreen.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Returns

[`MasaGreen`](MasaGreen.md)

#### Overrides

`MasaLinkable<SoulboundGreen>.constructor`

## Properties

### contract

> `readonly` **contract**: `SoulboundGreen`

#### Inherited from

`MasaLinkable.contract`

***

### links

> `readonly` **links**: [`MasaSoulLinker`](MasaSoulLinker.md)

#### Inherited from

`MasaLinkable.links`

***

### masa

> `protected` `readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

`MasaLinkable.masa`

## Accessors

### isContractAvailable

> `get` **isContractAvailable**(): `boolean`

#### Returns

`boolean`

## Methods

### burn()

> **burn**(`greenId`): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

Burns a green

#### Parameters

• **greenId**: `BigNumber`

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

***

### list()

> **list**(`address`?): `Promise`\<[`GreenDetails`](../interfaces/GreenDetails.md)[]\>

Lits all greens on the current network

#### Parameters

• **address?**: `string`

#### Returns

`Promise`\<[`GreenDetails`](../interfaces/GreenDetails.md)[]\>

***

### load()

> **load**(`identityIdOrAddress`): `Promise`\<[`GreenDetails`](../interfaces/GreenDetails.md)[]\>

Loads all greens for an identity on the current network

#### Parameters

• **identityIdOrAddress**: `string` \| `BigNumber`

#### Returns

`Promise`\<[`GreenDetails`](../interfaces/GreenDetails.md)[]\>
