[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / MasaArweave

# Class: MasaArweave

## Extends

- `default`

## Constructors

### new MasaArweave()

> **new MasaArweave**(`config`, `masaConfig`): [`MasaArweave`](MasaArweave.md)

#### Parameters

• **config**: `ApiConfig`

• **masaConfig**: [`MasaConfig`](../interfaces/MasaConfig.md)

#### Returns

[`MasaArweave`](MasaArweave.md)

#### Overrides

`Arweave.constructor`

## Properties

### api

> **api**: `Api`

#### Inherited from

`Arweave.api`

***

### ar

> **ar**: `Ar`

#### Inherited from

`Arweave.ar`

***

### blocks

> **blocks**: `Blocks`

#### Inherited from

`Arweave.blocks`

***

### chunks

> **chunks**: `Chunks`

#### Inherited from

`Arweave.chunks`

***

### network

> **network**: `Network`

#### Inherited from

`Arweave.network`

***

### silo

> **silo**: `Silo`

#### Inherited from

`Arweave.silo`

***

### transactions

> **transactions**: `Transactions`

#### Inherited from

`Arweave.transactions`

***

### wallets

> **wallets**: `Wallets`

#### Inherited from

`Arweave.wallets`

***

### crypto

> `static` **crypto**: `CryptoInterface`

#### Inherited from

`Arweave.crypto`

***

### init()

> `static` **init**: (`apiConfig`) => `Arweave`

#### Parameters

• **apiConfig**: `ApiConfig`

#### Returns

`Arweave`

#### Inherited from

`Arweave.init`

***

### utils

> `static` **utils**: `__module`

#### Inherited from

`Arweave.utils`

## Accessors

### crypto

> `get` **crypto**(): `CryptoInterface`

#### Deprecated

#### Returns

`CryptoInterface`

#### Inherited from

`Arweave.crypto`

***

### utils

> `get` **utils**(): `__module`

#### Deprecated

#### Returns

`__module`

#### Inherited from

`Arweave.utils`

## Methods

### arql()

> **arql**(`query`): `Promise`\<`string`[]\>

#### Parameters

• **query**: `object`

#### Returns

`Promise`\<`string`[]\>

#### Inherited from

`Arweave.arql`

***

### createSiloTransaction()

> **createSiloTransaction**(`attributes`, `jwk`, `siloUri`): `Promise`\<`Transaction`\>

#### Parameters

• **attributes**: `Partial`\<`CreateTransactionInterface`\>

• **jwk**: `JWKInterface`

• **siloUri**: `string`

#### Returns

`Promise`\<`Transaction`\>

#### Inherited from

`Arweave.createSiloTransaction`

***

### createTransaction()

> **createTransaction**(`attributes`, `jwk`?): `Promise`\<`Transaction`\>

#### Parameters

• **attributes**: `Partial`\<`CreateTransactionInterface`\>

• **jwk?**: `JWKInterface` \| `"use_wallet"`

#### Returns

`Promise`\<`Transaction`\>

#### Inherited from

`Arweave.createTransaction`

***

### getConfig()

> **getConfig**(): `Config`

#### Returns

`Config`

#### Inherited from

`Arweave.getConfig`

***

### loadTransactionData()

> **loadTransactionData**(`txId`, `isString`): `Promise`\<`undefined` \| `object` \| `Uint8Array`\>

#### Parameters

• **txId**: `string`

• **isString**: `boolean` = `true`

#### Returns

`Promise`\<`undefined` \| `object` \| `Uint8Array`\>
