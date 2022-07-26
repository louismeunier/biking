<div id="footer">
    <h1>Bike Trail Visualizer</h1>
    <img src="/bike.svg" alt="Bike Logo" height="55px"/>
    <p>An automatically updating map of my (Louis Meunier's) biking activity from Strava.</p>
    <a href="#analysis" title="Go to analysis">
        <img class="down" src="/down-arrow.png" alt="Down Arrow" height="25px"/>
    </a>
</div>

<style>
    #footer {
        display: flex;
        flex-direction: column;
        text-align: center;
    }

    #footer {
        display: flex;
        flex-grow: 1;
        flex-direction: column;
        align-items: center;
    }

    .down {
        animation: bounce 2s infinite;
    }

    /* make an animation for the down arrow to bounce up and down, slowing at its peaks */
    @keyframes bounce {
        0% {
            transform: translateY(0.75);
        }
        50% {
            transform: translateY(-0.75em);
        }
        100% {
            transform: translateY(0.75);
        }
    }

</style>