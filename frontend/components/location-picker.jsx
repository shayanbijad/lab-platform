"use client";

import { useEffect, useRef } from "react";

let leafletAssetsPromise = null;

function loadLeafletAssets() {
  if (leafletAssetsPromise) {
    return leafletAssetsPromise;
  }

  leafletAssetsPromise = new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.L) {
      resolve(window.L);
      return;
    }

    const existingCss = document.querySelector('link[data-leaflet="true"]');
    if (!existingCss) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
      link.dataset.leaflet = "true";
      document.head.appendChild(link);
    }

    const existingScript = document.querySelector('script[data-leaflet="true"]');
    if (existingScript && window.L) {
      resolve(window.L);
      return;
    }

    const script = existingScript || document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.dataset.leaflet = "true";
    script.onload = () => resolve(window.L);
    script.onerror = reject;

    if (!existingScript) {
      document.body.appendChild(script);
    }
  });

  return leafletAssetsPromise;
}

export default function LocationPicker({
  value,
  onChange,
  height = 300,
  defaultCenter = { latitude: 35.6892, longitude: 51.389 },
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const onChangeRef = useRef(onChange);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let isMounted = true;

    loadLeafletAssets()
      .then((leaflet) => {
        if (!isMounted || !containerRef.current || mapRef.current) {
          return;
        }

        const lat = Number(value?.latitude);
        const lng = Number(value?.longitude);
        const center =
          Number.isFinite(lat) && Number.isFinite(lng)
            ? [lat, lng]
            : [defaultCenter.latitude, defaultCenter.longitude];

        const map = leaflet.map(containerRef.current).setView(center, 13);
        leaflet
          .tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "© OpenStreetMap",
            maxZoom: 19,
          })
          .addTo(map);

        const marker = leaflet.marker(center).addTo(map);
        markerRef.current = marker;
        mapRef.current = map;

        map.on("click", (event) => {
          const nextValue = {
            latitude: event.latlng.lat,
            longitude: event.latlng.lng,
          };

          marker.setLatLng([nextValue.latitude, nextValue.longitude]);
          onChangeRef.current(nextValue);
        });

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          onChangeRef.current({
            latitude: defaultCenter.latitude,
            longitude: defaultCenter.longitude,
          });
        }
      })
      .catch((error) => {
        console.error("Failed to load map", error);
      });

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [defaultCenter.latitude, defaultCenter.longitude]);

  useEffect(() => {
    const map = mapRef.current;
    const marker = markerRef.current;
    const lat = Number(value?.latitude);
    const lng = Number(value?.longitude);

    if (!map || !marker || !Number.isFinite(lat) || !Number.isFinite(lng)) {
      return;
    }

    marker.setLatLng([lat, lng]);
    map.panTo([lat, lng]);
  }, [value?.latitude, value?.longitude]);

  return (
    <div
      ref={containerRef}
      style={{ width: "100%", height }}
      className="rounded-2xl border"
    />
  );
}
