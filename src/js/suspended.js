/**
 * @author valor.
 */

let title = document.getElementById('title');
let ttl = document.getElementById('ttl');
let url = document.getElementById('url');
let addOn = document.getElementById('addOn');

document
    .addEventListener(
        'DOMContentLoaded',
        function () {
            // set title, url
            let query = getQueryVariable();
            title.innerText = decodeURIComponent(query.ttl);
            ttl.innerText = decodeURIComponent(query.ttl);
            url.innerText = query.uri;
        }
    );

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

        let key = pair.substring(0, pos);
        let value = pair.substring(pos + 1);
        params[key] = value;
    }

    return params;
}

url.addEventListener('click',
    function () {
        window.history.back();
    });

addOn.addEventListener('click',
    function () {
        let manifest = browser.runtime.getManifest();
        window.open(manifest.homepage_url, '_blank');
    });
