import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import { Wind, Home, Sun, Cloud, Store} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine  } from 'recharts';


const EnergyGamev2 = () => {
  // Week-long simulation data (24 hours * 7 days = 168 hours)
  const weekData = useMemo(() => ({
    // Wind speed in m/s for each hour of the week
    windSpeed: [
      // Day 1
      1, 2, 2, 3, 4, 3, 2, 2, 3, 4, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 2, 1, 1, 2,
      // Day 2
      2, 3, 3, 2, 1, 2, 3, 4, 5, 6, 6, 5, 4, 3, 2, 3, 4, 3, 2, 2, 3, 4, 3, 2,
      // Day 3
      1, 1, 2, 3, 4, 5, 6, 7, 8, 9, 8, 7, 6, 5, 4, 4, 5, 6, 5, 4, 3, 4, 2, 1,
      // Day 4
      1, 2, 3, 4, 3, 2, 3, 4, 5, 4, 3, 2, 1, 2, 3, 4, 5, 6, 5, 4, 3, 2, 4, 4,
      // Day 5
      2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 4, 5, 6, 5, 4, 3, 2, 1, 2, 3, 4, 4,
      // Day 6
      1, 1, 4, 7, 8, 9, 9, 6, 5, 4, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 1,
      // Day 7
      2, 3, 4, 3, 2, 1, 2, 3, 4, 5, 6, 7, 8, 7, 6, 5, 4, 3, 2, 1, 2, 3, 2, 1
    ],
    // Weather conditions for each hour of the week
    weather: [
      // Day 1
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 2
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 3
      'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy',
      'stormy', 'stormy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 4
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      // Day 5
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'stormy', 'cloudy', 'cloudy',
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 6
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'cloudy', 'cloudy', 'stormy', 'stormy', 'stormy', 'stormy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy',
      // Day 7
      'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'cloudy', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear',
      'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'clear', 'cloudy', 'cloudy', 'cloudy', 'cloudy'
    ],

    
    // Home 1 consumption in kW for each hour of the week (work-from-home pattern)
    home1Consumption: [
      1.00, 1.00, 1.00, 1.00, 1.33, 1.66, 1.99, 2.64, 2.97, 2.97, 2.97, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 1.99, 2.97, 2.64, 2.31, 1.66, 1.33, 1.00,
      1.00, 1.00, 1.00, 1.00, 1.33, 1.66, 1.99, 2.64, 2.97, 2.97, 2.97, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 1.99, 2.97, 2.64, 2.31, 1.66, 1.33, 1.00,
      1.00, 1.00, 1.00, 1.00, 1.33, 1.66, 1.99, 2.64, 2.97, 2.97, 2.97, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 1.99, 2.97, 2.64, 2.31, 1.66, 1.33, 1.00,
      1.00, 1.00, 1.00, 1.00, 1.33, 1.66, 1.99, 2.64, 2.97, 2.97, 2.97, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 1.99, 2.97, 2.64, 2.31, 1.66, 1.33, 1.00,
      1.00, 1.00, 1.00, 1.00, 1.33, 1.66, 1.99, 2.64, 2.97, 2.97, 2.97, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 1.99, 2.97, 2.64, 2.31, 1.66, 1.33, 1.00,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 1.99, 2.31, 2.64, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 2.31, 3.13, 3.13, 2.80, 2.47, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 1.99, 2.31, 2.64, 2.64, 2.31, 2.64, 2.97, 2.64, 2.31, 2.31, 3.13, 3.13, 2.80, 2.47, 1.99, 1.66, 1.33
    ],

    // Home 2 consumption in kW for each hour of the week (office worker pattern)
    home2Consumption: [
      1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 3.30, 2.97, 2.31, 1.00, 1.00, 1.00, 
      1.00, 1.00, 1.00, 1.00, 1.33, 2.31, 3.30, 2.97, 2.64, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 3.30, 2.97, 2.31, 1.00, 1.00, 1.00, 
      1.00, 1.00, 1.00, 1.00, 1.33, 2.31, 3.30, 2.97, 2.64, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 3.30, 2.97, 2.31, 1.00, 1.00, 1.00, 
      1.00, 1.00, 1.00, 1.00, 1.33, 2.31, 3.30, 2.97, 2.64, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 3.30, 2.97, 2.31, 1.00, 1.00, 1.00, 
      1.00, 1.00, 1.00, 1.00, 1.33, 2.31, 3.30, 2.97, 2.64, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.33, 1.66, 3.30, 2.97, 2.31, 1.00, 1.00, 1.00, 
      1.00, 1.00, 1.00, 1.00, 1.33, 2.31, 3.30, 2.97, 2.64, 1.99, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.66, 1.66, 1.99, 2.31, 2.64, 2.97, 2.97, 2.64, 
      2.31, 2.64, 2.64, 2.31, 1.99, 2.97, 3.30, 2.97, 2.64, 2.31, 1.66, 1.33,
      1.33, 1.33, 1.33, 1.33, 1.66, 1.66, 1.99, 2.31, 2.64, 2.97, 2.97, 2.64, 
      2.31, 2.64, 2.64, 2.31, 1.99, 2.97, 3.30, 2.97, 2.64, 2.31, 1.66, 1.33
    ],


    // Home 3 consumption in kW for each hour of the week (family with children pattern)
    home3Consumption: [
      // Day 1
      2, 2, 2, 2, 3, 5, 7, 7, 7, 3, 3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 6, 4, 3, 2,
      // Day 2
      2, 2, 2, 2, 3, 5, 7, 7, 7, 3, 3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 6, 4, 3, 2,
      // Day 3
      2, 2, 2, 2, 3, 5, 7, 7, 7, 3, 3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 6, 4, 3, 2,
      // Day 4
      2, 2, 2, 2, 3, 5, 7, 7, 7, 3, 3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 6, 4, 3, 2,
      // Day 5
      2, 2, 2, 2, 3, 5, 7, 7, 7, 3, 3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 6, 4, 3, 2,
      // Day 6
      3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 7, 7, 7, 7, 6, 5, 4, 3,
      // Day 7
      3, 3, 3, 3, 3, 4, 6, 7, 7, 7, 7, 7, 6, 6, 6, 6, 7, 7, 7, 7, 6, 5, 4, 3,
    ],

    // Small business consumption in kW for each hour of the week (replaces the original community building)
    businessConsumption: [
      // Day 1
      1, 1, 1, 1, 1, 1, 2, 5, 8, 10, 10, 10, 10, 10, 10, 8, 5, 4, 3, 2, 1, 1, 1, 1,
      // Day 2
      1, 1, 1, 1, 1, 1, 2, 5, 8, 10, 10, 10, 10, 10, 10, 8, 5, 4, 3, 2, 1, 1, 1, 1,
      // Day 3
      1, 1, 1, 1, 1, 1, 2, 5, 8, 10, 10, 10, 10, 10, 10, 8, 5, 4, 3, 2, 1, 1, 1, 1,	
      // Day 4
      1, 1, 1, 1, 1, 1, 2, 5, 8, 10, 10, 10, 10, 10, 10, 8, 5, 4, 3, 2, 1, 1, 1, 1,
      // Day 5
      1, 1, 1, 1, 1, 1, 2, 5, 8, 10, 10, 10, 10, 10, 10, 8, 5, 4, 3, 2, 1, 1, 1, 1,
      // Day 6
      0, 0, 0, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 2, 0, 0, 0, 0, 0, 0, 0, 0,
      // Day 7
      0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    ]
  }), []);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  // Game state
  const [currentHour, setCurrentHour] = useState(0);
  const [money, setMoney] = useState(0); // Start with 0 euros
  const [moneyAlone, setMoneyAlone] = useState(0); // Money if each consumer/generator acted alone
  const [generationStandalone, setGenerationStandalone] = useState(0); // Revenue from generation valued at selling price
  const [consumptionStandalone, setConsumptionStandalone] = useState(0); // Cost of consumption valued at buying price (negative)
  const [communityPrice, setCommunityPrice] = useState(0.20); // Average of buy and sell prices
  const [generationCommunity, setGenerationCommunity] = useState(0); // Generation with community pricing
  const [consumptionCommunity, setConsumptionCommunity] = useState(0); // Consumption with community pricing
  const [cashBalanceHistory, setCashBalanceHistory] = useState([0]); // Track cash balance history
  const [cashAloneHistory, setCashAloneHistory] = useState([0]); // Track cash balance history for standalone scenario
  const [generationHistory, setGenerationHistory] = useState([0]); // Track standalone generation revenue
  const [consumptionHistory, setConsumptionHistory] = useState([0]); // Track standalone consumption cost
  const [communityPriceHistory, setCommunityPriceHistory] = useState([0.20]); // Track community price history
  const [generationCommunityHistory, setGenerationCommunityHistory] = useState([0]); // Track community generation history
  const [consumptionCommunityHistory, setConsumptionCommunityHistory] = useState([0]); // Track community consumption history
  const [gameRunning, setGameRunning] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [buyPrice, setBuyPrice] = useState(0.30); // euros per kWh
  const [sellPrice, setSellPrice] = useState(0.10); // euros per kWh
  const [gameSpeed, setGameSpeed] = useState(1); // Default speed is 1x
  
  // Asset counts
  const [windFarmCount, setWindFarmCount] = useState(0);
  const [solarPanelCount, setSolarPanelCount] = useState(0);
  const [home1Count, setHome1Count] = useState(0);
  const [home2Count, setHome2Count] = useState(0);
  const [home3Count, setHome3Count] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);

  // Max power values
  const [maxWindPower, setMaxWindPower] = useState(10); // kW per wind farm
  const [maxSolarPower, setMaxSolarPower] = useState(10); // kW per solar panel
  
  const [showDebug, setShowDebug] = useState(false); // Toggle for debug information

  // Calculate wind energy production based on hour and count
  const calculateWindProduction = useCallback((hour, count) => {
    const windSpeed = weekData.windSpeed[hour];
    return maxWindPower * Math.max(0, windSpeed / 9) * count;
  }, [weekData.windSpeed, maxWindPower]);

  // Calculate solar energy production based on hour, weather and count
  const calculateSolarProduction = useCallback((hour, count) => {
    const time = hour % 24; // Time of day
    const weather = weekData.weather[hour];
    
    // Daylight hours (6am to 6pm)
    if (time >= 6 && time <= 18) {
      // Base solar production depends on time of day
      const timeEfficiency = 1 - Math.abs((time - 12) / 6);
      
      // Weather effects on solar
      let weatherMultiplier = 0;
      if (weather === 'clear') {
        weatherMultiplier = 1.0;
      } else if (weather === 'cloudy') {
        weatherMultiplier = 0.4;
      } else if (weather === 'stormy') {
        weatherMultiplier = 0.2;
      }
      
      return maxSolarPower * timeEfficiency * weatherMultiplier * count;
    }
    
    return 0;
  }, [weekData.weather, maxSolarPower]);

  const [windEnergyProduced, setWindEnergyProduced] = useState(0);
  const [solarEnergyProduced, setSolarEnergyProduced] = useState(0);
  const [totalEnergyProduced, setTotalEnergyProduced] = useState(0);
  
  // State variables for consumption values
  const [home1EnergyConsumed, setHome1EnergyConsumed] = useState(0);
  const [home2EnergyConsumed, setHome2EnergyConsumed] = useState(0);
  const [home3EnergyConsumed, setHome3EnergyConsumed] = useState(0);
  const [businessEnergyConsumed, setBusinessEnergyConsumed] = useState(0);
  const [totalEnergyConsumed, setTotalEnergyConsumed] = useState(0);

  // Calculate home 1 consumption
  const calculateHome1Consumption = useCallback((hour) => {
    return weekData.home1Consumption[hour] * home1Count;
  }, [weekData.home1Consumption, home1Count]);

  // Calculate home 2 consumption
  const calculateHome2Consumption = useCallback((hour) => {
    return weekData.home2Consumption[hour] * home2Count;
  }, [weekData.home2Consumption, home2Count]);

  // Calculate home 3 consumption
  const calculateHome3Consumption = useCallback((hour) => {
    return weekData.home3Consumption[hour] * home3Count;
  }, [weekData.home3Consumption, home3Count]);

  // Calculate business consumption
  const calculateBusinessConsumption = useCallback((hour) => {
    return weekData.businessConsumption[hour] * businessCount;
  }, [weekData.businessConsumption, businessCount]);

  // Get current home 1 consumption (for UI display)
  const getHome1Consumption = useCallback(() => {
    return home1EnergyConsumed;
  }, [home1EnergyConsumed]);

  // Get current home 2 consumption (for UI display)
  const getHome2Consumption = useCallback(() => {
    return home2EnergyConsumed;
  }, [home2EnergyConsumed]);

  // Get current home 3 consumption (for UI display)
  const getHome3Consumption = useCallback(() => {
    return home3EnergyConsumed;
  }, [home3EnergyConsumed]);

  // Get current business consumption (for UI display)
  const getBusinessConsumption = useCallback(() => {
    return businessEnergyConsumed;
  }, [businessEnergyConsumed]);

  // Get total consumption across all buildings (for UI display)
  const getTotalConsumption = useCallback(() => {
    return totalEnergyConsumed;
  }, [totalEnergyConsumed]);

  // Initialize energy production and consumption on component mount
  useEffect(() => {
    const initialWindProduction = calculateWindProduction(0, windFarmCount);
    const initialSolarProduction = calculateSolarProduction(0, solarPanelCount);
    const initialTotalProduction = initialWindProduction + initialSolarProduction;
    
    const initialHome1Consumption = calculateHome1Consumption(0);
    const initialHome2Consumption = calculateHome2Consumption(0);
    const initialHome3Consumption = calculateHome3Consumption(0);
    const initialBusinessConsumption = calculateBusinessConsumption(0);
    const initialTotalConsumption = initialHome1Consumption + initialHome2Consumption + 
                                    initialHome3Consumption + initialBusinessConsumption;
    
    // Initialize production and consumption values without affecting money
    setWindEnergyProduced(initialWindProduction);
    setSolarEnergyProduced(initialSolarProduction);
    setTotalEnergyProduced(initialTotalProduction);
    
    setHome1EnergyConsumed(initialHome1Consumption);
    setHome2EnergyConsumed(initialHome2Consumption);
    setHome3EnergyConsumed(initialHome3Consumption);
    setBusinessEnergyConsumed(initialBusinessConsumption);
    setTotalEnergyConsumed(initialTotalConsumption);
    
    // Money will be calculated in the game loop when started
  }, [calculateWindProduction, calculateSolarProduction, calculateHome1Consumption, 
      calculateHome2Consumption, calculateHome3Consumption, calculateBusinessConsumption, 
      windFarmCount, solarPanelCount]);

  // Format time to display - memoized to avoid recreation on each render
  const formatHour = useCallback((hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  // Get current weather for display - memoized
  const getCurrentWeather = useCallback(() => {
    return weekData.weather[currentHour];
  }, [weekData.weather, currentHour]);

  // Get current wind speed for display - memoized
  const getCurrentWindSpeed = useCallback(() => {
    return weekData.windSpeed[currentHour];
  }, [weekData.windSpeed, currentHour]);

  // Calculate grid interaction - memoized 
  const getGridInteraction = useCallback(() => {
    return getTotalConsumption() - totalEnergyProduced;
  }, [getTotalConsumption, totalEnergyProduced]);

  // Calculate net consumption forecast
  const getNetConsumptionForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.windSpeed.length;
      const time = (currentHour + i) % 24;
      
      // Get consumption values
      const home1Consumption = calculateHome1Consumption(hour);
      const home2Consumption = calculateHome2Consumption(hour);
      const home3Consumption = calculateHome3Consumption(hour);
      const businessConsumption = calculateBusinessConsumption(hour);
      
      // Use utility functions to calculate production
      const windProduction = calculateWindProduction(hour, windFarmCount);
      const solarProduction = calculateSolarProduction(hour, solarPanelCount);
      
      // Calculate total consumption and production
      const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
      const totalProduction = windProduction + solarProduction;
      
      // Net consumption (positive means importing, negative means exporting)
      const netConsumption = totalConsumption - totalProduction;
      
      forecast.push({
        hour: time,
        netConsumption: netConsumption,
        importing: Math.max(0, netConsumption),
        exporting: Math.max(0, -netConsumption)
      });
    }
    return forecast;
  }, [currentHour, weekData, calculateHome1Consumption, calculateHome2Consumption, 
      calculateHome3Consumption, calculateBusinessConsumption,
      windFarmCount, solarPanelCount, calculateWindProduction, calculateSolarProduction]);

  // Get wind forecast data for the next 24 hours - memoized
  const getWindForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.windSpeed.length;
      // Use utility function with count=1 since this is a forecast per unit
      const production = calculateWindProduction(hour, 1);
      forecast.push({
        hour: (currentHour + i) % 24,
        production: production
      });
    }
    return forecast;
  }, [currentHour, calculateWindProduction, weekData.windSpeed.length]);

  const getSolarForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.weather.length;
      // Use utility function with count=1 since this is a forecast per unit
      const production = calculateSolarProduction(hour, 1);
      
      forecast.push({
        hour: (currentHour + i) % 24,
        production: production
      });
    }
    return forecast;
  }, [currentHour, calculateSolarProduction, weekData.weather.length]);

  
  // Create forecast data functions for each home
  const getHome1Forecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.home1Consumption.length;
      forecast.push({
        hour: (currentHour + i) % 24,
        consumption: weekData.home1Consumption[hour]
      });
    }
    return forecast;
  }, [currentHour, weekData.home1Consumption]);

  const getHome2Forecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.home2Consumption.length;
      forecast.push({
        hour: (currentHour + i) % 24,
        consumption: weekData.home2Consumption[hour]
      });
    }
    return forecast;
  }, [currentHour, weekData.home2Consumption]);

const getHome3Forecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.home3Consumption.length;
      forecast.push({
        hour: (currentHour + i) % 24,
        consumption: weekData.home3Consumption[hour]
      });
    }
    return forecast;
  }, [currentHour, weekData.home3Consumption]);

  const getBusinessForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.businessConsumption.length;
      forecast.push({
        hour: (currentHour + i) % 24,
        consumption: weekData.businessConsumption[hour]
      });
    }
    return forecast;
  }, [currentHour, weekData.businessConsumption]);

// Reset game function
  const resetGame = useCallback(() => {
    // Stop the game if it's running
    setGameRunning(false);
    
    // Reset all state variables to initial values
    setCurrentHour(0);
    setMoney(0);
    setCashBalanceHistory([0]); // Reset cash balance history with initial value
    setDayCount(1);
    setGameSpeed(1);
    setHourStarted(false);
	
	setMaxWindPower(10); // kW per wind farm
    setMaxSolarPower(10); // kW per solar panel
    
    // Reset asset counts
    setWindFarmCount(0);
    setSolarPanelCount(0);
    setHome1Count(0);
    setHome2Count(0);
    setHome3Count(0);
    setBusinessCount(0);
	
	setMoneyAlone(0);
    setGenerationStandalone(0);
    setConsumptionStandalone(0);
    setGenerationCommunity(0);
    setConsumptionCommunity(0);
    setCommunityPrice((buyPrice + sellPrice) / 2); // Initialize community price
    setCashAloneHistory([0]); // Reset standalone cash balance history
    setGenerationHistory([0]); // Reset standalone generation revenue history
    setConsumptionHistory([0]); // Reset standalone consumption cost history
    setCommunityPriceHistory([(buyPrice + sellPrice) / 2]); // Reset community price history
    setGenerationCommunityHistory([0]); // Reset community generation history
    setConsumptionCommunityHistory([0]); // Reset community consumption history
	
	// Reset prices to initial values
	setBuyPrice(0.30);  // Reset to default buy price (€0.30/kWh)
	setSellPrice(0.10); // Reset to default sell price (€0.10/kWh)
	setCommunityPrice(0.20); // Reset community price
    
    setShowDebug(false); // Uncheck debug checkbox
    
    // Calculate initial production values (with zero assets)
    const initialWindProduction = calculateWindProduction(0, 0);
    const initialSolarProduction = calculateSolarProduction(0, 0);
    
    // Calculate initial consumption values (with zero assets)
    const initialHome1Consumption = calculateHome1Consumption(0);
    const initialHome2Consumption = calculateHome2Consumption(0);
    const initialHome3Consumption = calculateHome3Consumption(0);
    const initialBusinessConsumption = calculateBusinessConsumption(0);
    const initialTotalConsumption = initialHome1Consumption + initialHome2Consumption + 
                                  initialHome3Consumption + initialBusinessConsumption;
    
    // Set initial energy production values
    setWindEnergyProduced(initialWindProduction);
    setSolarEnergyProduced(initialSolarProduction);
    setTotalEnergyProduced(initialWindProduction + initialSolarProduction);
    
    // Set initial consumption values
    setHome1EnergyConsumed(initialHome1Consumption);
    setHome2EnergyConsumed(initialHome2Consumption);
    setHome3EnergyConsumed(initialHome3Consumption);
    setBusinessEnergyConsumed(initialBusinessConsumption);
    setTotalEnergyConsumed(initialTotalConsumption);
    
    // Reset time accumulators and refs
    timeAccumulatorRef.current = 0;
    lastDayTransitionRef.current = null;
  }, [calculateWindProduction, calculateSolarProduction, calculateHome1Consumption, 
      calculateHome2Consumption, calculateHome3Consumption, calculateBusinessConsumption, buyPrice, sellPrice]);

  // Track values for the current hour and animation
  const [hourStarted, setHourStarted] = useState(false);
  
  // Track elapsed time for hour updates using a ref for better performance
  const timeAccumulatorRef = useRef(0);
  const lastDayTransitionRef = useRef(null);

  // Effect to update when asset counts change
  useEffect(() => {
    // Only update if the game is running to avoid unnecessary calculations
    if (gameRunning) {
      // Recalculate wind and solar production with new counts
      const windProduction = calculateWindProduction(currentHour, windFarmCount);
      const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);
      
      // Update the state with new values
      setWindEnergyProduced(windProduction);
      setSolarEnergyProduced(solarProduction);
      setTotalEnergyProduced(windProduction + solarProduction);
    }
  }, [windFarmCount, solarPanelCount, gameRunning, currentHour, 
      calculateWindProduction, calculateSolarProduction]);

  // Effect to update consumption values when consumer counts change
  useEffect(() => {
    // Only update if the game is running to avoid unnecessary calculations
    if (gameRunning) {
      // Recalculate consumption with new consumer counts
      const home1Consumption = calculateHome1Consumption(currentHour);
      const home2Consumption = calculateHome2Consumption(currentHour);
      const home3Consumption = calculateHome3Consumption(currentHour);
      const businessConsumption = calculateBusinessConsumption(currentHour);
      const totalConsumption = home1Consumption + home2Consumption + 
                               home3Consumption + businessConsumption;
      
      // Update the state with new values
      setHome1EnergyConsumed(home1Consumption);
      setHome2EnergyConsumed(home2Consumption);
      setHome3EnergyConsumed(home3Consumption);
      setBusinessEnergyConsumed(businessConsumption);
      setTotalEnergyConsumed(totalConsumption);
    }
  }, [home1Count, home2Count, home3Count, businessCount, gameRunning, currentHour,
      calculateHome1Consumption, calculateHome2Consumption, 
      calculateHome3Consumption, calculateBusinessConsumption]);

  // Effect to update energy production when max power values change
  useEffect(() => {
    // Only update if the game is running to avoid unnecessary calculations
    if (gameRunning) {
      // Recalculate wind and solar production with new max power values
      const windProduction = calculateWindProduction(currentHour, windFarmCount);
      const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);
      
      // Update the state with new values
      setWindEnergyProduced(windProduction);
      setSolarEnergyProduced(solarProduction);
      setTotalEnergyProduced(windProduction + solarProduction);
    }
  }, [maxWindPower, maxSolarPower, gameRunning, currentHour, 
      windFarmCount, solarPanelCount, calculateWindProduction, calculateSolarProduction]);

  // Handle game logic with split rendering and game hour cycles
  useEffect(() => {
    if (!gameRunning) return;

    // Fast rendering loop (0.1 seconds)
    const renderLoop = setInterval(() => {
      // If we haven't calculated values for this hour yet, do so now
      if (!hourStarted) {
        // Calculate current consumption values
        const home1Consumption = calculateHome1Consumption(currentHour);
        const home2Consumption = calculateHome2Consumption(currentHour);
        const home3Consumption = calculateHome3Consumption(currentHour);
        const businessConsumption = calculateBusinessConsumption(currentHour);
        const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
        
        // Calculate wind and solar production using utility functions
        const windProduction = calculateWindProduction(currentHour, windFarmCount);
        const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);
        
        // Calculate total energy production
        const totalProduction = windProduction + solarProduction;
        
        // Calculate grid interaction (grid imbalance)
        const gridInteraction = totalConsumption - totalProduction;
        
        // Calculate financial impact based on grid interaction
        const financialImpact = gridInteraction > 0 
          ? -gridInteraction * buyPrice  // Buying energy (cost)
          : -gridInteraction * sellPrice; // Selling energy (revenue)
        
        // Calculate financial impact for standalone scenario (no community benefit)
		// All consumption is billed at buy price, all generation compensated at sell price
		const standaloneCost = -totalConsumption * buyPrice; // Cost for all consumption (negative value)
		const standaloneRevenue = totalProduction * sellPrice; // Revenue for all generation (positive value)
		const standaloneFinancialImpact = standaloneCost + standaloneRevenue;
		
		// Calculate community price (average of buy and sell prices)
		const newCommunityPrice = (buyPrice + sellPrice) / 2;
		
		// Calculate community scenario values
		// If production <= consumption, all production valued at community price
		// Any excess production valued at sell price
		// If consumption <= production, all consumption valued at community price
		// Any excess consumption valued at buy price
		let communityGenerationRevenue = 0;
		let communityCostConsumption = 0;
		
		if (totalProduction <= totalConsumption) {
		  // All generation gets community price
		  communityGenerationRevenue = totalProduction * newCommunityPrice;
		  // Part of consumption gets community price, excess gets buy price
		  communityCostConsumption = -(totalProduction * newCommunityPrice + 
		                             (totalConsumption - totalProduction) * buyPrice);
		} else {
		  // Part of generation gets community price, excess gets sell price
		  communityGenerationRevenue = totalConsumption * newCommunityPrice + 
		                              (totalProduction - totalConsumption) * sellPrice;
		  // All consumption gets community price
		  communityCostConsumption = -(totalConsumption * newCommunityPrice);
		}

		// Get the current balance from history to ensure we're building on the correct value
		const currentBalance = cashBalanceHistory.length > 0 ? 
		  cashBalanceHistory[cashBalanceHistory.length - 1] : 0;
		const currentStandaloneBalance = cashAloneHistory.length > 0 ?
		  cashAloneHistory[cashAloneHistory.length - 1] : 0;
		const currentGeneration = generationHistory.length > 0 ?
		  generationHistory[generationHistory.length - 1] : 0;
		const currentConsumption = consumptionHistory.length > 0 ?
		  consumptionHistory[consumptionHistory.length - 1] : 0;
		const currentCommunityGeneration = generationCommunityHistory.length > 0 ?
		  generationCommunityHistory[generationCommunityHistory.length - 1] : 0;
		const currentCommunityConsumption = consumptionCommunityHistory.length > 0 ?
		  consumptionCommunityHistory[consumptionCommunityHistory.length - 1] : 0;

		// Calculate the new values for this hour
		const newBalance = currentBalance + financialImpact;
		const newStandaloneBalance = currentStandaloneBalance + standaloneFinancialImpact;
		const newGeneration = currentGeneration + standaloneRevenue;
		const newConsumption = currentConsumption + standaloneCost;
		const newCommunityGeneration = currentCommunityGeneration + communityGenerationRevenue;
		const newCommunityConsumption = currentCommunityConsumption + communityCostConsumption;

		// Update money states
		setMoney(newBalance);
		setMoneyAlone(newStandaloneBalance);
		setGenerationStandalone(newGeneration);
		setConsumptionStandalone(newConsumption);
		setCommunityPrice(newCommunityPrice);
		setGenerationCommunity(newCommunityGeneration);
		setConsumptionCommunity(newCommunityConsumption);

		// Update cash balance histories
		setCashBalanceHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newBalance;
		  return newHistory;
		});

		setCashAloneHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newStandaloneBalance;
		  return newHistory;
		});
		
		// Update standalone generation and consumption histories
		setGenerationHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newGeneration;
		  return newHistory;
		});
		
		setConsumptionHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newConsumption;
		  return newHistory;
		});
		
		// Update community price, generation and consumption histories
		setCommunityPriceHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newCommunityPrice;
		  return newHistory;
		});
		
		setGenerationCommunityHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newCommunityGeneration;
		  return newHistory;
		});
		
		setConsumptionCommunityHistory(prevHistory => {
		  const newHistory = [...prevHistory];
		  newHistory[currentHour] = newCommunityConsumption;
		  return newHistory;
		});
        
        // Mark that we've calculated values for this hour
        setHourStarted(true);
        
        // Update all energy state values
        setWindEnergyProduced(windProduction);
        setSolarEnergyProduced(solarProduction);
        setTotalEnergyProduced(totalProduction);
        
        // Update consumption state values
        setHome1EnergyConsumed(home1Consumption);
        setHome2EnergyConsumed(home2Consumption);
        setHome3EnergyConsumed(home3Consumption);
        setBusinessEnergyConsumed(businessConsumption);
        setTotalEnergyConsumed(totalConsumption);
        
        // For debugging - log the current hour's financial details
        if (showDebug) {
          console.log(`Hour ${currentHour} financial details:`, {
            gridInteraction: gridInteraction.toFixed(2),
            financialImpact: financialImpact.toFixed(2),
            solarProduction: solarProduction.toFixed(2),
            windProduction: windProduction.toFixed(2),
            totalConsumption: totalConsumption.toFixed(2),
            newBalance: newBalance.toFixed(2)
          });
        }
      }
      
      // Accumulate time for hour changes using ref for better performance
      timeAccumulatorRef.current += 0.01 * gameSpeed; // 0.01 seconds per render cycle
      
      // If we've accumulated 1 second or more, update the hour
      if (timeAccumulatorRef.current >= 1) {
        // Reset accumulator and update hour
        setCurrentHour(prevHour => {
          const nextHour = prevHour + 1;
          
          if (nextHour >= weekData.windSpeed.length) {
            // End of week, stop the game
            setGameRunning(false);
            return prevHour;
          }
          
          // Check for new day here using nextHour
          if (nextHour % 24 === 0 && lastDayTransitionRef.current !== nextHour) {
            lastDayTransitionRef.current = nextHour;
            setDayCount((prevDay) => prevDay + 1);
          }
          
          // Reset the hourStarted flag to recalculate values for the new hour
          setHourStarted(false);
          
          return nextHour;
        });

        // Reset the accumulator
        timeAccumulatorRef.current = 0;
      }
      
    }, 10); // Render loop runs every 0.01 seconds (100 FPS)
    
    return () => clearInterval(renderLoop);
  }, [gameRunning, buyPrice, sellPrice, currentHour, cashBalanceHistory, cashAloneHistory,
      generationHistory, consumptionHistory, communityPriceHistory,
      generationCommunityHistory, consumptionCommunityHistory,
      weekData, hourStarted, gameSpeed, showDebug,
      windFarmCount, solarPanelCount, calculateWindProduction, calculateSolarProduction,
      calculateHome1Consumption, calculateHome2Consumption, calculateHome3Consumption, 
      calculateBusinessConsumption]);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-blue-100 text-gray-800">   
     <div className="flex justify-between items-center mb-6">
  <div className="w-1/4">
    <h2 className="text-2xl font-bold">Energy Community Simulator v2</h2> 
    <span className="text-base font-normal text-gray-600">by Iacopo Savelli (iacopo.savelli@unibocconi.it)</span>
    <p className="text-lg">Day: {dayCount} | Time: {formatHour(currentHour % 24)} | Weather: {getCurrentWeather()}</p>
  </div>
  
  <div className="w-1/2 text-center">
    <div className="bg-blue-50 rounded-lg p-4 shadow text-center">
	{/*<h3 className="text-xl font-bold">Results</h3>*/}
      <div className="flex justify-between items-center mt-2">
        <div>
          <p className="text-gray-600 font-bold">Total Consumption</p>
          <p className="text-2xl font-bold">{getTotalConsumption().toFixed(1)} kW</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">Total Generation</p>
          <p className="text-2xl font-bold">{totalEnergyProduced.toFixed(1)} kW</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">{getGridInteraction() > 0 ? 'Importing from Grid' : 'Exporting to Grid'}</p>
          <p className={`text-2xl font-bold ${getGridInteraction() > 0 ? 'text-red-500' : 'text-green-500'}`}>
            {Math.abs(getGridInteraction()).toFixed(1)} kW
          </p>
        </div>
		<div>
          <p className="text-gray-600 font-bold">Import Price</p>
          <p className="text-2xl text-red-600 font-bold">€{buyPrice.toFixed(2)}/kWh</p>
        </div>
      </div>
      <div className="flex justify-between items-center mt-2 border-t pt-2">
        <div>
          <p className="text-gray-600 font-bold">Standalone Balance €</p>
          <p className={`text-2xl font-bold ${moneyAlone >= 0 ? ' text-green-600' : ' text-red-600'}`}>€{moneyAlone.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">Standalone Gen. Revenue</p>
          <p className="text-2xl font-bold text-green-600">€{generationStandalone.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">Standalone Cons. Cost</p>
          <p className="text-2xl font-bold text-red-600">€{consumptionStandalone.toFixed(2)}</p>
        </div>
		<div>
          <p className="text-gray-600 font-bold">Export Price</p>
          <p className="text-2xl text-green-600 font-bold">€{sellPrice.toFixed(2)}/kWh</p>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-2 border-t pt-2">
        <div>
          <p className="text-gray-600 font-bold">Community Balance €</p>
          <p className={`text-2xl font-bold ${money >= 0 ? 'text-green-600' : 'text-red-600'}`}>€{money.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">Comm. Gen. Revenue</p>
          <p className="text-2xl font-bold text-green-600">€{generationCommunity.toFixed(2)}</p>
        </div>
        <div>
          <p className="text-gray-600 font-bold">Comm. Cons. Cost</p>
          <p className="text-2xl font-bold text-red-600">€{consumptionCommunity.toFixed(2)}</p>
        </div>
		<div>
          <p className="text-gray-600 font-bold">Community Price</p>
          <p className="text-2xl text-blue-600 font-bold">€{communityPrice.toFixed(2)}/kWh</p>
        </div>
      </div>
    </div>
  </div>
  
  <div className="w-1/4 text-right">
  <div className="flex flex-col items-end">
    {/* Pause and Reset buttons */}
    <div className="flex justify-end mb-2">
      <button 
        onClick={() => setGameRunning(!gameRunning)}
        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
      >
        {gameRunning ? 'Pause' : 'Start'}
      </button>
      
      <button 
        onClick={resetGame}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 ml-2"
      > 
        Reset
      </button>
    </div>
    
    {/* Speed controls */}
    <div className="flex items-center">
      <span className="mr-2">Speed:</span>
      <button 
        onClick={() => setGameSpeed(1)}
        className={`px-2 py-1 mx-1 rounded ${gameSpeed === 1 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
      >
        1x
      </button>
      <button 
        onClick={() => setGameSpeed(2)}
        className={`px-2 py-1 mx-1 rounded ${gameSpeed === 2 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
      >
        2x
      </button>
      <button 
        onClick={() => setGameSpeed(5)}
        className={`px-2 py-1 mx-1 rounded ${gameSpeed === 5 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
      >
        5x
      </button>
      <button 
        onClick={() => setGameSpeed(10)}
        className={`px-2 py-1 mx-1 rounded ${gameSpeed === 10 ? 'bg-green-500 text-white' : 'bg-gray-300'}`}
      >
        10x
      </button>
    </div>
  </div>
</div>
</div>


         
      {/* Main components layout - side-by-side with wind/solar on left and homes on right */}
      <div className="flex flex-row space-x-4">
        {/* Left Column - Energy Sources */}
        <div className="flex flex-col space-y-8 w-1/4">
			
		<div className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
        <h2 className="text-xl font-bold text-center mb-4">Generators</h2>
		
		<div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-blue-300 mb-4">
        {/* Wind Farm Section */}
        <div className="text-center w-full">
          {/* Wind Production Forecast Chart */}
          <div className="h-32 w-full mb-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={getWindForecast()}>
            <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}  label={{value: "Hours", position: "insideBottom", offset: -2}} />
            <YAxis 
              tick={{fontSize: 10}}
              label={{ 
                value: 'kW', 
                angle: -90
              }}
            />
            <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Wind']} />
            <Line type="monotone" dataKey="production" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          </div>
          <div className="flex justify-center items-center">
          <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center">
            <Wind 
            size={80} 
            className="text-blue-500" 
            style={{ width: `${20 + getCurrentWindSpeed() * 20}px` }} 
            />
          </div>
          </div>
          <h3 className="text-xl mt-2">Wind Turbine ({maxWindPower} kW)</h3>
          <p>Wind Speed: {getCurrentWindSpeed()} m/s</p>	  
		  <p>Energy: <span className="font-bold">{windFarmCount !== 0 ? (windEnergyProduced/windFarmCount).toFixed(1) + " kW" : "not selected"}</span></p>
        </div>
		</div>
		



    {/* Solar Panel Section */}
	<div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-yellow-300">
    <div className="text-center w-full">
    {/* Solar Production Forecast Chart */}
    <div className="h-32 w-full mb-2">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={getSolarForecast()}>
        <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}label={{value: "Hours", position: "insideBottom", offset: -2}} />
            <YAxis 
              tick={{fontSize: 10}}
              label={{ 
                value: 'kW', 
                angle: -90
              }}
            />
        <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Solar']} />
        <Line type="monotone" dataKey="production" stroke="#f59e0b" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
    </div>

    {/* 2x1 Layout for Solar Panel, Sun/Moon and Weather elements */}
    <div className="flex justify-between items-center">
    {/* Left side - Solar panel frame */}
    <div className="w-1/2 flex justify-end pr-4">
      <div className="w-32 h-32 bg-blue-900 rounded-lg flex items-center justify-center p-2 overflow-hidden">
        {/* Solar panel frame */}
        <div className="w-full h-full border-2 border-gray-700 rounded bg-blue-800 flex flex-col">
          {/* Solar cells - 3x3 grid */}
          <div className="grid grid-cols-3 grid-rows-3 gap-1 p-1 flex-grow">
            {[...Array(9)].map((_, i) => (
              <div 
                key={i}
                className={`rounded flex items-center justify-center ${
                  (currentHour % 24) >= 6 && (currentHour % 24) <= 18
                    ? solarEnergyProduced > 0 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
                      : 'bg-blue-950'
                    : 'bg-gray-900' // Darker at night
                }`}
                style={{
                  transition: 'all 0.3s ease',
                  boxShadow: (currentHour % 24) >= 6 && (currentHour % 24) <= 18 && solarEnergyProduced > 0 
                    ? 'inset 0 0 5px rgba(255, 255, 255, 0.5)' 
                    : 'none'
                }}
              >
                {/* Reflective highlights */}
                {(currentHour % 24) >= 6 && (currentHour % 24) <= 18 && solarEnergyProduced > 0 && (
                  <div className="w-1/3 h-1/3 bg-white opacity-20 rounded-full" />
                )}
                
                {/* Night time appearance - small star reflection */}
                {((currentHour % 24) < 6 || (currentHour % 24) > 18) && i % 4 === 0 && (
                  <div className="w-1 h-1 bg-white opacity-10 rounded-full" />
                )}
              </div>
            ))}
          </div>
          
          {/* Panel connection - red point becomes green when generating */}
          <div className="h-3 bg-gray-700 flex justify-start px-1">
            <div 
              className={`w-2 h-2 rounded-full mt-0.5 transition-colors duration-300 ${
                solarEnergyProduced > 0 ? 'bg-green-500' : 'bg-red-500'
              }`} 
            />
          </div>
        </div>
      </div>
    </div>

{/* Right side - Sun/Moon indicator with Weather overlay */}
    <div className="w-1/2 flex justify-start pl-4">
      <div className="relative">
        {(currentHour % 24) > 6 && (currentHour % 24) <= 18 ? (
          // Sun indicator with rays during day
          <div 
            className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
              solarEnergyProduced > 0 ? 'opacity-100' : 'opacity-20'
            }`}
            style={{
              background: solarEnergyProduced > 0 ? '#fbbf24' : '#9ca3af',
              boxShadow: solarEnergyProduced > 0 
                ? '0 0 20px rgba(251, 191, 36, 0.7)' 
                : 'none'
            }}
          >
            {/* Sun rays */}
            {solarEnergyProduced > 0 && (
              <>
                <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                    style={{transform: 'rotate(0deg) translateY(-16px)'}} />
                <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                    style={{transform: 'rotate(45deg) translateY(-16px)'}} />
                <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                    style={{transform: 'rotate(90deg) translateY(-16px)'}} />
                <div className="absolute w-2 h-14 bg-yellow-300 animate-pulse" 
                    style={{transform: 'rotate(135deg) translateY(-16px)'}} />
              </>
            )}
            <Sun 
              size={36} 
              fill={solarEnergyProduced > 0 ? "#ffffff" : "#9ca3af"} 
              className="text-yellow-500 z-10" 
            />
          </div>
        ) : (
          // Moon indicator during night
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center bg-gray-800"
            style={{
              boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)'
            }}
          >
            {/* Moon symbol */}
            <div className="w-16 h-16 rounded-full bg-gray-300 relative overflow-hidden">
              <div className="absolute w-12 h-12 rounded-full bg-gray-800" 
                  style={{top: '-3px', right: '-8px'}} />
            </div>
          </div>
        )}
        
        {/* Weather indicators */}
        {getCurrentWeather() === 'cloudy' && (
          <Cloud size={80} className="absolute top-10 -right-4 text-gray-400 z-10" fill="currentColor" />
        )}
        {getCurrentWeather() === 'stormy' && (
          <div className="absolute top-10 -right-4 z-10">
            <Cloud size={80} className="text-gray-400" fill="currentColor" />
            <div className="absolute bottom-2 left-8 text-yellow-500 text-4xl">⚡</div>
          </div>
        )}
      </div>
    </div>
    </div>

    <h3 className="text-xl mt-2">Photovoltaic Panel ({maxSolarPower} kW)</h3>	
	<p>Energy: <span className="font-bold">{solarPanelCount !== 0 ? (solarEnergyProduced/solarPanelCount).toFixed(1) + " kW" : "not selected"}</span></p>
    <p>
    {(currentHour % 24) >= 6 && (currentHour % 24) <= 18 
      ? getCurrentWeather() === 'clear' 
        ? 'Clear sky - optimal generation' 
        : getCurrentWeather() === 'cloudy' 
          ? 'Cloudy - reduced efficiency' 
          : 'Stormy - minimal generation'
      : 'Night - no generation'}
    </p>
    </div>
    </div>
	</div>
	</div>





    {/* Center Column - Net Consumption Chart */}
    <div className="w-1/4 bg-white rounded-lg p-4 shadow-md">
    <h2 className="text-xl font-bold text-center mb-4">Net Grid Power Flow <br />
      <span className="text-base font-normal text-gray-700">(import positive/export negative)</span> 
    </h2>
    <div className="h-64 w-full mb-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getNetConsumptionForecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
            <YAxis 
              tick={{fontSize: 10}}
              label={{ 
                value: 'kW', 
                angle: -90
              }}
            />
          <Tooltip formatter={(value, name) => {
            return [`${Math.abs(value).toFixed(1)} kW`, value >= 0 ? 'Importing' : 'Exporting'];
          }} />
          {/* Add a horizontal reference line at y=0 */}
          <svg>
            <defs>
              <linearGradient id="zeroLine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#888" stopOpacity={0.8}/>
                <stop offset="100%" stopColor="#888" stopOpacity={0.8}/>
              </linearGradient>
            </defs>
          </svg>
          <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
          <Line 
            type="monotone" 
            dataKey="netConsumption" 
            stroke="#6366f1" 
            strokeWidth={2} 
            dot={false}
            // Change stroke color based on value (red for import, green for export)
            strokeDasharray={(x) => x.payload.netConsumption >= 0 ? "" : ""}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>

    <div className="mt-4 text-center">
    {/* Asset quantity controls */}

    <div className="mt-4">

    <h4 className="text-xl font-bold mb-2">Community Assets</h4>

    {/* Consumers Section */}
    <div className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
      {/* Consumers Label */}
      <h5 className="text-lg font-semibold mb-2 text-left border-b pb-1">Consumers</h5>
      
      {/* Home 1 Controls */}
      <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
        <span className="text-sm text-blue-700 font-semibold">Smart-Working:</span>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 bg-blue-500 text-white rounded-l flex items-center justify-center hover:bg-blue-600"
            onClick={() => setHome1Count(Math.max(0, home1Count - 1))}
          >
            -
          </button>
          <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
            {home1Count}
          </span>
          <button 
            className="w-8 h-8 bg-blue-500 text-white rounded-r flex items-center justify-center hover:bg-blue-600"
            onClick={() => setHome1Count(home1Count + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Home 2 Controls */}
      <div className="flex items-center justify-between mb-2 p-2 bg-yellow-50 rounded">
        <span className="text-sm text-yellow-700 font-semibold">Standard Home:</span>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 bg-yellow-500 text-white rounded-l flex items-center justify-center hover:bg-yellow-600"
            onClick={() => setHome2Count(Math.max(0, home2Count - 1))}
          >
            -
          </button>
          <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
            {home2Count}
          </span>
          <button 
            className="w-8 h-8 bg-yellow-500 text-white rounded-r flex items-center justify-center hover:bg-yellow-600"
            onClick={() => setHome2Count(home2Count + 1)}
          >
            +
          </button>
        </div>
      </div>
      
      {/* Home 3 Controls */}
      <div className="flex items-center justify-between mb-2 p-2 bg-green-50 rounded">
        <span className="text-sm text-green-700 font-semibold">Large Family:</span>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 bg-green-500 text-white rounded-l flex items-center justify-center hover:bg-green-600"
            onClick={() => setHome3Count(Math.max(0, home3Count - 1))}
          >
            -
          </button>
          <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
            {home3Count}
          </span>
          <button 
            className="w-8 h-8 bg-green-500 text-white rounded-r flex items-center justify-center hover:bg-green-600"
            onClick={() => setHome3Count(home3Count + 1)}
          >
            +
          </button>
        </div>
      </div>
      
{/* Business Controls */}
      <div className="flex items-center justify-between mb-2 p-2 bg-purple-50 rounded">
        <span className="text-sm text-purple-700 font-semibold">Businesses:</span>
        <div className="flex items-center">
          <button 
            className="w-8 h-8 bg-purple-500 text-white rounded-l flex items-center justify-center hover:bg-purple-600"
            onClick={() => setBusinessCount(Math.max(0, businessCount - 1))}
          >
            -
          </button>
          <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
            {businessCount}
          </span>
          <button 
            className="w-8 h-8 bg-purple-500 text-white rounded-r flex items-center justify-center hover:bg-purple-600"
            onClick={() => setBusinessCount(businessCount + 1)}
          >
            +
          </button>
        </div>
      </div>
    </div>


    {/* Generators Section */}
<div className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
  {/* Generators Label */}
  <h5 className="text-lg font-semibold mb-2 text-left border-b pb-1">Generators</h5>
  
{/* Wind Farm Controls */}
  <div className="flex items-center justify-between mb-2 p-2 bg-blue-50 rounded">
    <span className="text-sm text-blue-700 font-semibold">Wind Turbines:</span>
    <div className="flex items-center">
      <button 
        className="w-8 h-8 bg-blue-500 text-white rounded-l flex items-center justify-center hover:bg-blue-600"
        onClick={() => setWindFarmCount(Math.max(0, windFarmCount - 1))}
      >
        -
      </button>
      <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
        {windFarmCount}
      </span>
      <button 
        className="w-8 h-8 bg-blue-500 text-white rounded-r flex items-center justify-center hover:bg-blue-600"
        onClick={() => setWindFarmCount(windFarmCount + 1)}
      >
        +
      </button>
    </div>
  </div>
  
  {/* Solar Panel Controls */}
  <div className="flex items-center justify-between mb-2 p-2 bg-yellow-50 rounded">
    <span className="text-sm text-yellow-700 font-semibold">Photovoltaic Panels:</span>
    <div className="flex items-center">
      <button 
        className="w-8 h-8 bg-yellow-500 text-white rounded-l flex items-center justify-center hover:bg-yellow-600"
        onClick={() => setSolarPanelCount(Math.max(0, solarPanelCount - 1))}
      >
        -
      </button>
      <span className="w-8 h-8 bg-white flex items-center justify-center border-t border-b">
        {solarPanelCount}
      </span>
      <button 
        className="w-8 h-8 bg-yellow-500 text-white rounded-r flex items-center justify-center hover:bg-yellow-600"
        onClick={() => setSolarPanelCount(solarPanelCount + 1)}
      >
        +
      </button>
    </div>
  </div>
</div>



</div>
</div>
</div>



{/* Right Column - Home Section with 2x2 layout */}
<div className="w-1/2">
<div className="bg-white rounded-lg p-4 shadow-md">
<h2 className="text-xl font-bold text-center mb-4">Consumers</h2>
<div className="grid grid-cols-2 gap-6">
    
      {/* Home 1 - Work From Home */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-blue-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getHome1Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis 
          tick={{fontSize: 10}}
          label={{ 
            value: 'kW', 
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']} />
          <Line type="monotone" dataKey="consumption" stroke="#2563eb" strokeWidth={2} dot={false} />
        </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center items-center bg-blue-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-blue-700" />
      </div>
      
      <h3 className="text-lg font-semibold">Smart-Working Home</h3>
      <p className="text-sm text-gray-600">Work-from-home family</p>

	  
	  <p className="mt-2">Real-time consumption: <span className="font-bold">{home1Count !== 0 ? (getHome1Consumption() / home1Count).toFixed(1) + " kW" : "not selected"}</span></p>
	  
      </div>

      {/* Home 2 - Office Worker */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-yellow-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getHome2Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis 
          tick={{fontSize: 10}}
          label={{ 
            value: 'kW', 
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']} />
          <Line type="monotone" dataKey="consumption" stroke="#f59e0b" strokeWidth={2} dot={false} />
        </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center items-center bg-yellow-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-yellow-700" />
      </div>
      
      <h3 className="text-lg font-semibold">Standard Home</h3>
      <p className="text-sm text-gray-600">Empty during daytime</p>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{home2Count !== 0 ? (getHome2Consumption() / home2Count).toFixed(1) + " kW" : "not selected"}</span></p>
      </div>

      {/* Home 3 - Family with Children */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-green-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getHome3Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis 
          tick={{fontSize: 10}}
          label={{ 
            value: 'kW', 
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']} />
          <Line type="monotone" dataKey="consumption" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center items-center bg-green-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-green-700" />
      </div>
      
      <h3 className="text-lg font-semibold">Large Family</h3>
      <p className="text-sm text-gray-600">High evening usage</p>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{home3Count !== 0 ? (getHome3Consumption() / home3Count).toFixed(1) + " kW" : "not selected"}</span></p>
      </div>

      {/* Business Building */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-purple-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <LineChart data={getBusinessForecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis 
          tick={{fontSize: 10}}
          label={{ 
            value: 'kW', 
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kW`, 'Consumption']} />
          <Line type="monotone" dataKey="consumption" stroke="#8b5cf6" strokeWidth={2} dot={false} />
        </LineChart>
        </ResponsiveContainer>
      </div>
      
      <div className="flex justify-center items-center bg-purple-100 w-24 h-24 rounded-full mb-2">
        <Store size={40} className="text-purple-700" />
      </div>
      
      <h3 className="text-lg font-semibold">Local Business</h3>
      <p className="text-sm text-gray-600">Closed weekends</p>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{businessCount !==
0 ? (getBusinessConsumption() / businessCount).toFixed(1) + " kW" : "not selected"}</span></p>
      </div>
    </div>
    </div>
  </div>
  </div>



{/* Game Instructions - Updated with home descriptions */}
<div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  
  <h3 className="font-bold mt-4 mb-2">Community Members:</h3>
  <ul className="list-disc pl-5">
    <li><span className="font-semibold">Home 1:</span> Work-from-home pattern with consistent daytime usage</li>
    <li><span className="font-semibold">Home 2:</span> House of a worker with morning/evening peaks and low daytime usage</li>
    <li><span className="font-semibold">Home 3:</span> Family with children pattern showing higher overall consumption</li>
    <li><span className="font-semibold">Business:</span> Daytime-only usage on weekdays, reduced weekend operation</li>
    <li><span className="font-semibold">Wind turbine:</span> Wind farm with intermittent generation through the day</li>
    <li><span className="font-semibold">Photovoltaic panel:</span> Photovoltaic panel with intermittent generation during daylight</li>
  </ul>
</div> 
 
<div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  <h3 className="font-bold mb-2">How to Play:</h3>
  <ul className="list-disc pl-5">
    <li>Observe the different consumption patterns of each consumer</li>
    <li>Watch how wind and solar energy production fluctuates with weather conditions</li>
    <li>Electricity can be bought from the grid at €{buyPrice.toFixed(2)}/kWh when needed</li>
    <li>Excess electricity is sold to the grid at €{sellPrice.toFixed(2)}/kWh when you produce more than you need</li>
    <li>Your goal: Build your Energy Community and find the best combination!</li>
  </ul>
  
</div>

<div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  <h3 className="font-bold mb-2">Settings</h3>
  
  <div className="grid grid-cols-2 gap-4 mt-3">
    <div className="flex flex-col">
      <label htmlFor="buyPrice" className="text-sm font-medium text-gray-700 mb-1">
        Buy (Import) Price (€/kWh)
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">€</span>
        </div>
        <input
          type="number"
          id="buyPrice"
          min="0.01"
          step="0.01"
          max="2"
          value={buyPrice}
		  
		  onChange={(e) => {
			  const newBuyPrice = Number(e.target.value);
			  // Ensure buy price is not less than sell price
			  setBuyPrice(Math.max(newBuyPrice, sellPrice));
			}}
		  
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="0.00"
          disabled={gameRunning}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">/kWh</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">Price paid when importing electricity from the grid</p>
    </div>
    
    <div className="flex flex-col">
      <label htmlFor="sellPrice" className="text-sm font-medium text-gray-700 mb-1">
        Sell (Export) Price (€/kWh)
      </label>
      <div className="relative mt-1 rounded-md shadow-sm">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-gray-500 sm:text-sm">€</span>
        </div>
        <input
          type="number"
          id="sellPrice"
          min="0.01"
          step="0.01"
          max="2"
          value={sellPrice}
          onChange={(e) => {
			  const newSellPrice = Number(e.target.value);
			  // Ensure sell price is not greater than buy price
			  setSellPrice(Math.min(newSellPrice, buyPrice));
			}}
          className="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          placeholder="0.00"
          disabled={gameRunning}
        />
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
          <span className="text-gray-500 sm:text-sm">/kWh</span>
        </div>
      </div>
      <p className="mt-1 text-xs text-gray-500">Price received when exporting electricity to the grid</p>
    </div>
  </div>
  
  <div className="mt-4 text-sm text-gray-600 italic">
	  Note: Prices cannot be changed while the simulation is running. Buy price must always be greater than or equal to sell price.
  </div>
  <br />

  
  <div className="flex flex-col">
  <label htmlFor="maxWindPower" className="text-sm font-medium text-gray-700 mb-1">
    Wind Turbine Capacity (kW)
  </label>
  <div className="relative mt-1 rounded-md shadow-sm">
    <input
      type="number"
      id="maxWindPower"
      min="1"
      step="1"
      max="50"
      value={maxWindPower}
      onChange={(e) => setMaxWindPower(Number(e.target.value))}
      className="block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      placeholder="10"
      disabled={gameRunning}
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <span className="text-gray-500 sm:text-sm">kW</span>
    </div>
  </div>
  <p className="mt-1 text-xs text-gray-500">Maximum power output per wind turbine</p>
</div>
<br />

<div className="flex flex-col">
  <label htmlFor="maxSolarPower" className="text-sm font-medium text-gray-700 mb-1">
    Solar Panel Capacity (kW)
  </label>
  <div className="relative mt-1 rounded-md shadow-sm">
    <input
      type="number"
      id="maxSolarPower"
      min="1"
      step="1"
      max="50"
      value={maxSolarPower}
      onChange={(e) => setMaxSolarPower(Number(e.target.value))}
      className="block w-full rounded-md border-gray-300 pr-12 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
      placeholder="10"
      disabled={gameRunning}
    />
    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
      <span className="text-gray-500 sm:text-sm">kW</span>
    </div>
  </div>
  <p className="mt-1 text-xs text-gray-500">Maximum power output per solar panel</p>
</div>
<br />

<div className="mt-4 flex items-center">
  <input
    type="checkbox"
    id="showDebug"
    checked={showDebug}
    onChange={(e) => setShowDebug(e.target.checked)}
    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
  />
  <label htmlFor="showDebug" className="ml-2 block text-sm text-gray-900">
    Show debug information
  </label>
</div>
  
</div>




{/* Debug Section - only shown when showDebug is true */}
{showDebug && (
  <div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  <h3 className="font-bold mb-2 flex items-center justify-between">
    <span>Debug Information (Hourly Data)</span>
    <button 
      className="px-2 py-1 text-xs bg-gray-200 hover:bg-gray-300 rounded"
      onClick={() => navigator.clipboard.writeText(
        "Hour,Day,Time,Wind Speed,Weather,Wind Count,Solar Count,Home1 Count,Home2 Count,Home3 Count,Business Count,Wind Production (kW),Solar Production (kW),Home1 Consumption (kW),Home2 Consumption (kW),Home3 Consumption (kW),Business Consumption (kW),Grid Interaction (kW),Standalone Balance Cumulative (€),Standalone Generation Revenue Cumulative (€),Standalone Consumption Cost Cumulative (€),Community Price (€/kWh),Community Balance Cumulative (€),Community Generation Revenue Cumulative(€),Community Consumption Cost Cumulative(€)\n" +
        Array.from({length: currentHour + 1}, (_, i) => {
          const hour = i;
          const day = Math.floor(hour / 24) + 1;
          const time = hour % 24;
          const windSpeed = weekData.windSpeed[hour];
          const weather = weekData.weather[hour];
          const windProduction = calculateWindProduction(hour, windFarmCount);
          const solarProduction = calculateSolarProduction(hour, solarPanelCount);
          const home1Consumption = calculateHome1Consumption(hour);
          const home2Consumption = calculateHome2Consumption(hour);
          const home3Consumption = calculateHome3Consumption(hour);
          const businessConsumption = calculateBusinessConsumption(hour);
          const totalProduction = windProduction + solarProduction;
          const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
          const gridInteraction = totalConsumption - totalProduction;
          // Cash balance from history for this hour
          const historicalCashBalance = cashBalanceHistory[hour] !== undefined ? cashBalanceHistory[hour] : money;
          const historicalStandaloneBalance = cashAloneHistory[hour] !== undefined ? cashAloneHistory[hour] : moneyAlone;
		  const historicalGenerationRevenue = generationHistory[hour] !== undefined ? generationHistory[hour] : generationStandalone;
          const historicalConsumptionCost = consumptionHistory[hour] !== undefined ? consumptionHistory[hour] : consumptionStandalone;
          const historicalCommunityPrice = communityPriceHistory[hour] !== undefined ? communityPriceHistory[hour] : communityPrice;
          const historicalCommunityGeneration = generationCommunityHistory[hour] !== undefined ? generationCommunityHistory[hour] : generationCommunity;
          const historicalCommunityConsumption = consumptionCommunityHistory[hour] !== undefined ? consumptionCommunityHistory[hour] : consumptionCommunity;
          return `${hour},${day},${time}:00,${windSpeed},${weather},${windFarmCount},${solarPanelCount},${home1Count},${home2Count},${home3Count},${businessCount},${windProduction.toFixed(2)},${solarProduction.toFixed(2)},${home1Consumption.toFixed(2)},${home2Consumption.toFixed(2)},${home3Consumption.toFixed(2)},${businessConsumption.toFixed(2)},${gridInteraction.toFixed(2)},${historicalStandaloneBalance.toFixed(2)},${historicalGenerationRevenue.toFixed(2)},${historicalConsumptionCost.toFixed(2)},${historicalCommunityPrice.toFixed(2)},${historicalCashBalance.toFixed(2)},${historicalCommunityGeneration.toFixed(2)},${historicalCommunityConsumption.toFixed(2)}`;
        }).join("\n")
      )}
    >
      Copy as CSV
    </button>
  </h3>
  
  <div className="overflow-x-auto">
    <table className="min-w-full text-xs border-collapse">
      <thead>
        <tr className="bg-gray-100">
          <th className="p-1 border">Hour</th>
          <th className="p-1 border">Day</th>
          <th className="p-1 border">Time</th>
          <th className="p-1 border">Wind (m/s)</th>
          <th className="p-1 border">Weather</th>
          <th className="p-1 border">Wind Count</th>
          <th className="p-1 border">Solar Count</th>
          <th className="p-1 border">Home1 Count</th>
          <th className="p-1 border">Home2 Count</th>
          <th className="p-1 border">Home3 Count</th>
          <th className="p-1 border">Business Count</th>
          <th className="p-1 border">Wind Production (kW)</th>
          <th className="p-1 border">Solar Production (kW)</th>
          <th className="p-1 border">Home1 Consumption (kW)</th>
          <th className="p-1 border">Home2 Consumption (kW)</th>
          <th className="p-1 border">Home3 Consumption (kW)</th>
          <th className="p-1 border">Business Consumption (kW)</th>
          <th className="p-1 border">Grid Interaction (kW)</th>
		  <th className="p-1 border">Standalone Balance Cumulative (€)</th>
		  <th className="p-1 border">Standalone Gen Revenue Cumulative (€)</th>
		  <th className="p-1 border">Standalone Con Cost Cumulative (€)</th>
		  <th className="p-1 border">Community Price (€/kWh)</th>
		  <th className="p-1 border">Community Balance Cumulative (€)</th>
		  <th className="p-1 border">Community Gen Revenue Cumulative (€)</th>
		  <th className="p-1 border">Community Con Cost Cumulative (€)</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({length: Math.min(currentHour + 1, 168)}, (_, i) => {
          const hour = i;
          const day = Math.floor(hour / 24) + 1;
          const time = hour % 24;
          const windSpeed = weekData.windSpeed[hour];
          const weather = weekData.weather[hour];
          const windProduction = calculateWindProduction(hour, windFarmCount);
          const solarProduction = calculateSolarProduction(hour, solarPanelCount);
          const home1Consumption = calculateHome1Consumption(hour);
          const home2Consumption = calculateHome2Consumption(hour);
          const home3Consumption = calculateHome3Consumption(hour);
          const businessConsumption = calculateBusinessConsumption(hour);
          const totalProduction = windProduction + solarProduction;
          const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
          const gridInteraction = totalConsumption - totalProduction;
          
          return (
            <tr key={hour} className={hour === currentHour ? "bg-blue-100" : hour % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-1 border text-center">{hour}</td>
              <td className="p-1 border text-center">{day}</td>
              <td className="p-1 border text-center">{time}:00</td>
              <td className="p-1 border text-center">{windSpeed}</td>
              <td className="p-1 border text-center">{weather}</td>
              <td className="p-1 border text-center">{windFarmCount}</td>
              <td className="p-1 border text-center">{solarPanelCount}</td>
              <td className="p-1 border text-center">{home1Count}</td>
              <td className="p-1 border text-center">{home2Count}</td>
              <td className="p-1 border text-center">{home3Count}</td>
              <td className="p-1 border text-center">{businessCount}</td>
              <td className="p-1 border text-right">{windProduction.toFixed(2)}</td>
              <td className="p-1 border text-right">{solarProduction.toFixed(2)}</td>
              <td className="p-1 border text-right">{home1Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{home2Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{home3Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{businessConsumption.toFixed(2)}</td>
              <td className={`p-1 border text-right ${gridInteraction > 0 ? "text-red-600" : "text-green-600"}`}>
                {gridInteraction > 0 ? `+${gridInteraction.toFixed(2)}` : gridInteraction.toFixed(2)}
              </td>
			  <td className={`p-1 border text-right ${cashAloneHistory[hour] >= 0 ? "text-green-600" : "text-red-600"}`}>
	 		   €{cashAloneHistory[hour]?.toFixed(2) || moneyAlone.toFixed(2)}
			  </td>
			  <td className="p-1 border text-right text-green-600">
			   +€{generationHistory[hour]?.toFixed(2) || generationStandalone.toFixed(2)}
			  </td>
			  <td className="p-1 border text-right text-red-600">
			   €{consumptionHistory[hour]?.toFixed(2) || consumptionStandalone.toFixed(2)}
			  </td>
			  <td className="p-1 border text-right text-blue-600">
			   €{communityPriceHistory[hour]?.toFixed(2) || communityPrice.toFixed(2)}
			  </td>
			  <td className={`p-1 border text-right ${cashBalanceHistory[hour] >= 0 ? "text-green-600" : "text-red-600"}`}>
                €{cashBalanceHistory[hour]?.toFixed(2) || money.toFixed(2)}
              </td>
			  <td className="p-1 border text-right text-green-600">
			   +€{generationCommunityHistory[hour]?.toFixed(2) || generationCommunity.toFixed(2)}
			  </td>
			  <td className="p-1 border text-right text-red-600">
			   €{consumptionCommunityHistory[hour]?.toFixed(2) || consumptionCommunity.toFixed(2)}
			  </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
 </div>
)}


</div>

);
};

export default EnergyGamev2;