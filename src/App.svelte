<script lang="ts">
    import Map from "./lib/components/Map.svelte";
    import { SvelteToast, toast } from '@zerodevx/svelte-toast'
    import { themes } from "./lib/utils/toast-themes";

    function handleClick() {
        const pw = window.prompt("Password")
        // very secure, I know. Not really necessary right now, but with the backend setup, it would work
        if (pw == "abc123") {
            toast.push("Syncing activity data...", { theme: themes.wait });
            fetch("https://magical-fox-098a60.netlify.app/.netlify/functions/activity-sync")
                .then(response => response.json())
                .then(data => {
                    toast.pop();
                    toast.push("Activity data synced!", { theme: themes.success });
                })
                .catch(error => {
                    toast.pop();
                    toast.push("Error syncing activity data!", { theme: themes.error });
                    console.error(error);
                });
        } else {
            toast.push("Wrong password!", { theme: themes.error });   
        }
    }
</script>

<Map/>
<SvelteToast/>
<button>
    <img src="/sync.png" alt="Synchronize DB with strava" height="30px" on:click="{handleClick}"/>
</button>

<style>
    button {
        margin-top: 10px;
    }
</style>