/* All props that aren't present on both interfaces will be marked optional */
function checkOptionalProps(currentInterface, newInterface) {

    /* Loop over current interface, check for existance of prop on new interface */
    for ( let k in currentInterface ) {
        if (newInterface[k]) {
            /* The property exists but is not of same type. We should mark it as 'any' */
            if(newInterface[k].type !== currentInterface[k].type) {
                currentInterface[k].type = 'any'
            }
        } else {
            /* Property is not present in the newInterface, so it's optional */
            currentInterface[k].optional = true
        }
    }

    /* Loop over current interface, check for existance of prop on new interface */
    for ( let k in newInterface ) {
        if (currentInterface[k]) {
            /* The property exists but is not of same type. We should mark it as 'any' */
            if(currentInterface[k].type !== newInterface[k].type) {
                currentInterface[k].type = 'any'
            }
        } else {
            /* Property is not present in the newInterface, so it's optional */
            currentInterface[k] = newInterface[k]
            currentInterface[k].optional = true
        }
    }

    /* return the interface with props marked optional */
    return currentInterface
}

module.exports = checkOptionalProps