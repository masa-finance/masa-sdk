[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / signTypedData

# Function: signTypedData()

> **signTypedData**(`__namedParameters`): `Promise`\<`object`\>

## Parameters

• **\_\_namedParameters**

• **\_\_namedParameters.contract**: `BaseContract` \| `EIP712`

• **\_\_namedParameters.name?**: `string`

• **\_\_namedParameters.signer**: `Signer`

• **\_\_namedParameters.types**: `Record`\<`string`, `TypedDataField`[]\>

• **\_\_namedParameters.value**: `Record`\<`string`, `string` \| `number` \| `boolean` \| `BigNumber`\>

## Returns

`Promise`\<`object`\>

### domain

> **domain**: `TypedDataDomain`

### signature

> **signature**: `string`
