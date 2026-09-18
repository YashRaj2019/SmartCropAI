import httpx
from typing import Dict, Any
from backend.app.config import settings

class WeatherService:
    """
    Integrates live meteorologic forecast data with automatic mock fallback when external API keys are unavailable.
    """
    @staticmethod
    async def get_weather(location: str = "Central Valley") -> Dict[str, Any]:
        api_key = settings.WEATHER_API_KEY
        if api_key:
            try:
                async with httpx.AsyncClient() as client:
                    url = f"https://api.openweathermap.org/data/2.5/weather?q={location}&units=metric&appid={api_key}"
                    resp = await client.get(url, timeout=5.0)
                    if resp.status_code == 200:
                        data = resp.json()
                        return {
                            "location": data.get("name", location),
                            "country": data.get("sys", {}).get("country", ""),
                            "temperature": round(data["main"]["temp"], 1),
                            "humidity": data["main"]["humidity"],
                            "wind_speed": round(data["wind"]["speed"] * 3.6, 1), # m/s to km/h
                            "description": data["weather"][0]["description"].capitalize(),
                            "icon": data["weather"][0]["icon"],
                            "rainfall": data.get("rain", {}).get("1h", 0.0),
                            "is_live": True
                        }
            except Exception as e:
                print(f"[WeatherService] Live fetch failed: {e}. Using simulated weather.")

        loc_clean = location.title() if location else "Central Valley"
        return {
            "location": loc_clean,
            "country": "IN/US",
            "temperature": 24.5,
            "humidity": 65.0,
            "wind_speed": 12.4,
            "rainfall": 2.5,
            "description": "Partly Cloudy with Moderate Humidity",
            "icon": "03d",
            "is_live": False,
            "forecast": [
                {"day": "Today", "temp_high": 26, "temp_low": 18, "condition": "Partly Cloudy", "rain_prob": 20},
                {"day": "Tomorrow", "temp_high": 27, "temp_low": 19, "condition": "Sunny", "rain_prob": 10},
                {"day": "Day 3", "temp_high": 25, "temp_low": 17, "condition": "Light Rain", "rain_prob": 65},
                {"day": "Day 4", "temp_high": 24, "temp_low": 16, "condition": "Scattered Showers", "rain_prob": 80},
                {"day": "Day 5", "temp_high": 28, "temp_low": 20, "condition": "Clear Sky", "rain_prob": 5}
            ]
        }
