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
<div id="footer">
    <h1>Bike Trail Visualizer</h1>
    <p>An automatically updating map of my (Louis Meunier's) biking activity from Strava.</p>
</div>
<button title="Synchronize database">
    <img src="/sync.png" alt="Synchronize DB with strava" height="30px" on:click="{handleClick}"/>
</button>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
    }
    :global(#app) {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100vw;
        height: 100vh;
    }

    :global(body) {
        margin: 0;
        padding: 0;
    }

    :global(#map) {
        height: 85%;
    }

    button {
        position: absolute;
        bottom: 0;
        right: 0;
        width: fit-content;
        display: grid;
        place-items: center;
        padding: 8px;
        margin: 2px;
        background-color: #3E92CC;
        border-radius: 100%;
    }

    button:hover {
        cursor: pointer;
    }
    
    #footer {
        display: flex;
        flex-direction: column;
        text-align: center;
    }
</style>