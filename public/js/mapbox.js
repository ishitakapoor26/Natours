export const displayMap = (locations) => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoiaWsyNiIsImEiOiJjbTNlZDBkMHIwYXQyMnFyMzEzYmNsMXF1In0.utWY47UT8YfNRkJ7nOfjEA";

  const map = new mapboxgl.Map({
    container: "map", // container ID
    style: "mapbox://styles/ik26/cm3eg3dod002z01p9dnq9gr33",
    scrollZoom: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    // Create marker
    const el = document.createElement("div");
    el.className = "marker";

    // Add marker
    new mapboxgl.Marker({
      element: el,
      anchor: "bottom",
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    // Add PopUp
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 150,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
