import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
  width: "100%",
  height: "calc(100vh - 80px)",
  position: "absolute"
};


const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  function easing(t) {
    return t * (2 - t);
  }
  
  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = async ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [10.408773, 63.422091],
        zoom: 10
      });

      map.on("load", () => {
        setMap(map);
        map.resize();

        window.addEventListener('deviceorientation', event => {
          map.panBy([event.alpha, event.gamma], {easing: easing});
        }, true);
        window.addEventListener('devicemotion', event => {
          map.easeTo({
            bearing: map.getBearing() - (event.acceleration.x + event.acceleration.y),
            easing: easing
          });
        }, true);
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div id="map" ref={el => (mapContainer.current = el)} style={styles} />;
};

export default MapboxGLMap;