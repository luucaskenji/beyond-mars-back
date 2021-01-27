const { stripHtml } = require('string-strip-html');

const sanitize = array => {
    array.forEach((e, i) => {
        array.splice(i, 1, stripHtml(e).result);
    });

    console.log(array)

    return array;
};

module.exports = sanitize;