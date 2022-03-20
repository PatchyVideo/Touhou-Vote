// @ts-check
// https://github.com/homebound-team/graphql-typescript-scalar-type-policies/blob/ec2ccd99acb9a64302d133b9afabb90ec62d5420/src/index.ts

const { isNonNullType, isObjectType, isScalarType } = require('graphql')
const { code, imp } = require('ts-poet')

/** Generates field policies for user-defined types, i.e. Date handling. */
// @type import('@graphql-codegen/plugin-helpers').PluginFunction<Config>
const plugin = async (schema, _, config) => {
  const { scalarTypePolicies = {} } = config || {}

  function isScalarWithTypePolicy(f) {
    let type = f.type
    if (isNonNullType(type)) {
      type = type.ofType
    }
    return isScalarType(type) && scalarTypePolicies[type.name] !== undefined
  }

  const content = await code`
    export default {
      ${Object.values(schema.getTypeMap())
        .filter(isObjectType)
        .filter((t) => !t.name.startsWith('__'))
        .filter((t) => Object.values(t.getFields()).some(isScalarWithTypePolicy))
        .map((type) => {
          return code`${type.name}: { fields: { ${Object.values(type.getFields())
            .filter(isScalarWithTypePolicy)
            .map((field) => {
              let type = field.type
              if (isNonNullType(type)) {
                type = type.ofType
              }
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-ignore
              return code`${field.name}: ${toImp(scalarTypePolicies[type.name])},`
            })} } },`
        })}
    };
  `.toStringWithImports()
  return { content }
}

// Maps the graphql-code-generation convention of `@src/context#Context` to ts-poet's `Context@@src/context`.
function toImp(spec) {
  if (!spec) {
    return undefined
  }
  const [path, symbol] = spec.split('#')
  return imp(`${symbol}@${path}`)
}

module.exports = {
  plugin,
}
