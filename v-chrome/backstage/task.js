/**
 * @author valor.
 */

/* -- do something when browser start ----------------------- */

chrome.tabs.query({
    // query all tabs
}, (tabs) => {

    // create alarm
    chrome.storage.sync.get((value) => {
        for (let tab of tabs) {
            setAlarm(tab.id, value['mins']);
        }
    });
});

function setAlarm(tabId, mins) {
    // exclude `chrome.tabs.TAB_ID_NONE`
    if (tabId > 0) {
        // default - do suspend after 45 mins
        let _mins = Number(mins);
        if (!_mins) {
            _mins = 45;
        }

        // use tab.id as alarm's name
        chrome.alarms.create(`${tabId}`, {delayInMinutes: _mins});
    }
}

/* -- alarm's action ---------------------------------------- */

// fired when an alarm has elapsed
chrome.alarms.onAlarm.addListener(doSuspend);

function doSuspend(alarm) {
    if (!alarm || !alarm.name) {return;}

    let tabId = Number(alarm.name);
    chrome.tabs.get(tabId, (tab) => {
        if (!tab) {return;}
        // reset alarm
        chrome.storage.sync.get((value) => {
            setAlarm(tabId, value['mins']);
        });

        if (tab.highlighted) {
            // exclude highlighted tab
            return;
        }
        if (tab.audible) {
            // exclude audible tab
            return;
        }
        if (!tab.url) {
            // exclude the tab of empty url
            return;
        }
        if (tab.url.startsWith("chrome://")) {
            // exclude internal tab
            return;
        }

        // do suspend
        if (tab.url.startsWith("http://")
            || tab.url.startsWith("https://")) {

            chrome.storage.sync.get((value) => {
                let skip = false;

                // check pass rules
                if (value.rules) {
                    for (let rule of value.rules) {
                        let res = checkRegExp(tab.url, rule);
                        if (res) {
                            // hit pass rule
                            skip = true;
                            break;
                        }
                    }
                }

                if (skip) {
                    // no suspend
                    return;
                }

                // Storing tab's data
                let ttl = (tab.title) ? tab.title : '';
                let url = (tab.url) ? tab.url : '';
                let icon = (tab.favIconUrl) ? tab.favIconUrl : '';

                chrome.storage.local.set({
                    [`${tab.id}`]: {
                        ttl: ttl,
                        url: url,
                        icon: icon,
                    },
                }, () => {
                    // update tab
                    let toUrl = '/suspended.html' +
                        '?flag=' + tab.id;
                    chrome.tabs.update(tab.id, {url: toUrl}, (tab) => {});
                });
            });
        }
    });
}

// check whether the URL matched regular
function checkRegExp(url, rule) {
    try {
        let reg = new RegExp(rule.slice(1, -1));
        return reg.test(url);
    } catch (e) {
        return false;
    }
}

/* -- manage alarm(s) --------------------------------------- */

chrome.tabs.onCreated.addListener((tab) => {
    // create alarm
    chrome.storage.sync.get((value) => {
        setAlarm(tab.id, value['mins'])
    });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // remove alarm
    chrome.alarms.clear(`${tabId}`)
});

chrome.tabs.onActivated.addListener((activeInfo) => {
    // reset alarm
    chrome.storage.sync.get((value) => {
        let tabId = activeInfo.tabId
        chrome.alarms.clear(`${tabId}`, (wasCleared) => {
            setAlarm(tabId, value['mins'])
        })
    });
});
