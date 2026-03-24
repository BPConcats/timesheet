import { get, writable } from 'svelte/store';

export const activities = writable([
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'non-billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'misc',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'non-billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'misc',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'non-billable',
    },
    {
        description: 'This is a test description to see what is going on',
        timeOnTask: 0,
        type: 'misc',
    }
]);

export let getLatestActivity = () => {
    if(get(activities).length == 0) {
        return null;
    } else {
        const actList = get(activities);
        return actList.findLast(a => a);
    }
}

export let startNewActivity = () => {
     activities.update((a) => [
        ...a,
        {
            description: null,
            timeOnTask: 0,
            type: null,
        }
    ]);
}