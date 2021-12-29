Definitions
======================

## storage

- sync

```json5
{
    "mins": "45",  // do suspend after 45 mins
    "rules": [],  // pass list

    "ctlKey": "0",  // keycode - `Ctrl` or `Command`
    "sftKey": "0",  // keycode - `Shift`
    "cusKey": "Space",  // custom keycode
}
```

- local

```json5
{
    "2": {  // the id of tab
        "ttl": "...",  // the title of tab
        "url": "...",  // the url of tab
        "icon": "...",  // the favicon of tab
    }
}
```
