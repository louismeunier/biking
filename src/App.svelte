<script lang="ts">
    import Map from "./lib/components/Map.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<SvelteToast/>
<Map />
<div id="analysis">
</div>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
    }
    
    :global(#primary) {
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