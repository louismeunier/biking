<script lang="ts">
    // svelte
    import Map from "./lib/components/Map.svelte";
    import Analysis from "./lib/components/Analysis.svelte";
    import Title from "./lib/components/Title.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    // utils
    import { getActivities } from "./lib/utils/api";
    import { activityData } from "./lib/utils/store";

    (async () => { const activities = await getActivities(); activityData.set(activities) })();
</script>

<SvelteToast/>
<main>  
    <div class="map-wrap">
        <Map />
    </div>
    <div class="sidepanel">
        <Title />
        <Analysis />
    </div>
</main>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
        scroll-behavior: smooth;
    }
    
    main {
        display: flex;
        height: fit-content;
    }

    .sidepanel {
        width: 50%;
        position: sticky;
        padding-left: 0.5em;
        padding-right: 0.5em;
        margin-left: 50%;
    }

    :global(body) {
        margin: 0;
        padding: 0;
        height: fit-content;
    }

    .map-wrap {
        height: 100vh;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 50%;
    }

    :global(#map) {
        height: 100%;
    }

    @media only screen and (max-width: 600px) {
        main {
            display: flex;
            flex-direction: column;
        }
        .map-wrap {
            height: 50vh;
            width: 100%;
        }
        .sidepanel {
            width: 100%;
        }
    }
</style>