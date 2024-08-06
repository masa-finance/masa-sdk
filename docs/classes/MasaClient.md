[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / MasaClient

# Class: MasaClient

## Extends

- `MasaBase`

## Constructors

### new MasaClient()

> **new MasaClient**(`__namedParameters`): [`MasaClient`](MasaClient.md)

#### Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.apiUrl**: `string`

• **\_\_namedParameters.cookie?**: `string`

• **\_\_namedParameters.masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Returns

[`MasaClient`](MasaClient.md)

#### Overrides

`MasaBase.constructor`

## Properties

### masa

> `protected` `readonly` **masa**: [`MasaInterface`](../interfaces/MasaInterface.md)

#### Inherited from

`MasaBase.masa`

***

### session

> **session**: `object`

#### check()

> **check**: () => `Promise`\<`undefined` \| [`ISession`](../interfaces/ISession.md)\>

Check session is still alive

##### Returns

`Promise`\<`undefined` \| [`ISession`](../interfaces/ISession.md)\>

#### checkSignature()

> **checkSignature**: (`address`, `signature`, `cookie`?) => `Promise`\<`undefined` \| [`SessionUser`](../interfaces/SessionUser.md)\>

##### Parameters

• **address**: `string`

• **signature**: `string`

• **cookie?**: `string`

##### Returns

`Promise`\<`undefined` \| [`SessionUser`](../interfaces/SessionUser.md)\>

#### getChallenge()

> **getChallenge**: () => `Promise`\<`undefined` \| [`ChallengeResultWithCookie`](../interfaces/ChallengeResultWithCookie.md)\>

Get challenge

##### Returns

`Promise`\<`undefined` \| [`ChallengeResultWithCookie`](../interfaces/ChallengeResultWithCookie.md)\>

#### logout()

> **logout**: () => `Promise`\<`undefined` \| [`LogoutResult`](../interfaces/LogoutResult.md)\>

Logout the current user

##### Returns

`Promise`\<`undefined` \| [`LogoutResult`](../interfaces/LogoutResult.md)\>

## Accessors

### cookie

> `get` **cookie**(): `undefined` \| `string`

#### Returns

`undefined` \| `string`

## Methods

### get()

> **get**\<`Result`\>(`endpoint`, `silent`): `Promise`\<`object`\>

#### Type Parameters

• **Result**

#### Parameters

• **endpoint**: `string`

• **silent**: `boolean` = `false`

#### Returns

`Promise`\<`object`\>

##### data

> **data**: `undefined` \| `Result`

##### status

> **status**: `undefined` \| `number`

##### statusText

> **statusText**: `undefined` \| `string`

***

### patch()

> **patch**\<`Request`, `Result`\>(`endpoint`, `data`, `silent`): `Promise`\<`object`\>

#### Type Parameters

• **Request**

• **Result**

#### Parameters

• **endpoint**: `string`

• **data**: `Request`

• **silent**: `boolean` = `false`

#### Returns

`Promise`\<`object`\>

##### data

> **data**: `undefined` \| `Result`

##### status

> **status**: `undefined` \| `number`

##### statusText

> **statusText**: `undefined` \| `string`

***

### post()

> **post**\<`Request`, `Result`\>(`endpoint`, `data`, `silent`): `Promise`\<`object`\>

#### Type Parameters

• **Request**

• **Result**

#### Parameters

• **endpoint**: `string`

• **data**: `Request`

• **silent**: `boolean` = `false`

#### Returns

`Promise`\<`object`\>

##### data

> **data**: `undefined` \| `Result`

##### status

> **status**: `undefined` \| `number`

##### statusText

> **statusText**: `undefined` \| `string`
