/**
 * @author valor.
 */

let jobName = 'global';
browser.alarms.create(jobName, { periodInMinutes: 1 });
browser.alarms.onAlarm.addListener(suspend);

function suspend() {

    browser
        .storage
        .sync
        .get()
        /* see `storage.js` */
        .then((value) => {

            let now = (new Date()).getTime();

            browser
                .tabs
                .query({
                    url: ["http://*/*", "https://*/*"],
                })
                .then((tabs) => {

                    for (let tab of tabs) {

                        let skip = false;

                        // check pass list
                        if (value.pass && value.pass.length > 0) {
                            for (let filter of value.pass) {
                                let result = checkRegExp(tab.url, filter.substring(1, filter.length - 1));
                                if (result) {
                                    // hit pass list
                                    skip = true;
                                    break;
                                }
                            }
                        }

                        // hit pass list
                        if (skip) {
                            continue;
                        }

                        if (now - tab.lastAccessed > value.time.mins * 60000) {
                            // do suspend
                            let _url = '/suspended.html' +
                                '?ttl=' + tab.title +
                                '&uri=' + tab.url;
                            browser.tabs.update(tab.id, { url: _url });
                        }
                    }
                });
        });
}

function checkRegExp(str, filter) {
    try {
        let reg = new RegExp(filter);
        return reg.test(str);
    } catch (e) {
        return false;
    }
}
