/**
 * @author valor.
 */

 let _selectTimes = {
    "minutes": {
        "1": "1 min",
        "5": "5 mins",
        "10": "10 mins",
        "15": "15 mins",
        "30": "30 mins",
        "45": "45 mins",
    },
    "hours": {
        "60": "1 hour",
        "120": "2 hours",
        "240": "4 hours",
        "360": "6 hours",
    }
}

let _selectCtlKey = {
    "": {
        "0": "-",
    },
    "Win/Linux": {
        "1": "Ctrl",
    },
    "Mac": {
        "2": "Command"
    }
}

let _selectSftKey = {
    "": {
        "0": "-",
        "1": "Shift",
    }
}

let _selectCusKey = {
    "Space": {
        "Space": "Space",
    },
    "Digit": {
        "Digit0": "0",
        "Digit1": "1",
        "Digit2": "2",
        "Digit3": "3",
        "Digit4": "4",
        "Digit5": "5",
        "Digit6": "6",
        "Digit7": "7",
        "Digit8": "8",
        "Digit9": "9",
    },
    "Key": {
        "KayA": "A",
        "KeyB": "B",
        "KeyC": "C",
        "KeyD": "D",
        "KeyE": "E",
        "KeyF": "F",
        "KeyG": "G",
        "KeyH": "H",
        "KeyI": "I",
        "KeyJ": "J",
        "KeyK": "K",
        "KeyL": "L",
        "KeyM": "M",
        "KeyN": "N",
        "KeyO": "O",
        "KeyP": "P",
        "KeyQ": "Q",
        "KeyR": "R",
        "KeyS": "S",
        "KeyT": "T",
        "KeyU": "U",
        "KeyV": "V",
        "KeyW": "W",
        "KeyX": "X",
        "KeyY": "Y",
        "KeyZ": "Z",
    }
}

function genSelectElems(data, defaultValue=undefined) {
    let elem = ""

    for (let grp in data) {
        if (grp) {
            elem += `<optgroup label="${grp}">`
        }

        let opts = data[grp]
        for (let k in opts) {
            if (k === defaultValue) {
                elem += `<option value="${k}" selected>${opts[k]}</option>`
            } else {
                elem += `<option value="${k}">${opts[k]}</option>`
            }
        }

        if (grp) {
            elem += `</optgroup>`
        }
    }
    return elem
}

let timeSelect = document.getElementById('timeSelect');

let rules = document.getElementById('rules');
let testRules = document.getElementById('testRules');
let testResult = document.getElementById('testResult');

let ctlKey = document.getElementById('ctlKey');
let sftKey = document.getElementById('sftKey');
let cusKey = document.getElementById('cusKey');

document.addEventListener('DOMContentLoaded', () => {
    chrome.storage.sync.get((value) => {
        // times
        let _mins = "45"
        if (value['mins']) {
            _mins = value['mins']
        }
        timeSelect.innerHTML = genSelectElems(_selectTimes, _mins)

        // keycode
        let _ctlKey = "0"
        if (value['ctlKey']) {
            _ctlKey = value['ctlKey']
        }
        ctlKey.innerHTML = genSelectElems(_selectCtlKey, _ctlKey)

        let _sftKey = "0"
        if (value['sftKey']) {
            _sftKey = value['sftKey']
        }
        sftKey.innerHTML = genSelectElems(_selectSftKey, _sftKey)

        let _cusKey = "Space"
        if (value['cusKey']) {
            _cusKey = value['cusKey']
        }
        cusKey.innerHTML = genSelectElems(_selectCusKey, _cusKey)

        // rules
        let _rules = []
        if (value['rules']) {
            _rules = value['rules']
        }
        rules.value = _rules.join('\n')
    });
});

timeSelect.addEventListener('change', () => {
    let _index = timeSelect.selectedIndex;
    let _value = timeSelect.options[_index].value;

    chrome.storage.sync.set({mins: _value});
});

ctlKey.addEventListener('change', () => {
    let _index = ctlKey.selectedIndex;
    let _value = ctlKey.options[_index].value;

    chrome.storage.sync.set({ctlKey: _value});
});

sftKey.addEventListener('change', () => {
    let _index = sftKey.selectedIndex;
    let _value = sftKey.options[_index].value;

    chrome.storage.sync.set({sftKey: _value});
});

cusKey.addEventListener('change', () => {
    let _index = cusKey.selectedIndex;
    let _value = cusKey.options[_index].value;

    chrome.storage.sync.set({cusKey: _value});
});

rules.addEventListener('blur', () => {
    let _list = [];

    if (rules.value) {
        _list = rules.value.split(/\r\n|\r|\n/);
    }
    chrome.storage.sync.set({rules: _list});
});

testRules.addEventListener('click', () => {
    if (!rules.value) {
        testResult.innerHTML = MatchedSpan;
        return;
    }
    let list = rules.value.split(/\r\n|\r|\n/);
    if (!list) {
        testResult.innerHTML = MatchedSpan;
        return;
    }

    chrome.tabs.query({
        // query all tabs
    }, (tabs) => {
        if (!tabs) {
            // no tabs
            testResult.innerHTML = MatchedSpan;
        } else {

            let html = ``;

            for (let tab of tabs) {
                for (let rule of list) {
                    let res = checkRegExp(tab.url, rule);
                    if (res) {
                        // matched
                        html += (getHitTabUrlTag(tab.url));
                        break;
                    }
                }
            }

            testResult.innerHTML = `${MatchedSpan}<ul>${html}</ul>`;
        }
    });
});

let MatchedSpan = `<span>Passed tabs:</span>`;

function getHitTabUrlTag(url) {
    if (!url) {
        return '';
    }

    let maxLength = 50;

    if (url.length > maxLength) {
        return `<li><i title="${url}">${cutString(url, maxLength)}</i></li>`;
    }
    return `<li><i>${url}</i></li>`;
}
