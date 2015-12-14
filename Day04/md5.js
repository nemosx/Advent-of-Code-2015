/**
 * Created by Michael Root on 12/5/2015.
 */
var crypto = require('crypto');

module.exports.hash = function (message) {
    return crypto.createHash('md5').update(message).digest('hex');
};