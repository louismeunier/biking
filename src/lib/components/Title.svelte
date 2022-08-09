<div id="footer">
    <h1>Bike Trail Visualizer</h1>
    <img src="/bike.svg" alt="Bike Logo" height="55px"/>
    <p>An automatically updating map of my (<a href="https://louismeunier.net" target="_blank">Louis Meunier's</a>) biking activity from Strava. See the <a href="https://github.com/louismeunier/bike">source code</a> for more.</p>
    <a href="#analysis" title="Go to analysis">
        <img class="down" src="/down-arrow.png" alt="Down Arrow" height="25px"/>
    </a>
</div>

<style>

    #footer {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2em;
        padding-inline: 2em;
        height: 100vh;
    }

    @media only screen and (max-width: 600px) {
       #footer {
        height: 50vh;
       }
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