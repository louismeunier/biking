<script lang="ts">
    import convert from "../utils/conversions";
    import { activityData } from "../utils/store";

    let activities;
    let sort = {
        key: "start_date",
        order: "desc"
    };

    activityData.subscribe(a => activities = a)
       
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
    <h1>Analysis</h1>
    <h2>Summary of Rides</h2>
    <table>
        <thead>
            <tr>
                <td>
                    date
                    <br/>
                    <button on:click={() => handleSort('start_date')}>
                        {sort.key === "start_date" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    distance (miles)
                    <br/>
                    <button on:click={() => handleSort('distance')}>
                        {sort.key === "distance" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    time (hours)
                    <br/>
                    <button on:click={() => handleSort('moving_time')}>
                        {sort.key === "moving_time" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td>
                    average speed (mph)
                    <br/>
                    <button on:click={() => handleSort('average_speed')}>
                        {sort.key === "average_speed" ? (sort.order === "asc" ? "▼" : "▲") : "‐"}
                    </button>
                </td>
                <td class="toggle">
                    toggle
                    <input
                        type="checkbox"
                        checked={true}
                        on:change={e => activityData.update(acs => acs.map(activity => {
                                // @ts-ignore
                                activity.meta.show = e.target.checked;
                                return activity
                            }))
                        }
                    />
                </td>
            </tr>
        </thead>
        <tbody>
            {#if activities} 
                {#each activities as a}
                    <!-- svelte-ignore a11y-mouse-events-have-key-events -->
                    <tr
                    on:focus="{()=>{}}"
                        on:mouseover={() => {
                            // alert("test")
                            activityData.update(as => {
                                    return as.map(activity => {
                                        if (a.id === activity.id) {
                                            activity.meta.highlight = true;
                                        }
                                        return activity
                                    });
                                 })
                        }}
                        on:mouseout={() => {
                            activityData.update(as => {
                                    return as.map(activity => {
                                        if (a.id === activity.id) {
                                            activity.meta.highlight = false;
                                        }
                                        return activity
                                    });
                                 })
                        }}
                    >
                        <td>{new Date(a.start_date).toLocaleDateString()}</td>
                        <td>{convert.metersToMiles(a.distance)}</td>
                        <td>{convert.secondsToHours(a.moving_time)}</td>
                        <td>{convert.mpsToMph(a.average_speed)}</td>
                        <td class="toggle">
                            <input 
                                type="checkbox" 
                                checked={a.meta.show}
                                on:change={() => activityData.update(as => {
                                    return as.map(activity => {
                                        if (a.id === activity.id) {
                                            activity.meta.show = !activity.meta.show;
                                        }
                                        return activity
                                    });
                                 })
                              }
                            />
                        </td>
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
        border-collapse: collapse;
        margin-left: 0.5em;
        margin-right: 0.5em;
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
        transition: 0.3s ease-in-out;
    }

    tbody tr:hover {
        background-color: rgb(255, 255, 136);
    }

    .toggle {
        width: min-content;
    }

    thead {
        font-weight: 900;
        background-color: lightblue;
    }
</style>