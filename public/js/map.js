console.log(key);

// Set map view to India's coordinates
const map = L.map('map').setView([20.5937, 78.9629], 3.75); // Use zoom level 5 for better view of India

// Load MapTiler tiles
const mtLayer = L.maptilerLayer({
    apiKey: key, // Correct object property syntax
    style: L.MaptilerStyle.STREETS // Use correct property assignment syntax
}).addTo(map);