<?php
// --- SECURITY: Set the API Key on the Server ---
// For best practice, use environment variables instead of hardcoding.
$apiKey = 'USE_YOUR_API_KEY';

// --- Set Headers ---
header("Access-Control-Allow-Origin: *"); // For development. Restrict in production.
header("Content-Type: application/json; charset=UTF-8");

// --- Get Parameters from the Client's Request ---
$city = isset($_GET['q']) ? $_GET['q'] : null;
$lat = isset($_GET['lat']) ? $_GET['lat'] : null;
$lon = isset($_GET['lon']) ? $_GET['lon'] : null;
$units = isset($_GET['units']) ? $_GET['units'] : 'metric';

// --- Validate Input ---
if ((!$city && (!$lat || !$lon))) {
    http_response_code(400); // Bad Request
    echo json_encode(["message" => "Missing required parameters (city or lat/lon)."]);
    exit;
}

// --- Build the Forecast API URL ---
$forecastApiUrl = "https://api.openweathermap.org/data/2.5/forecast?";
if ($city) {
    $forecastApiUrl .= "q=" . urlencode($city);
} else {
    $forecastApiUrl .= "lat=" . $lat . "&lon=" . $lon;
}
$forecastApiUrl .= "&appid=" . $apiKey . "&units=" . $units;

// --- Make the API Call using cURL ---
function fetchApiData($url) {
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($ch, CURLOPT_TIMEOUT, 10);
    $output = curl_exec($ch);
    $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $httpcode, 'body' => $output];
}

// --- Fetch Forecast Data ---
$forecastResult = fetchApiData($forecastApiUrl);

if ($forecastResult['code'] !== 200) {
    http_response_code($forecastResult['code']);
    echo $forecastResult['body']; // Forward the error from OpenWeatherMap
    exit;
}

$forecastData = json_decode($forecastResult['body'], true);

// --- Use Forecast Coords to Fetch AQI Data ---
$aqiLat = $forecastData['city']['coord']['lat'];
$aqiLon = $forecastData['city']['coord']['lon'];
$aqiApiUrl = "https://api.openweathermap.org/data/2.5/air_pollution?lat=" . $aqiLat . "&lon=" . $aqiLon . "&appid=" . $apiKey;

$aqiResult = fetchApiData($aqiApiUrl);

if ($aqiResult['code'] !== 200) {
    $aqiData = null;
} else {
    $aqiData = json_decode($aqiResult['body'], true);
}

// --- Combine and Send the Final Response ---
$finalResponse = [
    "forecast" => $forecastData,
    "aqi" => $aqiData
];

echo json_encode($finalResponse);
?>