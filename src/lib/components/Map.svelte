<script lang="ts">
  // leaflet
  import leaflet from "leaflet";
  import "leaflet/dist/leaflet.css";
  import markerShadow from "/marker-shadow.png";
  import markerIcon from "/marker-icon.png";
  import gpx from "leaflet-gpx";
  // svelte
  import { onMount } from "svelte";
  // toast
  import { toast } from '@zerodevx/svelte-toast';
  import { themes } from "../utils/toast-themes";
  // data
  import { pointsOfInterest } from "../../data/constants";
  import trail from "../../data/eriecanalway.gpx?raw";
  import decodePolyline from "../utils/decode-polyline";

  let mostRecentActivity = null;

  async function getActivities() {
    try {
      toast.push("Loading activitiy data...", { theme: themes.wait });
      const request = await fetch("https://magical-fox-098a60.netlify.app/.netlify/functions/get-activity");
      const activities = await request.json();
      toast.pop();
      toast.push("Activities loaded!", { theme: themes.success });
      return activities;
    } catch (error) {
      toast.pop()
      toast.push("Error loading activities!", { theme: themes.error });
      console.error(error);
    }
  }

  async function loadMap() {
    const map = leaflet.map('map').setView([42.77, -73.86], 10);
    
    // creating layers
    const osmLayer = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const satteliteLayer = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })

    const poisLayer = leaflet.layerGroup(pointsOfInterest.map(point => {
      var marker = leaflet.marker(point.coordinates, {
        icon: leaflet.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      })
      marker.bindPopup(point.name);
      return marker;
    }));

    var gpxLayer = new leaflet.GPX(trail, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'green',
        weight: 4,
        opacity: 0.5,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(map);

    const activities = await getActivities();
    const activitiesFiltered = activities.filter(a => a.type == "Ride")
    mostRecentActivity = activitiesFiltered[activitiesFiltered.length - 1].start_date;
    console.log(mostRecentActivity)
    const activitiesLayer = leaflet.layerGroup(activitiesFiltered.map(activity => {
      const testltln = decodePolyline(activity.map);
      return leaflet.polyline(testltln, {
        color: 'red',
        weight: 7,
        opacity: 0.3,
        smoothFactor: 1,
        noClip: false,
      })
    })).addTo(map);

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satteliteLayer
    };
    
    const overlayMaps = {
        "Points of Interest": poisLayer,
        "Trail": gpxLayer,
        "Activities": activitiesLayer
    };

    var layerControl = leaflet.control.layers(baseMaps, overlayMaps).addTo(map);
  }

  onMount(loadMap)
</script>

<div id="map"></div>
<p>{#if mostRecentActivity}last updated: <em>{mostRecentActivity}</em> {/if}</p>
<style>
  p {
    position: absolute;
    bottom: 0;
    left: 0;
    margin-bottom: 0;
  }
</style>