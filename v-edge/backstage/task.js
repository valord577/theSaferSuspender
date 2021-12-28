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
            setAlarm(tab, value.mins);
        }
    });
});

function setAlarm(tab, mins) {
    // exclude `chrome.tabs.TAB_ID_NONE`
    if (!tab.id || tab.id < 0) {
        return;
    }

    // default - do suspend after 45 mins
    let _mins = Number(mins);
    if (!_mins) {
        _mins = 45;
    }

    // use tab.id as alarm's name
    chrome.alarms.create(`${tab.id}`, {delayInMinutes: _mins});
}

/* -- alarm's action ---------------------------------------- */

// fired when an alarm has elapsed
chrome.alarms.onAlarm.addListener(doSuspend);

function doSuspend(alarm) {
    if (!alarm.name) {
        // no tab.id
        return;
    }
    let tabId = Number(alarm.name);

    chrome.tabs.get(tabId, (tab) => {
        if (!tab) {
            return;
        }
        // reset alarm
        chrome.storage.sync.get((value) => {
            setAlarm(tab, value.mins);
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
        if (tab.url.startsWith("edge://")) {
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
                        let res = checkRegExp(tab.url, rule.substring(1, rule.length - 1));
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

/* -- manage alarm(s) --------------------------------------- */

chrome.tabs.onCreated.addListener((tab) => {
    // create alarm
    chrome.storage.sync.get((value) => {
        setAlarm(tab, value.mins);
    });
});

chrome.tabs.onRemoved.addListener((tabId, removeInfo) => {
    // remove alarm
    chrome.alarms.clear(`${tabId}`, (wasCleared) => {
        // pass
    });
});
