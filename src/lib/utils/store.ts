import { writable } from 'svelte/store';
import type { Activity } from './api';

export const activityData = writable<Activity[]>([]);