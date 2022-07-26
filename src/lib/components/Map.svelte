<script lang="ts">
  export let activities = null;
  // svelte
  import { onMount } from "svelte";

  // leaflet
  import leaflet from "leaflet";
  import "leaflet/dist/leaflet.css";
  import markerShadow from "/marker-shadow.png";
  import markerIcon from "/marker-icon.png";
  import gpx from "leaflet-gpx";

  // data
  import { pointsOfInterest } from "../../data/constants";
  import erie from "../../data/eriecanalway.gpx?raw";
  import hudson from "../../data/hudsonvalleygreenway.gpx?raw";

  // utils
  import { getActivities } from "../utils/api";
  import decodePolyline from "../utils/decode-polyline";
  import convert from "../utils/conversions";

  let layerControl;
  let map;

  async function renderMap() {
    map = leaflet.map('map').setView([42.77, -73.86], 10);
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

    const gpxErie = new leaflet.GPX(erie, {
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
    }).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Erie Canalway Trail</strong>").addTo(map);

    const gpxHudson = new leaflet.GPX(hudson, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'blue',
        weight: 4,
        opacity: 0.5,
        smoothFactor: 1,
        noClip: false,
      }
    }).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Hudson Valley Greenway Trail</strong>").addTo(map);

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satteliteLayer
    };
    
    const overlayMaps = {
        "Points of Interest": poisLayer,
        "Erie Canalway Trail": gpxErie,
        "Hudson Valley Greenway Trail": gpxHudson
    };

    layerControl = leaflet.control.layers(baseMaps, overlayMaps).addTo(map);
  }

  // when activities loads, render the new layer
  $: {
    if (activities) {
      const activitiesFiltered = activities.filter(a => a.type == "Ride")
      const activitiesLayer = leaflet.layerGroup(activitiesFiltered.map(activity => {
        const testltln = decodePolyline(activity.map);
        return leaflet.polyline(testltln, {
          color: 'red',
          weight: 7,
          opacity: 0.3,
          smoothFactor: 1,
          noClip: false,
        }).bindPopup(`${activity.name}<br>${new Date(activity.start_date).toLocaleString()}<br>${convert.metersToMiles(activity.distance)} miles<br>${convert.secondsToHours(activity.moving_time)} hours`);
      })).addTo(map);

      layerControl.addOverlay(leaflet.layerGroup([activitiesLayer]), "Activities");
    }
  }

  // need to wait for the container to render otherwise Leaflet won't be able to find to element to render the map to
  onMount(renderMap);
</script>

<div id="map"></div>

<style>
  :global(.leaflet-popup-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
  }
</style>