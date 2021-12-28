/**
 * @author valor.
 */

// check whether the URL matched regular
function checkRegExp(url, rule) {
    try {
        let reg = new RegExp(rule);
        return reg.test(url);
    } catch (e) {
        return false;
    }
}

// cut a string if it exceeds the specified length
function cutString(str, length) {
    if (!str) {
        return str;
    }
    if (length < 4) {
        return '...';
    }
    if (str.length <= length) {
        return str;
    }
    return str.substring(0, length - 3) + '...';
}
