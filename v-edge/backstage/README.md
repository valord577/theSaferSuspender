Definitions
======================

## storage

- sync

```json5
{
    "index": 5,
    "mins": "45",  // do suspend after 45 mins
    "rules": [],  // pass list

    "ctlIndex": 0,
    "ctlKey": "0",  // keycode - `Ctrl` or `Command`

    "sftIndex": 0,
    "sftKey": "0",  // keycode - `Shift`

    "cusIndex": 0,
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
