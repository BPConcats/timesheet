import { get, writable } from "svelte/store";


export let settings = writable({})

// We want to save the settings to local storage so it is
// persistent between application restarts.
// Once we provide a name and a value the JSON will be
// updated so we can add new settings simpler
export let saveSetting = (name, value) => {
    const settingsJson = JSON.stringify({
        ...get(settings),
        [name]: value,
    });
    localStorage.setItem('settings', settingsJson);
}

// Once provided a variable name we will pull the local
// storage settings and return the value. If there is no
// settings we will return null
export let getSetting = (name) => {
    const settingsStorage = localStorage.getItem('settings');
    if(settingsStorage) {
        const settingsJson = JSON.parse(settingsStorage);
        return settingsJson[name];
    }
    return null;
}
