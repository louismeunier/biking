import { writable } from 'svelte/store';

export const activityData = writable<Activity[]>([]);