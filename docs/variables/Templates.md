[**Masa SDK v4.2.0**](../README.md) • **Docs**

***

[Masa SDK v4.2.0](../globals.md) / Templates

# Variable: Templates

> `const` **Templates**: `object`

## Type declaration

### loginTemplate()

> **loginTemplate**: (`challenge`, `expires`) => `string`

The Masa Finance Login Template used for authenticating with masa-express

#### Parameters

• **challenge**: `string`

The challenge received from the login process

• **expires**: `string`

The session expiration date received from the login process

#### Returns

`string`

### loginTemplateNext()

> **loginTemplateNext**: (`challenge`, `expires`) => `string`

The Masa Finance Login rotation Template used for authenticating with masa-express

#### Parameters

• **challenge**: `string`

The challenge received from the login process

• **expires**: `string`

The session expiration date received from the login process

#### Returns

`string`
