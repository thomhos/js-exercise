const checkOptionalProps = require('./optional-props')
const getPropType = require('./prop-type')

class InterfaceExtractor {
    /* Define the cache objects */
    constructor() {
        this.interfaces = {}
        this.interfaceBlueprints = {}
    }

    /* expose a method to start the extract process */
    go(data) {
        if(data.length) {
            return this.extractFromArray(data)
        } else {
            return this.extractFromObject(data)
        }
    }

    extractFromArray(data) {        
        /* Extract the interface from an array */
        data.forEach(obj => this.extract(null, obj))

        return this.interfaces
    }

    extractFromObject(data) {
        /* Extract the interface from an object */
        this.extract(null, data)

        return this.interfaces
    }

    extract(key, obj) {
        /* Define the interface name, based on the key. Root if no key provided */
        key = key || 'root'
        const interfaceName = this.createInterfaceName(key)
        const interfaceDefinition = this.defineInterface(obj)
        let interfaceBlueprint = null

        /* Check if we already have an interface with this name */
        if (this.interfaces[interfaceName]) {

            /* An interface with this name already exists, If there are props that arent the same (both old and new) These should be marked optional */
            this.interfaces[interfaceName] = checkOptionalProps(this.interfaces[interfaceName], interfaceDefinition)

            /* We can use the properties to set a blueprint */
            interfaceBlueprint = this.createInterfaceBlueprint(this.interfaces[interfaceName])
            this.interfaceBlueprints[interfaceBlueprint] = interfaceName

        } else {
            interfaceBlueprint = this.createInterfaceBlueprint(interfaceDefinition)
            const knownBlueprint = this.interfaceBlueprints[interfaceBlueprint] || null

            if(!knownBlueprint) {
                /* If the new interface doesn't exist we can assign it */
                this.interfaces[interfaceName] = interfaceDefinition
            }
        }

        /* Return only the name of the interface, so we can recursively call this function to set the propType */
        return interfaceName
    }

    defineInterface(obj) {
        /* Define the object that will hold all propTypes */
        const interfaceDefinition = {}

        /* Loop over the props in the object */
        for (let k in obj) {
            /* Get the property type */
            let propType = getPropType(obj[k])

            /* If it's an object, we need to extract it's interface */
            if(propType === 'object') {
                propType = this.extract(k, obj[k])
            }

            /* After defining the propTypes, create an interface definition */
            interfaceDefinition[k] = {
                type: propType,
                optional: false
            }
        }

        /* Return the new interface */
        return interfaceDefinition
    }

    createInterfaceName(name) {
        return 'I' + name.charAt(0).toUpperCase() + name.slice(1);
    }

    createInterfaceBlueprint(obj) {
        return Object.keys(obj).map(k => k.toLowerCase()).sort().join('_')
    }
}

module.exports = InterfaceExtractor