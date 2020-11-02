import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

const styles = {
  width: "100%",
  height: "calc(100vh - 80px)",
  position: "absolute"
};


const permissionsNames = [
  "geolocation",
  "push",
  "midi",
  "camera",
  "microphone",
  "speaker",
  "ambient-light-sensor",
  "accelerometer",
  "gyroscope",
  "magnetometer",
]

const getAllPermissions = async () => {
  const allPermissions = []
  // We use Promise.all to wait until all the permission queries are resolved
  await Promise.all(
    permissionsNames.map(async permissionName => {
        try {
          let permission = await navigator.permissions.query({name: permissionName})
          console.log(permission)
          allPermissions.push({permissionName, state: permission.state})
        }
        catch(e){
          allPermissions.push({permissionName, state: 'error', errorMessage: e.toString()})
        }
    })
  )
  return allPermissions
}

const MapboxGLMap = () => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);
  
  let gyro, accl;
  try {
    gyro = new window.Gyroscope({frequency: 60});
    gyro.addEventListener('reading', () => {
      console.log("Gyroscope xyz:", gyro.x, gyro.y, gyro.z);
    });
    gyro.start();
  } catch(error) {console.log("gyroscope not found");}
  
  try {
    accl = new window.Accelerometer({frequency: 60});
    accl.addEventListener('reading', () => {
      console.log("Accelerometer xyz:", accl.x, accl.y, accl.z);
    });
    accl.start();
  } catch(error) {console.log("accelerometer not found");}

  console.log(accl, gyro);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_KEY;
    const initializeMap = async ({ setMap, mapContainer }) => {
      await getAllPermissions();
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