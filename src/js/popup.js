/**
 * @author valor.
 */

let timeSelect = document.getElementById('timeSelect');
let rules = document.getElementById('rules');
let testRules = document.getElementById('testRules');
let testResult = document.getElementById('testResult');

let ctlKey = document.getElementById('ctlKey');
let sftKey = document.getElementById('sftKey');
let cusKey = document.getElementById('cusKey');

document.addEventListener('DOMContentLoaded', () => {

    chrome.storage.sync.get((value) => {
        let _index = 5;
        let _rules = [];

        if (value.index >= 0) {
            _index = value.index;
        }
        if (value.rules) {
            _rules = value.rules;
        }

        timeSelect.selectedIndex = _index;
        rules.value = _rules.join('\n');

        // keycode
        let _ctlIndex = 0;
        let _sftIndex = 0;
        let _cusIndex = 0;

        if (value.ctlIndex >= 0) {
            _ctlIndex = value.ctlIndex;
        }
        if (value.sftIndex >= 0) {
            _sftIndex = value.sftIndex;
        }
        if (value.cusIndex >= 0) {
            _cusIndex = value.cusIndex;
        }

        ctlKey.selectedIndex = _ctlIndex;
        sftKey.selectedIndex = _sftIndex;
        cusKey.selectedIndex = _cusIndex;
    });
});

timeSelect.addEventListener('change', () => {
    let _index = timeSelect.selectedIndex;
    let _value = timeSelect.options[_index].value;

    chrome.storage.sync.set({
        index: _index,
        mins: _value,
    });
});

ctlKey.addEventListener('change', () => {
    let _index = ctlKey.selectedIndex;
    let _value = ctlKey.options[_index].value;

    chrome.storage.sync.set({
        ctlIndex: _index,
        ctlKey: _value,
    });
});

sftKey.addEventListener('change', () => {
    let _index = sftKey.selectedIndex;
    let _value = sftKey.options[_index].value;

    chrome.storage.sync.set({
        sftIndex: _index,
        sftKey: _value,
    });
});

cusKey.addEventListener('change', () => {
    let _index = cusKey.selectedIndex;
    let _value = cusKey.options[_index].value;

    chrome.storage.sync.set({
        cusIndex: _index,
        cusKey: _value,
    });
});

rules.addEventListener('blur', () => {
    let _list = [];

    if (rules.value) {
        _list = rules.value.split(/\r\n|\r|\n/);
    }
    chrome.storage.sync.set({
        rules: _list
    });
});

testRules.addEventListener('click', () => {
    if (!rules.value) {
        testResult.innerHTML = NoMatchSpan;
        return;
    }
    let list = rules.value.split(/\r\n|\r|\n/);
    if (!list) {
        testResult.innerHTML = NoMatchSpan;
        return;
    }

    chrome.tabs.query({
        // query all tabs
    }, (tabs) => {
        if (!tabs) {
            // no tabs
            testResult.innerHTML = NoMatchSpan;
        } else {

            let html = ``;

            for (let tab of tabs) {
                for (let rule of list) {
                    let res = checkRegExp(tab.url, rule.substring(1, rule.length - 1));
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

let NoMatchSpan = `<span>There are no tabs that match the current pass rule(s).</span>`;
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
