<script lang="ts">
    import leaflet from "leaflet";
    import "leaflet/dist/leaflet.css";
    import markerShadow from "/marker-shadow.png";
    import markerIcon from "/marker-icon.png";
    
    import gpx from "leaflet-gpx";

    import { onMount } from "svelte";

    import { pointsOfInterest } from "../data/constants";
    import trail from "../data/eriecanalway.gpx?raw";

    function loadMap() {
      const map = leaflet.map('map').setView([42.77, -73.86], 10);
      
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
          color: 'blue',
          weight: 5,
          opacity: 0.3,
          smoothFactor: 1,
          noClip: false,
        }
      }).addTo(map);

      const baseMaps = {
        "OpenStreetMap": osmLayer,
        "Satellite": satteliteLayer
      };
      
      const overlayMaps = {
          "Points of Interest": poisLayer,
          "Trail": gpxLayer
      };

      var layerControl = leaflet.control.layers(baseMaps, overlayMaps).addTo(map);
    }

    onMount(loadMap)
</script>

<div id="map"></div>

<style>
  #map {
    height: 80vh;
  }
</style>