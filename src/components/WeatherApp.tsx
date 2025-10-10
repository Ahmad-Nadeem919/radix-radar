import { useState, useEffect } from "react";
import { Search, MapPin, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { WeatherIcon } from "./WeatherIcon";
import { TemperatureChart } from "./TemperatureChart";

const API_KEY = "7be410161f0485335b51ec63b6269a0a";

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  icon: string;
}

interface ForecastDay {
  date: string;
  temp: number;
  icon: string;
  day: string;
}

export const WeatherApp = () => {
  const [location, setLocation] = useState("Toronto");
  const [searchInput, setSearchInput] = useState("");
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastDay[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  useEffect(() => {
    fetchWeatherData(location);
  }, [location]);

  const fetchWeatherData = async (city: string) => {
    setLoading(true);
    try {
      // Fetch current weather
      const currentResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      
      if (!currentResponse.ok) throw new Error("City not found");
      
      const currentData = await currentResponse.json();
      
      setCurrentWeather({
        city: currentData.name,
        temp: Math.round(currentData.main.temp),
        condition: currentData.weather[0].description,
        icon: currentData.weather[0].main,
      });

      // Fetch 7-day forecast
      const forecastResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&units=metric&appid=${API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      
      // Process forecast data - get one reading per day
      const dailyForecasts: ForecastDay[] = [];
      const processedDates = new Set();
      
      forecastData.list.forEach((item: any) => {
        const date = new Date(item.dt * 1000);
        const dateStr = date.toDateString();
        
        if (!processedDates.has(dateStr) && dailyForecasts.length < 7) {
          processedDates.add(dateStr);
          dailyForecasts.push({
            date: dateStr,
            temp: Math.round(item.main.temp),
            icon: item.weather[0].main,
            day: date.toLocaleDateString("en-US", { weekday: "short" }),
          });
        }
      });
      
      setForecast(dailyForecasts);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch weather data. Please try another location.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setLocation(searchInput.trim());
      setSearchInput("");
    }
  };

  return (
    <div className="min-h-screen bg-weather-gradient transition-colors duration-500">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Weather in 7 Days
          </h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsDark(!isDark)}
            className="rounded-full bg-card-glass/80 backdrop-blur-sm border-card-glass-border/20"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mb-12">
          <div className="relative max-w-2xl mx-auto">
            <Input
              type="text"
              placeholder="Type your location"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full h-14 px-6 rounded-full bg-card-glass/80 backdrop-blur-sm border-card-glass-border/20 text-lg"
            />
            <Button
              type="submit"
              size="icon"
              className="absolute right-2 top-2 rounded-full h-10 w-10"
            >
              <Search className="h-5 w-5" />
            </Button>
          </div>
        </form>

        {/* Weather Content */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-2xl text-foreground">Loading weather data...</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Today's Weather */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Today's Weather
              </h2>
              <Card className="p-8 bg-card-glass/80 backdrop-blur-sm border-card-glass-border/20 rounded-3xl">
                {currentWeather && (
                  <div className="text-center">
                    <div className="flex items-center justify-center gap-2 mb-6">
                      <MapPin className="h-5 w-5 text-foreground" />
                      <span className="text-xl text-foreground font-medium">
                        {currentWeather.city}
                      </span>
                    </div>
                    
                    <div className="mb-6">
                      <WeatherIcon condition={currentWeather.icon} size="large" />
                    </div>
                    
                    <div className="text-6xl font-bold text-foreground mb-2">
                      {currentWeather.temp}°C
                    </div>
                    
                    <div className="text-xl text-muted-foreground capitalize">
                      {currentWeather.condition}
                    </div>
                  </div>
                )}
              </Card>
            </div>

            {/* 7-Day Forecast */}
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Temperature Forecast in 7 days
              </h2>
              <Card className="p-8 bg-card-glass/80 backdrop-blur-sm border-card-glass-border/20 rounded-3xl">
                {currentWeather && (
                  <div className="mb-6">
                    <div className="flex items-center justify-center gap-2">
                      <MapPin className="h-5 w-5 text-foreground" />
                      <span className="text-xl text-foreground font-medium">
                        {currentWeather.city}
                      </span>
                    </div>
                  </div>
                )}
                
                {forecast.length > 0 && (
                  <>
                    <TemperatureChart data={forecast} />
                    
                    <div className="flex justify-between mt-6 px-4">
                      {forecast.map((day, index) => (
                        <div key={index} className="flex flex-col items-center gap-2">
                          <span className="text-sm text-muted-foreground">
                            {index === 0 ? "Today" : day.day}
                          </span>
                          <WeatherIcon condition={day.icon} size="small" />
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </Card>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-foreground/70">
          Copyright © 2023 Ruo-Fang Wang
        </div>
      </div>
    </div>
  );
};
