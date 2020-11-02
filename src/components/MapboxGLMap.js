import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
  width: "100%",
  height: "calc(100vh - 80px)",
  position: "absolute"
};

let gyro = new Gyroscope({frequency: 60});
let accl = new Accelerometer({frequency: 60});
gyro.start();
accl.start();
accl.addEventListener('reading', () => {
  console.log("Acceleration along the X-axis " + accl.x);
  console.log("Acceleration along the Y-axis " + accl.y);
  console.log("Acceleration along the Z-axis " + accl.z);
});
gyro.addEventListener('reading', e => {
  console.log("Angular velocity along the X-axis " + gyro.x);
  console.log("Angular velocity along the Y-axis " + gyro.y);
  console.log("Angular velocity along the Z-axis " + gyro.z);
});


const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  
  const layerTypes = ["light", "dark", "outdoors", "satellite"];


  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v11", // stylesheet location
        center: [10.408773, 63.422091],
        zoom: 10
      });

      map.on("load", () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return <div id="map" ref={el => (mapContainer.current = el)} style={styles} />;
};

export default MapboxGLMap;