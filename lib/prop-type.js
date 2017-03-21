const typeCheck = require('./type-check')

/* Return the type for the given input */
function getPropType(prop) {
    if (typeCheck.isString(prop)) {
        return 'string'
    } else if (typeCheck.isNumber(prop)) {
        return 'number'
    } else if (typeCheck.isBool(prop)) {
        return 'boolean'
    } else if (typeCheck.isArray(prop)) {
        return 'any[]'
    } else if (typeCheck.isObject(prop)) {
        return 'object'
    } else {
        return 'any'
    }
}

module.exports = getPropType