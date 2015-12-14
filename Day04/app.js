/**
 * Created by Michael Root on 12/5/2015.
 */
var md5 = require('./md5');

var secret = 'ckczppom',
    hash = '',
    hashNotFound = true,
    desiredPrefix = '000000',
    i = 1;

while (hashNotFound) {
    hash = md5.hash(secret + i);

    if (hash.startsWith(desiredPrefix)) {
        console.log('Hash: ' + hash);
        console.log('Key: ' + secret + i);
        hashNotFound = false;
    }
    i++;
}

