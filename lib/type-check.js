/* Methods to test types */

module.exports = {
    isString: function isString(s) {
        return (typeof s === 'string') || s instanceof String
    },

    isNumber: function isNumber(n) {
        return (typeof n === 'number') || n instanceof Number
    },

    isBool: function isBool(b) {
        return b === !!b || b instanceof Boolean
    },

    isArray: function isArray(a) {
        return Array.isArray(a)
    },

    isObject: function isObject(o) {
        return o === Object(o)
    }
}