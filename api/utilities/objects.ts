export function getDefinedValues(obj) {
    const definedValues = {};
    for (const key in obj) {
        if (obj.hasOwnProperty(key) && obj[key] !== undefined) {
            definedValues[key] = obj[key];
        }
    }
    return definedValues;
}