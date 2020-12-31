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
        .then((value) => {

            /*
             * {
             *   "time": {
             *     "mins": 45,  // time(s) for `auto` suspend tabs
             *     "index": 0
             *   },
             *
             *   "pass": []  // Pass list for `never` suspend tabs
             * }
             */

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

                        // check last accessed
                        let mins = 45;
                        if (value.time && value.time.mins) {
                            mins = value.time.mins;
                        }

                        if (now - tab.lastAccessed > mins * 60000) {
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
