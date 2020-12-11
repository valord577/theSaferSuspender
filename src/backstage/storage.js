/**
 * @author valor.
 */

// time(s) for `auto` suspend tabs
// default 45 mins
const time = 'time';
// pass list for `never` suspend tabs
const pass = 'pass';

browser
    .storage
    .sync
    .set({
        [time]: {
            mins: 45,
            index: 0,
        },

        [pass]: [],
    });

