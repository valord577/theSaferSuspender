/**
 * @author valor.
 */

let timeSelect = document.getElementById('timeSelect');
let passList = document.getElementById('passList');
let testPassList = document.getElementById('testPassList');

document
    .addEventListener(
        'DOMContentLoaded',
        function () {
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

                    if (value.time) {
                        // set `#timeSelect`
                        timeSelect.selectedIndex = value.time.index;
                    }
                    if (value.pass && value.pass.length > 0) {
                        // set `#passList`
                        passList.value = value.pass.join('\n');
                    }
                });
        }
    );

timeSelect.addEventListener('change',
    function () {
        let index = timeSelect.selectedIndex;
        let value = timeSelect.options[index].value;

        browser
            .storage
            .sync
            .set({
                time: {
                    mins: value,
                    index: index,
                },
            });
    });

passList.addEventListener('blur',
    function () {
        if (passList.value) {
            let list = passList.value.split(/\r\n|\r|\n/);

            if (list) {
                browser
                    .storage
                    .sync
                    .set({
                        pass: list,
                    });
            }
        }
    });

testPassList.addEventListener('click',
    function () {

        if (!passList.value) {
            alert('There are no open tabs that match the current pass list.');
        }

        let list = passList.value.split(/\r\n|\r|\n/);
        if (!list || length.length < 1) {
            alert('There are no open tabs that match the current pass list.');
        }

        browser
            .tabs
            .query({
                url: ["http://*/*", "https://*/*"],
            })
            .then((tabs) => {

                if (tabs && tabs.length > 0) {
                    let msg = '';

                    for (let tab of tabs) {
                        for (let filter of list) {
                            let result = checkRegExp(tab.url, filter.substring(1, filter.length - 1));
                            if (result) {
                                // matched
                                msg += ('- ' + tab.url + '\n');
                                break;
                            }
                        }
                    }

                    alert('Passed open tabs: \n' + msg);
                } else {
                    alert('There are no open tabs that match the current pass list.');
                }
            });
    });

function checkRegExp(str, filter) {
    try {
        let reg = new RegExp(filter);
        return reg.test(str);
    } catch (e) {
        return false;
    }
}
