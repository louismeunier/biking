<script lang="ts">
    import convert from "../utils/conversions";
    export let activities;

    let sort = {
        key: "start_date",
        order: "desc"
    };

    const handleSort = param => {
        if (param === sort.key) {
            sort.order = sort.order === "asc" ? "desc" : "asc";
        } else {
            sort.key = param;
            sort.order = "desc";
        }
        activities = activities.sort((a, b) => {
            if (sort.order === "asc") {
                return a[sort.key] > b[sort.key] ? 1 : -1;
            } else {
                return a[sort.key] < b[sort.key] ? 1 : -1;
            }
        });
    }
</script>

<div id="analysis">
    <h2>Summary of Rides</h2>
    <table>
        <thead>
            <tr>
                <td>
                    date
                    <button on:click={() => handleSort('start_date')}>
                        {sort.key === "start_date" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    distance (miles)
                    <button on:click={() => handleSort('distance')}>
                        {sort.key === "distance" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    time (hours)
                    <button on:click={() => handleSort('moving_time')}>
                        {sort.key === "moving_time" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    average speed (mph)
                    <button on:click={() => handleSort('average_speed')}>
                        {sort.key === "average_speed" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <!-- <td>toggle on map</td> -->
            </tr>
        </thead>
        <tbody>
            {#if activities} 
                {#each activities as a}
                    <tr>
                        <td>{new Date(a.start_date).toLocaleDateString()}</td>
                        <td>{convert.metersToMiles(a.distance)}</td>
                        <td>{convert.secondsToHours(a.moving_time)}</td>
                        <td>{convert.mpsToMph(a.average_speed)}</td>
                        <!-- <td></td> -->
                    </tr>
                {/each}
            {/if}
        </tbody>
    </table>
    
</div>

<style>
    #analysis {
        display: flex;
        flex-direction: column;
        height: 100vh;
        align-items: center;
    }

    table {
        width: 50%;
        border-collapse: collapse;
    }

    table button {
        /* background: none; */
        border: none;
        border-radius: 50%;
        width: 20px;
    }

    td {
        text-align: center;
        padding: 0.5em;
    }

    tr {
        border: 1px solid black;
    }

    thead {
        font-weight: 900;
        background-color: lightblue;
    }
</style>