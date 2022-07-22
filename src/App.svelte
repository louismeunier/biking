<script lang="ts">
    import Map from "./lib/components/Map.svelte";
    import Footer from "./lib/components/Footer.svelte";
    import { SvelteToast } from "@zerodevx/svelte-toast";
</script>

<SvelteToast/>
<div id="primary">
    <Map />
    <Footer/>   
</div>
<div id="analysis">
</div>

<style>
    :root {
        font-family: "Source Code Pro", monospace;
    }
    
    #primary {
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