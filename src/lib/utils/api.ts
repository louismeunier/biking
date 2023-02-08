import { themes } from "./toast-themes";
import { toast } from "@zerodevx/svelte-toast";

// handle local vs remote netlify functions
const apiBase = (path: string) => location.hostname == "localhost" || location.hostname == "127.0.0.1" ? `http://localhost:8008/${path}` : `/.netlify/functions/${path}`;

async function fetchCached(url: string) {
  const cache = JSON.parse(localStorage.getItem(url));
  if (cache && cache.expires > Date.now()) {
    return cache.data;
  }
  const request = await fetch(url);
  const data = await request.json();
  localStorage.setItem(url, JSON.stringify({
    expires: Date.now() + 1000 * 60 * 60 * 24,
    data: data,
  }));
  return data;
}

export async function getActivities(): Promise<Activity[]> {
  try {
    toast.push("Loading activitiy data...", { theme: themes.wait, dismissable: false, duration: 10000 });
    const activities = await fetchCached(apiBase("get-activity"));
    toast.pop();
    toast.push("Activities loaded!", { theme: themes.success });
    return activities.map(a => { a.meta = { show: true, highlight: false } ; return a;});
  } catch (error) {
    toast.pop()
    toast.push("Error loading activities!", { theme: themes.error });
    console.error(error);
  }
}

export async function getActivityStreams(id): Promise<{[key: string]: ActivityStream}> {
  try {
    toast.push("Loading activity data...", { theme: themes.wait, dismissable: false, duration: 10000 });
    const activitiesStreams = await fetchCached(apiBase(`get-activity-streams?ids=${id}&streams=heartrate,time,altitude,temp,watts`));
    // const activitiesStreams = await request.json();
    toast.pop();
    toast.push("Activities loaded!", { theme: themes.success });
    return activitiesStreams;
  }
  catch (error) {
    toast.pop()
    toast.push("Error loading activities!", { theme: themes.error });
    console.error(error);
  }
}
