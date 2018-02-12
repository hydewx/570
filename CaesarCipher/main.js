var key = 5;
var n = 0;
var fs = require('fs');
var result = '';

fs.readFile('message.txt', 'utf8', (e, data) => {
    if (e) {
        throw e;
    }
    for (var c of data) {
        var charCode = c.charCodeAt(0);
        if (charCode >= 97 && charCode <= 122) {
            charCode -= key;
            if (charCode < 97) {
                charCode += 26;
            }
        }
        if (charCode >= 65 && charCode <= 90) {
            charCode -= key;
            if (charCode < 64) {
                charCode += 26;
            }
        }

        if (n % 3 == 2) {
            key += 2;
            key %= 26;
        }
        n++;
        result += String.fromCharCode(charCode);

    }
    console.log('The name of the file to be decrypted is <message.txt>');
    console.log('The decrypted message is: ' + result);
    writeFile('solution.txt', result);
    console.log('The decrypted message has been written into <solution.txt>');
});

function writeFile(name, data) {
    fs.writeFile(name, data, (e) => {
        if (e) {
            throw e;
        }
    });
}