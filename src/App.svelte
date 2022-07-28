<script lang="ts">
    // svelte
    import Map from "./lib/components/Map.svelte";
    import Analysis from "./lib/components/Analysis.svelte";
    import Title from "./lib/components/Title.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
    // utils
    import { getActivities } from "./lib/utils/api";

    let activities;
    (async () => {  activities = await getActivities() })();
</script>

<SvelteToast/>
<main>  
    <div class="map-wrap">
        <Map activities={activities} />
    </div>
    <div class="sidepanel">
        <Title />
        <Analysis activities={activities}/>
    </div>
</main>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
        scroll-behavior: smooth;
    }
    
    .sidepanel {
        overflow-y: auto;
        height: fit-content;
        margin-left: 50%;
        right: 0;
    }

    :global(body) {
        margin: 0;
        padding: 0;
    }

    .map-wrap {
        height: 100vh;
        overflow: hidden;
        position: fixed;
        left: 0;
        top: 0;
        bottom: 0;
        width: 50%;
    }

    :global(#map) {
        height: 100%;
        overflow: hidden;
    }

    @media only screen and (max-width: 600px) {
        .map-wrap {
            width: 100%;
            z-index: 999;
            height: 50%;
        }
        .sidepanel {
            margin-left: 0;
            margin-top: 50%;
            width: 100%;
        }
    }
</style>