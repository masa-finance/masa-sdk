[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / MasaIdentity

# Class: MasaIdentity

## Extends

- `MasaLinkable`\<`SoulboundIdentity`\>

## Constructors

### new MasaIdentity()

> **new MasaIdentity**(`masa`): [`MasaIdentity`](MasaIdentity.md)

#### Parameters

• **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Returns

[`MasaIdentity`](MasaIdentity.md)

#### Overrides

`MasaLinkable<SoulboundIdentity>.constructor`

## Properties

### contract

> `readonly` **contract**: `SoulboundIdentity`

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

#### Inherited from

`MasaLinkable.isContractAvailable`

## Methods

### burn()

> **burn**(): `Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

#### Returns

`Promise`\<[`BaseResult`](../interfaces/BaseResult.md)\>

***

### load()

> **load**(`address`?): `Promise`\<`object`\>

#### Parameters

• **address?**: `string`

#### Returns

`Promise`\<`object`\>

##### address

> **address**: `string`

##### identityId?

> `optional` **identityId**: `BigNumber`

***

### show()

> **show**(`address`?): `Promise`\<`undefined` \| [`IdentityDetails`](../interfaces/IdentityDetails.md)\>

#### Parameters

• **address?**: `string`

#### Returns

`Promise`\<`undefined` \| [`IdentityDetails`](../interfaces/IdentityDetails.md)\>
