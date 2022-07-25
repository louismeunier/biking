<script>
    import { toast } from "@zerodevx/svelte-toast";
    import { themes } from "../utils/toast-themes";

    export let mostRecentActivity = null;

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

<div id="footer">
    <div id="main-footer">
        <h1>Bike Trail Visualizer</h1>
        <img src="/bike.svg" alt="Bike Logo" height="55px"/>
        <p>An automatically updating map of my (Louis Meunier's) biking activity from Strava.</p>
    </div>
    <div id="lower-footer">
        <p>
            {#if mostRecentActivity}
                Last updated: {mostRecentActivity}
            {:else}
                Loading...
            {/if}
        </p>
        <button title="Synchronize database">
            <img src="/sync.png" alt="Synchronize DB with strava" height="20px" on:click="{handleClick}"/>
        </button>
    </div>
</div>

<style>
    button {
        width: fit-content;
        display: grid;
        place-items: center;
        padding: 4px;
        margin: 4px;
        margin-top: 20px;
        background-color: rgba(128, 128, 128, 0.3);
        border: solid 3px black;
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

    #main-footer {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        align-items: center;
    }

    #lower-footer {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
    }
</style>