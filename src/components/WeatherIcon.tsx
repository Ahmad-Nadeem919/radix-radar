import { Cloud, CloudRain, Sun, CloudSnow, CloudDrizzle, CloudFog } from "lucide-react";

interface WeatherIconProps {
  condition: string;
  size?: "small" | "large";
}

export const WeatherIcon = ({ condition, size = "small" }: WeatherIconProps) => {
  const iconSize = size === "large" ? "h-24 w-24" : "h-8 w-8";
  const iconColor = "text-foreground";

  const getIcon = () => {
    const normalizedCondition = condition.toLowerCase();

    if (normalizedCondition.includes("clear") || normalizedCondition === "sun") {
      return <Sun className={`${iconSize} ${iconColor}`} />;
    }
    if (normalizedCondition.includes("rain") || normalizedCondition === "rain") {
      return <CloudRain className={`${iconSize} ${iconColor}`} />;
    }
    if (normalizedCondition.includes("snow") || normalizedCondition === "snow") {
      return <CloudSnow className={`${iconSize} ${iconColor}`} />;
    }
    if (normalizedCondition.includes("drizzle") || normalizedCondition === "drizzle") {
      return <CloudDrizzle className={`${iconSize} ${iconColor}`} />;
    }
    if (normalizedCondition.includes("fog") || normalizedCondition.includes("mist")) {
      return <CloudFog className={`${iconSize} ${iconColor}`} />;
    }
    // Default to cloudy
    return <Cloud className={`${iconSize} ${iconColor}`} />;
  };

  return <div className="inline-flex items-center justify-center">{getIcon()}</div>;
};
