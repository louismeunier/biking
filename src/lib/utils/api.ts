import { themes } from "./toast-themes";
import { toast } from "@zerodevx/svelte-toast";

interface Activity {
    id: number,
    name: string,
    type: string,
    distance: number,
    moving_time: number,
    elapsed_time: number,
    start_date: string,
    map: string,
    start_latlng: number[],
    end_latlng: number[],
    average_speed: number,
    max_speed: number,
    average_watts?: number,
    kilojoules?: number,
    average_heartrate?: number,
    max_heartrate?: number,
    calories?: number
}

export async function getActivities(): Promise<Activity[]> {
    try {
      toast.push("Loading activitiy data...", { theme: themes.wait, dismissable: false, duration: 10000 });
      const request = await fetch("https://magical-fox-098a60.netlify.app/.netlify/functions/get-activity");
      const activities = await request.json();
      toast.pop();
      toast.push("Activities loaded!", { theme: themes.success });
      return activities;
    } catch (error) {
      toast.pop()
      toast.push("Error loading activities!", { theme: themes.error });
      console.error(error);
    }
  }