import { get, writable } from 'svelte/store';

export const activities = writable([]);
const storageItem = `act_${new Date().getMonth().toString().padStart(2, '0')}_${new Date().getDate().toString().padStart(2, '0')}_${new Date().getFullYear()}`;

export let getLatestActivity = () => {
    if(getAllActivities().length == 0) {
        return null;
    } else {
        const actList = get(activities);
        return actList.findLast(a => a);
    }
}

export let startNewActivity = () => {
    activities.update((a) => {
        const newItem = {
            id: a.length === 0 ? 1 : a[a.length - 1].id + 1,
            description: null,
            timeOnTask: 0,
            type: null,
            dateCreated: new Date()
        };

        const updated = [...a, newItem];
        localStorage.setItem(storageItem, JSON.stringify(updated));
        return updated;
    });
};

export let updateActivity = (args) => {
    const latest = getLatestActivity();

    if (!latest) return;

    activities.update(currentItems => {
        const updated = currentItems.map(item => {
            if (item.id === latest.id) {
                return {
                    ...item,
                    description: args.description,
                    timeOnTask: args.timeOnTask,
                    type: args.type
                };
            }
            return item;
        });

        localStorage.setItem(storageItem, JSON.stringify(updated));
        return updated;
    });
};

export let getAllActivities = () => {
    const allValues = Object.values(localStorage);
    let combined = [];

    for (const value of allValues) {
        try {
            const parsed = JSON.parse(value);
            if (Array.isArray(parsed)) {
                combined = [...combined, ...parsed];
            } else {
                if (parsed && typeof parsed === 'object') {
                    combined.push(parsed);
                }
            }
        } catch (e) {
            console.warn("Skipping invalid localStorage value:", value);
        }
    }

    activities.set(combined);
    return combined;
};
