<script lang="ts">
  // svelte
  import { onMount } from "svelte";

  // leaflet
  import leaflet from "leaflet";
  import "leaflet/dist/leaflet.css";
  import markerShadow from "/marker-shadow.png";
  import markerIcon from "/marker-icon.png";
  import "leaflet.featuregroup.subgroup";
  import "leaflet-gpx";

  // data
  import { pointsOfInterest } from "../../data/constants";
  import { trailSettings } from "../../data/trails";

  // utils
  import decodePolyline from "../utils/decode-polyline";
  import convert from "../utils/conversions";
  import { activityData } from "../utils/store";

  let layerControl: leaflet.Control.Layers;
  let map:L.Map;

  // utilities 
  const polylineOptions = (color:string) => { return {
      async: true,
      marker_options: {
        startIconUrl: null,
        endIconUrl: null,
        shadowUrl: null
      },
      polyline_options: {
        color: color,
        weight: 8,
        opacity: 0.8,
        smoothFactor: 1,
        noClip: false,
      }
    }};

    const trailPopupTemplate = (name:string, imageUrl:string, imageAlt:string):string => {
      return `<img src=${imageUrl} height='40px' alt='${imageAlt}'/>
      <br/>
      <strong class='trail'>${name}</strong>`
    }

  async function renderMap() {
    map = leaflet.map('map').setView([42.77, -73.86], 10);

    // base layers
    const osmLayer = leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const satelliteLayer = leaflet.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    })

    const Stadia_AlidadeSmoothDark = leaflet.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png', {
      maxZoom: 20,
      attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
    });

    const baseMaps = {
      "OpenStreetMap": osmLayer,
      "Satellite": satelliteLayer,
      "Dark Mode": Stadia_AlidadeSmoothDark
    };

    // overlay layers
    const poisLayer = leaflet.layerGroup(pointsOfInterest.map(point => {
      return leaflet.marker(point.coordinates, {
        icon: leaflet.icon({
          iconUrl: markerIcon,
          shadowUrl: markerShadow,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41]
        })
      }).bindPopup(point.name)
    }));

    const parentGroup = leaflet.featureGroup();

    layerControl = leaflet.control.layers(baseMaps, {"Points of Interest": poisLayer}, {collapsed: true});
    layerControl.addOverlay(parentGroup, "Trails");

    parentGroup.addTo(map)
    layerControl.addTo(map);

    // trails
    trailSettings.forEach(trail => {
      const trailGroup = leaflet.featureGroup.subGroup(parentGroup);

      map.on("layeradd", e => {
        trailGroup.bringToBack();
      })

      const { name, color, gpx, image, imageAlt } = trail;

      new leaflet.GPX(
        gpx, 
        polylineOptions(color)
      ).addTo(trailGroup).bindPopup(
        trailPopupTemplate(name, image, imageAlt)
      ).addTo(map);

      layerControl.addOverlay(trailGroup, name);
      trailGroup.addTo(map);
    })
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
            weight: activity.meta.highlight ? 14 : 4,
            opacity: 0.3,
            smoothFactor: 1,
            noClip: false,
            // zIndex: activity.meta.highlight ? 100 : 1
          }).bindPopup(`${activity.name}<br>${new Date(activity.start_date).toLocaleString()}<br>${convert.metersToMiles(activity.distance)} miles<br>${convert.secondsToHours(activity.moving_time)} hours`)
            .addTo(map);
            if (activity.meta.highlight) {
              activitiesLayer[activity.id].openPopup();
              // map.flyTo(activitiesLayer[activity.id].getCenter(), 10);
              map.setView(activitiesLayer[activity.id].getCenter());
            }
        }
        if (activity.meta.show && !activitiesLayer[activity.id]) {
          const testltln = decodePolyline(activity.map);
          activitiesLayer[activity.id] = leaflet.polyline(testltln, {
            color: 'red',
            weight: activity.meta.highlight ? 14 : 4,
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
  
  onMount(() => {
    // need to wait for the container to render otherwise Leaflet won't be able to find to element to render the map to
    renderMap();
    // make logic with the layer control make more sense
    document.querySelector(".leaflet-control-layers-overlays > label:nth-child(2) > span:nth-child(1) > input:nth-child(1)")
      .addEventListener("change", (e:InputEvent) => {
        const inputs = document.querySelectorAll(".leaflet-control-layers-overlays > label:nth-child(n+2) > span > input")
        inputs.forEach((input:HTMLInputElement) => {
          // @ts-ignore
          if (input.checked != e.target.checked) {
            input.click()
          }
        })
    });
  })
</script>

<div id="map"></div>

<style>
  :global(.leaflet-popup-content) {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.3em;
  }

  :global(.leaflet-control-layers-overlays > *) {
    margin-left: 1em;
  }

  :global(.leaflet-control-layers-overlays > label:nth-child(1)),
  :global(.leaflet-control-layers-overlays > label:nth-child(2)){
    margin-left: 0;
  }
</style>