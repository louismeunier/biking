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

<main>
<SvelteToast/>
<div id="top">
    <Map activities={activities} />
    <Title />
</div>
<Analysis/>
</main>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
    }
    
    main {
        display: flex;
        flex-direction: column;
    }
    
    #top {
        display: flex;
        flex-direction: column;
        height: 100vh;
    }

    :global(#app) {
        display: flex;
        flex-direction: column;
        margin: 0;
        padding: 0;
        width: 100vw;
    }

    :global(body) {
        margin: 0;
        padding: 0;
    }

    :global(#map) {
        height: 85%;
    }
</style>