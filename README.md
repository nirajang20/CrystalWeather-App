# CrystalWeather

CrystalWeather is a dynamic and interactive web application that provides current weather conditions, hourly and daily forecasts, Air Quality Index (AQI) data, and visually engaging weather effects. Designed to offer a comprehensive and user-friendly weather experience, it allows users to search for any city, toggle between temperature units, and view detailed weather insights.

## Features

-   **Current Weather Display**: Get up-to-date temperature, "feels like" temperature, weather description, and wind speed for your chosen location.
-   **Location-Based Services**: Automatically detects your location using geolocation for an instant weather overview, with a fallback to a default city.
-   **City Search with Suggestions**: Easily search for weather in any city worldwide with an intuitive search bar that provides suggestions.
-   **Unit Toggle**: Seamlessly switch between Celsius and Fahrenheit temperature units.
-   **Hourly Forecast Graph**: Visualize temperature trends with an hourly forecast chart powered by Chart.js.
-   **Daily Forecast**: Plan your week with a clear five-day weather forecast, including high/low temperatures and weather icons.
-   **Air Quality Index (AQI)**: Monitor air quality with an integrated AQI badge and corresponding description.
-   **Dynamic Weather Effects**: Experience immersive visual effects (e.g., sunny, cloudy, rainy, snowy) that reflect current weather conditions.
-   **Real-time Local Time**: Displays the local time for the queried city.
-   **Dynamic Favicon**: The browser favicon updates to reflect the current weather icon.

## Technologies Used

-   **Frontend**: HTML5, CSS3, JavaScript
-   **Charting**: Chart.js
-   **Backend Proxy**: PHP
-   **Weather Data**: OpenWeatherMap API

## Setup and Installation

To get CrystalWeather up and running on your local machine or web server, follow these steps:

1.  **Clone the Repository**:
    ```bash
    git clone https://github.com/your-username/CrystalWeather.git
    cd CrystalWeather
    ```
    (Note: Replace `your-username/CrystalWeather.git` with the actual repository URL if this project is hosted on GitHub.)

2.  **Obtain an OpenWeatherMap API Key**:
    -   Go to the [OpenWeatherMap website](https://openweathermap.org/api).
    -   Sign up for a free account.
    -   Generate an API key from your account dashboard.

3.  **Configure `weather-proxy.php`**:
    -   Open the `weather-proxy.php` file in a text editor.
    -   Locate the line: `$apiKey = 'USE_YOUR_API_KEY';`
    -   Replace `'USE_YOUR_API_KEY'` with your actual OpenWeatherMap API key.
    -   **Important**: For production environments, consider using environment variables to store your API key instead of hardcoding it directly in the file for better security.

4.  **Host on a Web Server**:
    -   Ensure you have a web server installed and configured that supports PHP (e.g., Apache, Nginx with PHP-FPM).
    -   Place all the project files (`index.html`, `style.css`, `script.js`, `weather-proxy.php`) in your web server's document root or a virtual host directory.

## Usage

1.  Open `index.html` in your web browser, either directly or via your configured web server.
2.  The application will attempt to fetch weather for your current location using geolocation. If denied or unavailable, it defaults to a predefined city (e.g., London).
3.  Use the **Search icon** to open the search modal. Type a city name into the input field and select from the suggestions or press Enter to get weather data.
4.  Use the **unit toggle switch** to change temperature display between Fahrenheit (°F) and Celsius (°C).

## Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes, please feel free to:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/your-feature-name`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add new feature'`).
5.  Push to the branch (`git push origin feature/your-feature-name`).
6.  Open a Pull Request.

## License

This project is open-source and available under the MIT License. See the `LICENSE` file (if available) for more details.

## Acknowledgements

-   Weather data provided by [OpenWeather](https://openweathermap.org/).
-   Designed by [NirajanG](https://nirajang.com.np).
-   Charting functionality powered by [Chart.js](https://www.chartjs.org/).
-   Google Fonts for typography.