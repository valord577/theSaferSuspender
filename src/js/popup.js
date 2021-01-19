/**
 * @author valor.
 */

let timeSelect = document.getElementById('timeSelect');
let rules = document.getElementById('rules');
let testRules = document.getElementById('testRules');
let testResult = document.getElementById('testResult');

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
    });
});

timeSelect.addEventListener('change', () => {
    let _index = timeSelect.selectedIndex;
    let _value = timeSelect.options[index].value;

    chrome.storage.sync.set({
        index: _index,
        mins: _value,
    });
});

rules.addEventListener('blur', () => {
    if (!rules.value) {
        return;
    }

    let _list = rules.value.split(/\r\n|\r|\n/);
    if (_list) {
        chrome.storage.sync.set({
            rules: _list
        });
    }
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
