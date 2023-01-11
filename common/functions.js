const _ = require("lodash");
const { nanoid, customAlphabet } = require("nanoid");

module.exports.generateString = (length) => nanoid(length);
// module.exports.generateNumber = (length) => "12345" || customAlphabet("1234567890", length)();

module.exports.generateCustom = (length, charset) => customAlphabet(charset, length)();

module.exports.niceMessage = (str) => {
    if (typeof str === "string" && /^[A-Z_]+$/.test(str)) {
        str = _.lowerCase(str);
        str = _.startCase(str);
    }
    return str;
};

// general functions
module.exports.toHex = (val) => Buffer.from(val, "utf8").toString("hex");
module.exports.toStr = (val) => Buffer.from(val, "hex").toString("utf8");

module.exports.toDecimals = (val, decimal = 2) => {
    const base = Math.pow(10, decimal);
    return Math.round(val * base) / base;
};

module.exports.toObject = (data, key, val) => {
    if (!Array.isArray(data)) throw new Error("INVALID_DATA");
    if (!key || typeof key !== "string") throw new Error("INVALID_KEY");

    const newObj = {};
    if (data.length > 0) {
        for (const item of data) {
            newObj[String(item[key])] = !!val ? item[val] : item;
        }
    }
    return newObj;
};

module.exports.lowercaseAndValues = obj => {
    let lowerCasedObj = {}
    for(let key in obj) {
        if(typeof obj[key] == 'string')
            lowerCasedObj[key] = obj[key].toLowerCase()
        else if( Array.isArray(obj[key]) )
            lowerCasedObj[key] = obj[key].map( item => item.toLowerCase())
        else
            lowerCasedObj[key] = obj[key]
    }
    return lowerCasedObj
};
