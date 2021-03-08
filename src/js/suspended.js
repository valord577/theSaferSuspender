/**
 * @author valor.
 */

let icon = document.getElementById('icon');
let title = document.getElementById('title');

let ttl = document.getElementById('ttl');
let url = document.getElementById('url');
let addOn = document.getElementById('addOn');

let _ttl_limit = 64;
let _url_limit = 128;

document.addEventListener('DOMContentLoaded', () => {
    let params = getQueryVariable();
    if (!params.flag) {
        return;
    }
    // stored tab's id
    let key = params.flag;

    chrome.storage.local.get(`${key}`, (res) => {
        let _ttl = 'Suspended';
        let _url = '';
        let _icon = '/icons/ic_suspender_707070_128x128.svg';

        if (res && res[key]) {
            if (res[key].ttl) {
                _ttl = decodeURIComponent(res[key].ttl);
            }
            if (res[key].url) {
                _url = res[key].url;
            }
            if (res[key].icon) {
                _icon = res[key].icon;
            }
        }

        icon.href = _icon;
        title.innerText = _ttl;

        if (_ttl.length > _ttl_limit) {
            ttl.setAttribute('title', _ttl);
            ttl.innerText = cutString(_ttl, _ttl_limit);
        } else {
            ttl.innerText = _ttl;
        }

        if (_url.length > _url_limit) {
            url.setAttribute('title', _url)
            url.innerText = cutString(_url, _url_limit);
        } else {
            url.innerText = _url;
        }
    });
});

function getQueryVariable() {

    let params = {};

    let query = window.location.search.substring(1);
    if (!query) {
        return params;
    }

    let vars = query.split('&');
    for (let pair of vars) {
        if (!pair) {
            continue;
        }

        let pos = pair.indexOf('=');
        if (pos === 0) {
            continue;
        }
        if (pos < 0) {
            params[pair] = undefined;
            continue;
        }

        params[pair.substring(0, pos)] = pair.substring(pos + 1);
    }

    return params;
}

url.addEventListener('click', () => {
    window.history.back();
});

addOn.addEventListener('click', () => {
    let manifest = chrome.runtime.getManifest();
    window.open(manifest.homepage_url, '_blank');
});

// add the listener of shortcuts for restoring the suspended tab
document.addEventListener('keydown', (event) => {
    chrome.storage.sync.get((value) => {
        // keycode
        let _ctlKey = "0";
        let _sftKey = "0";
        let _cusKey = "Space";

        if (value['ctlKey'] && value['ctlKey'] !== "0") {
            _ctlKey = value['ctlKey'];
        }
        if (value['sftKey'] && value['sftKey'] !== "0") {
            _sftKey = value['sftKey'];
        }
        if (value['cusKey']) {
            _cusKey = value['cusKey'];
        }

        let step = 0;

        // step 1 - check `Ctrl` or `Command`
        if (_ctlKey === "0") {
            step++;
        } else if (_ctlKey === "1") {
            if (event.ctrlKey) {
                step++;
            }
        } else if (_ctlKey === "2") {
            if (event.metaKey) {
                step++;
            }
        }

        // step 2 - check `Shift`
        if (_sftKey === "0") {
            step++;
        } else if (_sftKey === "1") {
            if (event.shiftKey) {
                step++;
            }
        }

        // step 3 - check custom keycode
        if (_cusKey === event.code) {
            step++;
        }

        // go back
        if (step === 3) {
            url.click();
        }
    });
});
