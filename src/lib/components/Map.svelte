<script lang="ts">
  // svelte
  import { onMount } from "svelte";

  // leaflet
  import leaflet from "leaflet";
  import "leaflet/dist/leaflet.css";
  import markerShadow from "/marker-shadow.png";
  import markerIcon from "/marker-icon.png";
  import gpx from "leaflet-gpx";
  import "leaflet.featuregroup.subgroup";

  // data
  import { pointsOfInterest } from "../../data/constants";
  import erie from "../../data/eriecanalway.gpx?raw";
  import hudson from "../../data/hudsonvalleygreenway.gpx?raw";
  import helderberg from "../../data/albanyhelderbergrailtrail.gpx?raw";
  import electric from "../../data/albanyhudsonelectrictrail.gpx?raw";
  import mohawk from "../../data/mohawkhudson.gpx?raw";

  // utils
  import decodePolyline from "../utils/decode-polyline";
  import convert from "../utils/conversions";
  import { activityData } from "../utils/store";

  let layerControl;
  let map;

  async function renderMap() {
    map = leaflet.map('map').setView([42.77, -73.86], 10);
    // creating layers
    // base layers
    const osmLayer = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const satteliteLayer = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satteliteLayer
    };

    // overlay layers
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

    // trails
    const parentGroup = leaflet.featureGroup();
    const erieGroup = leaflet.featureGroup.subGroup(parentGroup)
    const hudsonGroup = leaflet.featureGroup.subGroup(parentGroup);
    const helderbergGroup = leaflet.featureGroup.subGroup(parentGroup);
    const electricGroup = leaflet.featureGroup.subGroup(parentGroup);
    const mohawkGroup = leaflet.featureGroup.subGroup(parentGroup);

    layerControl = leaflet.control.layers(baseMaps, {"Points of Interest": poisLayer}, {collapsed: false});
    parentGroup.addTo(map)

    const gpxErie = new leaflet.GPX(erie, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'lightgreen',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(erieGroup).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Erie Canalway Trail</strong>").addTo(map);

    const gpxHudson = new leaflet.GPX(hudson, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'cornflowerblue',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(hudsonGroup).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Hudson Valley Greenway Trail</strong>").addTo(map);

    const gpxHelderberg = new leaflet.GPX(helderberg, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'orange',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(helderbergGroup).bindPopup("<img src='/helderbergtrail.jpg' height='40px' alt='EST'/><br/><strong class='trail'>Helderberg-Hudson Rail Trail</strong>").addTo(map);

    const gpxElectric = new leaflet.GPX(electric, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'navy',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(electricGroup).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Albany Hudson Electric Rail</strong>").addTo(map);

    const gpxMohawkHudson = new leaflet.GPX(mohawk, {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: 'darkgreen',
        weight: 4,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }).addTo(mohawkGroup).bindPopup("<img src='/empirestatetrail.png' height='40px' alt='EST'/><br/><strong class='trail'>Mohawk Hudson Trail</strong>").addTo(map);

    layerControl.addOverlay(parentGroup, "Trails");
    layerControl.addOverlay(erieGroup, "Erie Canalway Trail");
    layerControl.addOverlay(hudsonGroup, "Hudson Valley Greenway Trail");
    layerControl.addOverlay(helderbergGroup, "Helderberg-Hudson Rail Trail");
    layerControl.addOverlay(electricGroup, "Albany Hudson Electric Rail");
    layerControl.addOverlay(mohawkGroup, "Mohawk Hudson Trail");

    layerControl.addTo(map);

    erieGroup.addTo(map);
    hudsonGroup.addTo(map);
    helderbergGroup.addTo(map);
    electricGroup.addTo(map);
    mohawkGroup.addTo(map);
  }

  // when activities loads, render the new layer
  let activitiesLayer = {};
  activityData.subscribe(activities => {
    // rewrite all this to make each activity a layer
    if (activities.length > 0) {
      activities.forEach(activity => {
        // alert(activity.meta.highlight)
        if (activitiesLayer[activity.id]) {
          map.removeLayer(activitiesLayer[activity.id]);
          delete activitiesLayer[activity.id];
          const testltln = decodePolyline(activity.map);
          activitiesLayer[activity.id] = leaflet.polyline(testltln, {
            color: 'red',
            weight: activity.meta.highlight ? 14 : 7,
            opacity: 0.3,
            smoothFactor: 1,
            noClip: false,
            zIndex: activity.meta.highlight ? 100 : 1
          }).bindPopup(`${activity.name}<br>${new Date(activity.start_date).toLocaleString()}<br>${convert.metersToMiles(activity.distance)} miles<br>${convert.secondsToHours(activity.moving_time)} hours`)
            .addTo(map);
            if (activity.meta.highlight) {
              activitiesLayer[activity.id].openPopup();
              map.setView(activitiesLayer[activity.id].getCenter());
            }
        }
        if (activity.meta.show && !activitiesLayer[activity.id]) {
          const testltln = decodePolyline(activity.map);
          activitiesLayer[activity.id] = leaflet.polyline(testltln, {
            color: 'red',
            weight: activity.meta.highlight ? 14 : 7,
            opacity: 0.3,
            smoothFactor: 1,
            noClip: false,
          }).bindPopup(`${activity.name}<br>${new Date(activity.start_date).toLocaleString()}<br>${convert.metersToMiles(activity.distance)} miles<br>${convert.secondsToHours(activity.moving_time)} hours`)
            .addTo(map);
        } else if (!activity.meta.show && activitiesLayer[activity.id]) {
          map.removeLayer(activitiesLayer[activity.id]);
          delete activitiesLayer[activity.id];
        }
      })
    }
  })
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