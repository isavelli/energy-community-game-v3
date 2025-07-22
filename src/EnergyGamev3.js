import React, { useState, useEffect, useCallback, useRef, useMemo} from 'react';
import { Home, Sun, Cloud, Store} from 'lucide-react';
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine  } from 'recharts';


const EnergyGridSimulator = () => {
  // Week-long simulation data (24 hours * 7 days = 168 hours)
  const weekData = useMemo(() => ({
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
	  1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 2.0, 2.5, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.0, 3.0, 2.5, 2.5, 1.5, 1.5, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 2.0, 2.5, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.0, 3.0, 2.5, 2.5, 1.5, 1.5, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 2.0, 2.5, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.0, 3.0, 2.5, 2.5, 1.5, 1.5, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 2.0, 2.5, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.0, 3.0, 2.5, 2.5, 1.5, 1.5, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 1.5, 2.0, 2.5, 3.0, 3.0, 3.0, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.0, 3.0, 2.5, 2.5, 1.5, 1.5, 1.0,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5, 2.5, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.5, 3.0, 3.0, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5, 2.5, 2.5, 2.5, 2.5, 3.0, 2.5, 2.5, 2.5, 3.0, 3.0, 3.0, 2.5, 2.0, 1.5, 1.5
	],

	// Home 2 consumption in kW for each hour of the week (office worker pattern)
	home2Consumption: [
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3.5, 3.0, 2.5, 1.0, 1.0, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 3.5, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3.5, 3.0, 2.5, 1.0, 1.0, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 3.5, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3.5, 3.0, 2.5, 1.0, 1.0, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 3.5, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3.5, 3.0, 2.5, 1.0, 1.0, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 3.5, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 3.5, 3.0, 2.5, 1.0, 1.0, 1.0,
	  1.0, 1.0, 1.0, 1.0, 1.5, 2.5, 3.5, 3.0, 2.5, 2.0, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5, 2.5, 3.0, 3.0, 2.5,
	  2.5, 2.5, 2.5, 2.5, 2.0, 3.0, 3.5, 3.0, 2.5, 2.5, 1.5, 1.5,
	  1.5, 1.5, 1.5, 1.5, 1.5, 1.5, 2.0, 2.5, 2.5, 3.0, 3.0, 2.5,
	  2.5, 2.5, 2.5, 2.5, 2.0, 3.0, 3.5, 3.0, 2.5, 2.5, 1.5, 1.5
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
  const [gameRunning, setGameRunning] = useState(false);
  const [dayCount, setDayCount] = useState(1);
  const [gameSpeed, setGameSpeed] = useState(1); // Default speed is 1x

  // Asset counts
  const [solarPanelCount, setSolarPanelCount] = useState(0);
  const [home1Count, setHome1Count] = useState(0);
  const [home2Count, setHome2Count] = useState(0);
  const [home3Count, setHome3Count] = useState(0);
  const [businessCount, setBusinessCount] = useState(0);

  // Max power values
  const [maxSolarPower, setMaxSolarPower] = useState(10); // kW per solar panel

  const [showDebug, setShowDebug] = useState(false); // Toggle for debug information

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
    const initialSolarProduction = calculateSolarProduction(0, solarPanelCount);
    const initialTotalProduction = initialSolarProduction;

    const initialHome1Consumption = calculateHome1Consumption(0);
    const initialHome2Consumption = calculateHome2Consumption(0);
    const initialHome3Consumption = calculateHome3Consumption(0);
    const initialBusinessConsumption = calculateBusinessConsumption(0);
    const initialTotalConsumption = initialHome1Consumption + initialHome2Consumption +
                                    initialHome3Consumption + initialBusinessConsumption;

    setSolarEnergyProduced(initialSolarProduction);
    setTotalEnergyProduced(initialTotalProduction);

    setHome1EnergyConsumed(initialHome1Consumption);
    setHome2EnergyConsumed(initialHome2Consumption);
    setHome3EnergyConsumed(initialHome3Consumption);
    setBusinessEnergyConsumed(initialBusinessConsumption);
    setTotalEnergyConsumed(initialTotalConsumption);

  }, [calculateSolarProduction, calculateHome1Consumption,
      calculateHome2Consumption, calculateHome3Consumption, calculateBusinessConsumption,
      solarPanelCount]);

  // Format time to display - memoized to avoid recreation on each render
  const formatHour = useCallback((hour) => {
    return `${hour.toString().padStart(2, '0')}:00`;
  }, []);

  // Get current weather for display - memoized
  const getCurrentWeather = useCallback(() => {
    return weekData.weather[currentHour];
  }, [weekData.weather, currentHour]);

  // Calculate grid interaction - memoized
  const getGridInteraction = useCallback(() => {
    return getTotalConsumption() - totalEnergyProduced;
  }, [getTotalConsumption, totalEnergyProduced]);

  const getSingleUnitConsumption = useCallback(() => {
    return weekData.home2Consumption[currentHour];
  }, [weekData.home2Consumption, currentHour]);

  const getSingleUnitProduction = useCallback(() => {
    return calculateSolarProduction(currentHour, 1);
  }, [calculateSolarProduction, currentHour]);

  const getSingleUnitGridInteraction = useCallback(() => {
    return getSingleUnitConsumption() - getSingleUnitProduction();
  }, [getSingleUnitConsumption, getSingleUnitProduction]);

  // Calculate net consumption forecast
  const getNetConsumptionForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.weather.length;
      const time = (currentHour + i) % 24;

      const home1Consumption = calculateHome1Consumption(hour);
      const home2Consumption = calculateHome2Consumption(hour);
      const home3Consumption = calculateHome3Consumption(hour);
      const businessConsumption = calculateBusinessConsumption(hour);

      const solarProduction = calculateSolarProduction(hour, solarPanelCount);

      const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
      const totalProduction = solarProduction;

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
      solarPanelCount, calculateSolarProduction]);

  const getSolarForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.weather.length;
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

  // Calculate net consumption for a single standard home and a single solar panel
  const getSingleHomeNetForecast = useCallback(() => {
    const forecast = [];
    for (let i = 0; i < 24; i++) {
      const hour = (currentHour + i) % weekData.weather.length;
      const time = (currentHour + i) % 24;

      // Consumption for ONE standard home (Home 2)
      const homeConsumption = weekData.home2Consumption[hour];

      // Production for ONE solar panel
      const solarProduction = calculateSolarProduction(hour, 1);

      const netConsumption = homeConsumption - solarProduction;

      forecast.push({
        hour: time,
        netConsumption: netConsumption,
      });
    }
    return forecast;
  }, [currentHour, weekData, calculateSolarProduction]);

// Reset game function
  const resetGame = useCallback(() => {
    setGameRunning(false);

    setCurrentHour(0);
    setDayCount(1);
    setGameSpeed(1);
    setHourStarted(false);

    setMaxSolarPower(10);

    setSolarPanelCount(0);
    setHome1Count(0);
    setHome2Count(0);
    setHome3Count(0);
    setBusinessCount(0);

    setShowDebug(false);

    const initialSolarProduction = calculateSolarProduction(0, 0);

    const initialHome1Consumption = calculateHome1Consumption(0);
    const initialHome2Consumption = calculateHome2Consumption(0);
    const initialHome3Consumption = calculateHome3Consumption(0);
    const initialBusinessConsumption = calculateBusinessConsumption(0);
    const initialTotalConsumption = initialHome1Consumption + initialHome2Consumption +
                                  initialHome3Consumption + initialBusinessConsumption;

    setSolarEnergyProduced(initialSolarProduction);
    setTotalEnergyProduced(initialSolarProduction);

    setHome1EnergyConsumed(initialHome1Consumption);
    setHome2EnergyConsumed(initialHome2Consumption);
    setHome3EnergyConsumed(initialHome3Consumption);
    setBusinessEnergyConsumed(initialBusinessConsumption);
    setTotalEnergyConsumed(initialTotalConsumption);

    timeAccumulatorRef.current = 0;
    lastDayTransitionRef.current = null;
  }, [calculateSolarProduction, calculateHome1Consumption,
      calculateHome2Consumption, calculateHome3Consumption, calculateBusinessConsumption]);

  // Track values for the current hour and animation
  const [hourStarted, setHourStarted] = useState(false);

  // Track elapsed time for hour updates using a ref for better performance
  const timeAccumulatorRef = useRef(0);
  const lastDayTransitionRef = useRef(null);

  // Effect to update when asset counts change
  useEffect(() => {
    if (gameRunning) {
      const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);

      setSolarEnergyProduced(solarProduction);
      setTotalEnergyProduced(solarProduction);
    }
  }, [solarPanelCount, gameRunning, currentHour,
      calculateSolarProduction]);

  // Effect to update consumption values when consumer counts change
  useEffect(() => {
    if (gameRunning) {
      const home1Consumption = calculateHome1Consumption(currentHour);
      const home2Consumption = calculateHome2Consumption(currentHour);
      const home3Consumption = calculateHome3Consumption(currentHour);
      const businessConsumption = calculateBusinessConsumption(currentHour);
      const totalConsumption = home1Consumption + home2Consumption +
                               home3Consumption + businessConsumption;

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
    if (gameRunning) {
      const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);

      setSolarEnergyProduced(solarProduction);
      setTotalEnergyProduced(solarProduction);
    }
  }, [maxSolarPower, gameRunning, currentHour,
      solarPanelCount, calculateSolarProduction]);

  // Handle game logic with split rendering and game hour cycles
  useEffect(() => {
    if (!gameRunning) return;

    const renderLoop = setInterval(() => {
      if (!hourStarted) {
        const home1Consumption = calculateHome1Consumption(currentHour);
        const home2Consumption = calculateHome2Consumption(currentHour);
        const home3Consumption = calculateHome3Consumption(currentHour);
        const businessConsumption = calculateBusinessConsumption(currentHour);
        const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;

        const solarProduction = calculateSolarProduction(currentHour, solarPanelCount);
        const totalProduction = solarProduction;
        const gridInteraction = totalConsumption - totalProduction;

        setHourStarted(true);

        setSolarEnergyProduced(solarProduction);
        setTotalEnergyProduced(totalProduction);

        setHome1EnergyConsumed(home1Consumption);
        setHome2EnergyConsumed(home2Consumption);
        setHome3EnergyConsumed(home3Consumption);
        setBusinessEnergyConsumed(businessConsumption);
        setTotalEnergyConsumed(totalConsumption);

        if (showDebug) {
          console.log(`Hour ${currentHour} details:`, {
            gridInteraction: gridInteraction.toFixed(2),
            solarProduction: solarProduction.toFixed(2),
            totalConsumption: totalConsumption.toFixed(2),
          });
        }
      }

      timeAccumulatorRef.current += 0.01 * gameSpeed;

      if (timeAccumulatorRef.current >= 1) {
        setCurrentHour(prevHour => {
          const nextHour = prevHour + 1;

          if (nextHour >= weekData.weather.length) {
            setGameRunning(false);
            return prevHour;
          }

          if (nextHour % 24 === 0 && lastDayTransitionRef.current !== nextHour) {
            lastDayTransitionRef.current = nextHour;
            setDayCount((prevDay) => prevDay + 1);
          }

          setHourStarted(false);

          return nextHour;
        });

        timeAccumulatorRef.current = 0;
      }

    }, 10);

    return () => clearInterval(renderLoop);
  }, [gameRunning, currentHour, weekData, hourStarted, gameSpeed, showDebug,
      solarPanelCount, calculateSolarProduction,
      calculateHome1Consumption, calculateHome2Consumption, calculateHome3Consumption,
      calculateBusinessConsumption]);

  return (
    <div className="w-full h-full p-4 rounded-lg bg-blue-100 text-gray-800">
     <div className="flex justify-between items-center mb-6">
        <div className="w-1/4">
            <h2 className="text-2xl font-bold">Energy Grid Simulator</h2>
            <span className="text-base font-normal text-gray-600">by Iacopo Savelli (iacopo.savelli@unibocconi.it)</span>
            <p className="text-lg">Day: {dayCount} | Time: {formatHour(currentHour % 24)} | Weather: {getCurrentWeather()}</p>
        </div>

        <div className="w-1/2 text-center">
            {/* Single Unit Summary */}
            <div className="bg-blue-50 rounded-lg p-4 shadow flex items-center">
                <div className="mr-4">
					<p className="text-xl font-normal text-gray-600 font-bold">Single Unit</p>
					<p className="text-sm font-normal text-gray-700">(1 Standard Home + 1 PV Panel)</p>
				</div>
                <div className="flex justify-around items-center flex-grow">
                    <div>
                        <p className="text-gray-600 font-bold">Consumption</p>
                        <p className="text-2xl font-bold">{getSingleUnitConsumption().toFixed(1)} kWh</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-bold">Generation</p>
                        <p className="text-2xl font-bold">{getSingleUnitProduction().toFixed(1)} kWh</p>
                    </div>
                    <div>
                        <p className="text-gray-600 font-bold">{getSingleUnitGridInteraction() > 0 ? 'Importing' : 'Exporting'}</p>
                        <p className={`text-2xl font-bold ${getSingleUnitGridInteraction() > 0 ? 'text-red-500' : 'text-green-500'}`}>
                            {Math.abs(getSingleUnitGridInteraction()).toFixed(1)} kWh
                        </p>
                    </div>
                </div>
            </div>

			<div className="bg-blue-50 rounded-lg p-4 shadow flex items-center mt-0.5">
				<div className="mr-4">
					<p className="text-xl font-normal text-gray-600 font-bold">Community</p>
					<div className="text-left">
						<p className="text-sm font-normal text-gray-700">{home1Count} Smart-Working Home</p>
						<p className="text-sm font-normal text-gray-700">{home2Count} Standard Home</p>
						<p className="text-sm font-normal text-gray-700">{home3Count} Large Family</p>
						<p className="text-sm font-normal text-gray-700">{businessCount} Business</p>
						<p className="text-sm font-normal text-gray-700">{solarPanelCount} PV Panel</p>
					</div>
				</div>
				<div className="flex justify-around items-center flex-grow">
					<div>
						<p className="text-gray-600 font-bold">Total Consumption</p>
						<p className="text-2xl font-bold">{getTotalConsumption().toFixed(1)} kWh</p>
					</div>
					<div>
						<p className="text-gray-600 font-bold">Total Generation</p>
						<p className="text-2xl font-bold">{totalEnergyProduced.toFixed(1)} kWh</p>
					</div>
					<div>
						<p className="text-gray-600 font-bold">{getGridInteraction() > 0 ? 'Importing from Grid' : 'Exporting to Grid'}</p>
						<p className={`text-2xl font-bold ${getGridInteraction() > 0 ? 'text-red-500' : 'text-green-500'}`}>
							{Math.abs(getGridInteraction()).toFixed(1)} kWh
						</p>
					</div>
				</div>
			</div>
		</div>

        <div className="w-1/4 text-right">
            <div className="flex flex-col items-end">
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


      {/* Main components layout - side-by-side with solar on left and homes on right */}
      <div className="flex flex-row space-x-4">
        {/* Left Column - Energy Sources */}
        <div className="flex flex-col space-y-8 w-1/4">

		<div className="border border-gray-300 rounded-lg p-3 mb-3 bg-gray-50">
        <h2 className="text-xl font-bold text-center mb-4">Photovoltaic Panel</h2>

    {/* Solar Panel Section */}
	<div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-yellow-300">
    <div className="text-center w-full">
    {/* Solar Production Forecast Chart */}
    <div className="h-32 w-full mb-2">
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={getSolarForecast()}>
        <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3}label={{value: "Hours", position: "insideBottom", offset: -2}} />
            <YAxis
              tick={{fontSize: 10}}
              label={{
                value: 'kWh',
                angle: -90
              }}
            />
        <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, 'Solar']} />
        <Bar dataKey="production" fill="#f59e0b" />
      </BarChart>
    </ResponsiveContainer>
    </div>

    {/* 2x1 Layout for Solar Panel, Sun/Moon and Weather elements */}
    <div className="flex justify-between items-center">
    {/* Left side - Solar panel frame */}
    <div className="w-1/2 flex justify-end pr-4">
      <div className="w-24 h-24 bg-blue-900 rounded-lg flex items-center justify-center p-2 overflow-hidden">
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
            className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${
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
            className="w-20 h-20 rounded-full flex items-center justify-center bg-gray-800"
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
          <Cloud size={80} className="absolute top-8 -right-4 text-gray-400 z-10" fill="currentColor" />
        )}
        {getCurrentWeather() === 'stormy' && (
          <div className="absolute top-8 -right-4 z-10">
            <Cloud size={80} className="text-gray-400" fill="currentColor" />
            <div className="absolute bottom-2 left-8 text-yellow-500 text-4xl">⚡</div>
          </div>
        )}
      </div>
    </div>
    </div>

    <h3 className="text-xl mt-2">Photovoltaic Panel ({maxSolarPower} kW-peak)</h3>
    <div className="flex items-center justify-center my-2">
      <button
        className="w-8 h-8 bg-yellow-500 text-white rounded-l flex items-center justify-center hover:bg-yellow-600"
        onClick={() => setSolarPanelCount(Math.max(0, solarPanelCount - 1))}
        disabled={gameRunning}
      >
        -
      </button>
      <span className="w-10 h-8 bg-white flex items-center justify-center border-t border-b font-bold text-lg">
        {solarPanelCount}
      </span>
      <button
        className="w-8 h-8 bg-yellow-500 text-white rounded-r flex items-center justify-center hover:bg-yellow-600"
        onClick={() => setSolarPanelCount(solarPanelCount + 1)}
        disabled={gameRunning}
      >
        +
      </button>
    </div>
	<p>Energy: <span className="font-bold">{solarPanelCount !== 0 ? (solarEnergyProduced/solarPanelCount).toFixed(1) + " kWh" : "not selected"}</span></p>
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



    {/* Center Column - Chart Section */}
    <div className="w-1/4 flex flex-col space-y-4">
        {/* New Chart: Single Home & PV Net Flow */}
        <div className="bg-white rounded-lg p-4 shadow-md flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-center mb-4">Single Unit Net Flow<br />
              <span className="text-base font-normal text-gray-700">(1 Standard Home + 1 PV Panel)</span>
            </h2>
            <div className="flex-grow w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getSingleHomeNetForecast()}>
                  <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
                  <YAxis
                      tick={{fontSize: 10}}
                      label={{
                        value: 'kWh',
                        angle: -90
                      }}
                    />
                  <Tooltip formatter={(value, name) => {
                    return [`${Math.abs(value).toFixed(1)} kWh`, value >= 0 ? 'Importing' : 'Exporting'];
                  }} />
                  <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                  <Bar dataKey="netConsumption">
                    {getSingleHomeNetForecast().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.netConsumption >= 0 ? '#ef4444' : '#22c55e'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
        </div>

        {/* Existing Chart: Total Net Grid Power Flow */}
        <div className="bg-white rounded-lg p-4 shadow-md flex flex-col flex-grow">
            <h2 className="text-xl font-bold text-center mb-4">Community Net Power Flow <br />
              <span className="text-base font-normal text-gray-700">(import positive/export negative)</span>
            </h2>
            <div className="flex-grow w-full mb-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={getNetConsumptionForecast()}>
                  <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
                    <YAxis
                      tick={{fontSize: 10}}
                      label={{
                        value: 'kWh',
                        angle: -90
                      }}
                    />
                  <Tooltip formatter={(value, name) => {
                    return [`${Math.abs(value).toFixed(1)} kWh`, value >= 0 ? 'Importing' : 'Exporting'];
                  }} />
                  <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                    <Bar dataKey="netConsumption">
                        {getNetConsumptionForecast().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.netConsumption >= 0 ? '#ef4444' : '#22c55e'} />
                        ))}
                    </Bar>
                </BarChart>
              </ResponsiveContainer>
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
        <BarChart data={getHome1Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis
          tick={{fontSize: 10}}
          label={{
            value: 'kWh',
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, 'Consumption']} />
          <Bar dataKey="consumption" fill="#2563eb" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center bg-blue-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-blue-700" />
      </div>

      <h3 className="text-lg font-semibold">Smart-Working Home</h3>
      <p className="text-sm text-gray-600">Work-from-home family</p>

        <div className="flex items-center my-2">
          <button
            className="w-8 h-8 bg-blue-500 text-white rounded-l flex items-center justify-center hover:bg-blue-600"
            onClick={() => setHome1Count(Math.max(0, home1Count - 1))}
            disabled={gameRunning}
          >
            -
          </button>
          <span className="w-10 h-8 bg-white flex items-center justify-center border-t border-b font-bold text-lg">
            {home1Count}
          </span>
          <button
            className="w-8 h-8 bg-blue-500 text-white rounded-r flex items-center justify-center hover:bg-blue-600"
            onClick={() => setHome1Count(home1Count + 1)}
            disabled={gameRunning}
          >
            +
          </button>
        </div>

	  <p className="mt-2">Real-time consumption: <span className="font-bold">{home1Count !== 0 ? (getHome1Consumption() / home1Count).toFixed(1) + " kWh" : "not selected"}</span></p>

      </div>

      {/* Home 2 - Office Worker */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-yellow-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={getHome2Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis
          tick={{fontSize: 10}}
          label={{
            value: 'kWh',
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, 'Consumption']} />
          <Bar dataKey="consumption" fill="#f59e0b" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center bg-yellow-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-yellow-700" />
      </div>

      <h3 className="text-lg font-semibold">Standard Home</h3>
      <p className="text-sm text-gray-600">Empty during daytime</p>
      <div className="flex items-center my-2">
          <button
            className="w-8 h-8 bg-yellow-500 text-white rounded-l flex items-center justify-center hover:bg-yellow-600"
            onClick={() => setHome2Count(Math.max(0, home2Count - 1))}
            disabled={gameRunning}
          >
            -
          </button>
          <span className="w-10 h-8 bg-white flex items-center justify-center border-t border-b font-bold text-lg">
            {home2Count}
          </span>
          <button
            className="w-8 h-8 bg-yellow-500 text-white rounded-r flex items-center justify-center hover:bg-yellow-600"
            onClick={() => setHome2Count(home2Count + 1)}
            disabled={gameRunning}
          >
            +
          </button>
        </div>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{home2Count !== 0 ? (getHome2Consumption() / home2Count).toFixed(1) + " kWh" : "not selected"}</span></p>
      </div>

      {/* Home 3 - Family with Children */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-green-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={getHome3Forecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis
          tick={{fontSize: 10}}
          label={{
            value: 'kWh',
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, 'Consumption']} />
          <Bar dataKey="consumption" fill="#10b981" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center bg-green-100 w-24 h-24 rounded-full mb-2">
        <Home size={40} className="text-green-700" />
      </div>

      <h3 className="text-lg font-semibold">Large Family</h3>
      <p className="text-sm text-gray-600">High evening usage</p>
        <div className="flex items-center my-2">
          <button
            className="w-8 h-8 bg-green-500 text-white rounded-l flex items-center justify-center hover:bg-green-600"
            onClick={() => setHome3Count(Math.max(0, home3Count - 1))}
            disabled={gameRunning}
          >
            -
          </button>
          <span className="w-10 h-8 bg-white flex items-center justify-center border-t border-b font-bold text-lg">
            {home3Count}
          </span>
          <button
            className="w-8 h-8 bg-green-500 text-white rounded-r flex items-center justify-center hover:bg-green-600"
            onClick={() => setHome3Count(home3Count + 1)}
            disabled={gameRunning}
          >
            +
          </button>
        </div>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{home3Count !== 0 ? (getHome3Consumption() / home3Count).toFixed(1) + " kWh" : "not selected"}</span></p>
      </div>

      {/* Business Building */}
      <div className="flex flex-col items-center justify-center bg-white rounded-lg p-4 shadow-md border-2 border-purple-300">
      <div className="h-32 w-full mb-2">
        <ResponsiveContainer width="100%" height="100%">
        <BarChart data={getBusinessForecast()}>
          <XAxis dataKey="hour" tick={{fontSize: 10}} interval={3} label={{value: "Hours", position: "insideBottom", offset: -2}} />
        <YAxis
          tick={{fontSize: 10}}
          label={{
            value: 'kWh',
            angle: -90
          }}
        />
          <Tooltip formatter={(value) => [`${value.toFixed(1)} kWh`, 'Consumption']} />
          <Bar dataKey="consumption" fill="#8b5cf6" />
        </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="flex justify-center items-center bg-purple-100 w-24 h-24 rounded-full mb-2">
        <Store size={40} className="text-purple-700" />
      </div>

      <h3 className="text-lg font-semibold">Local Business</h3>
      <p className="text-sm text-gray-600">Closed weekends</p>
        <div className="flex items-center my-2">
          <button
            className="w-8 h-8 bg-purple-500 text-white rounded-l flex items-center justify-center hover:bg-purple-600"
            onClick={() => setBusinessCount(Math.max(0, businessCount - 1))}
            disabled={gameRunning}
          >
            -
          </button>
          <span className="w-10 h-8 bg-white flex items-center justify-center border-t border-b font-bold text-lg">
            {businessCount}
          </span>
          <button
            className="w-8 h-8 bg-purple-500 text-white rounded-r flex items-center justify-center hover:bg-purple-600"
            onClick={() => setBusinessCount(businessCount + 1)}
            disabled={gameRunning}
          >
            +
          </button>
        </div>
      <p className="mt-2">Real-time consumption: <span className="font-bold">{businessCount !==
0 ? (getBusinessConsumption() / businessCount).toFixed(1) + " kWh" : "not selected"}</span></p>
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
    <li><span className="font-semibold">Photovoltaic panel:</span> Photovoltaic panel with intermittent generation during daylight</li>
  </ul>
</div>

<div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  <h3 className="font-bold mb-2">How to Play:</h3>
  <ul className="list-disc pl-5">
    <li>Observe the different consumption patterns of each consumer</li>
    <li>Watch how solar energy production fluctuates with weather conditions</li>
    <li>Add consumers and photovoltaic panels to build your community.</li>
    <li>Electricity is imported from the grid when consumption exceeds local generation.</li>
    <li>Excess electricity is exported to the grid when generation exceeds local consumption.</li>
    <li>Your goal: Build your Energy Community and find the best combination to minimize grid imports!</li>
  </ul>

</div>

<div className="mt-4 p-4 bg-white rounded-lg text-gray-800">
  <h3 className="font-bold mb-2">Settings</h3>

<div className="flex flex-col">
  <label htmlFor="maxSolarPower" className="text-sm font-medium text-gray-700 mb-1">
    Solar Panel Peak Capacity (kWp)
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
      <span className="text-gray-500 sm:text-sm">kWp</span>
    </div>
  </div>
  <p className="mt-1 text-xs text-gray-500">Maximum peak power per solar panel</p>
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
      onClick={() => {
          const csvContent = "Hour,Day,Time,Weather,Solar Count,Home1 Count,Home2 Count,Home3 Count,Business Count,Solar Production (kWh),Home1 Consumption (kWh),Home2 Consumption (kWh),Home3 Consumption (kWh),Business Consumption (kWh),Grid Interaction (kWh)\n" +
          Array.from({length: currentHour + 1}, (_, i) => {
            const hour = i;
            const day = Math.floor(hour / 24) + 1;
            const time = hour % 24;
            const weather = weekData.weather[hour];
            const solarProduction = calculateSolarProduction(hour, solarPanelCount);
            const home1Consumption = calculateHome1Consumption(hour);
            const home2Consumption = calculateHome2Consumption(hour);
            const home3Consumption = calculateHome3Consumption(hour);
            const businessConsumption = calculateBusinessConsumption(hour);
            const totalProduction = solarProduction;
            const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
            const gridInteraction = totalConsumption - totalProduction;
            return `${hour},${day},${time}:00,${weather},${solarPanelCount},${home1Count},${home2Count},${home3Count},${businessCount},${solarProduction.toFixed(2)},${home1Consumption.toFixed(2)},${home2Consumption.toFixed(2)},${home3Consumption.toFixed(2)},${businessConsumption.toFixed(2)},${gridInteraction.toFixed(2)}`;
          }).join("\n");

          // Create a temporary textarea to copy the text
          const textArea = document.createElement("textarea");
          textArea.value = csvContent;
          document.body.appendChild(textArea);
          textArea.select();
          try {
            document.execCommand('copy');
          } catch (err) {
            console.error('Failed to copy text: ', err);
          }
          document.body.removeChild(textArea);
      }}
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
          <th className="p-1 border">Weather</th>
          <th className="p-1 border">Solar Count</th>
          <th className="p-1 border">Home1 Count</th>
          <th className="p-1 border">Home2 Count</th>
          <th className="p-1 border">Home3 Count</th>
          <th className="p-1 border">Business Count</th>
          <th className="p-1 border">Solar Production (kWh)</th>
          <th className="p-1 border">Home1 Consumption (kWh)</th>
          <th className="p-1 border">Home2 Consumption (kWh)</th>
          <th className="p-1 border">Home3 Consumption (kWh)</th>
          <th className="p-1 border">Business Consumption (kWh)</th>
          <th className="p-1 border">Grid Interaction (kWh)</th>
        </tr>
      </thead>
      <tbody>
        {Array.from({length: Math.min(currentHour + 1, 168)}, (_, i) => {
          const hour = i;
          const day = Math.floor(hour / 24) + 1;
          const time = hour % 24;
          const weather = weekData.weather[hour];
          const solarProduction = calculateSolarProduction(hour, solarPanelCount);
          const home1Consumption = calculateHome1Consumption(hour);
          const home2Consumption = calculateHome2Consumption(hour);
          const home3Consumption = calculateHome3Consumption(hour);
          const businessConsumption = calculateBusinessConsumption(hour);
          const totalProduction = solarProduction;
          const totalConsumption = home1Consumption + home2Consumption + home3Consumption + businessConsumption;
          const gridInteraction = totalConsumption - totalProduction;

          return (
            <tr key={hour} className={hour === currentHour ? "bg-blue-100" : hour % 2 === 0 ? "bg-gray-50" : ""}>
              <td className="p-1 border text-center">{hour}</td>
              <td className="p-1 border text-center">{day}</td>
              <td className="p-1 border text-center">{time}:00</td>
              <td className="p-1 border text-center">{weather}</td>
              <td className="p-1 border text-center">{solarPanelCount}</td>
              <td className="p-1 border text-center">{home1Count}</td>
              <td className="p-1 border text-center">{home2Count}</td>
              <td className="p-1 border text-center">{home3Count}</td>
              <td className="p-1 border text-center">{businessCount}</td>
              <td className="p-1 border text-right">{solarProduction.toFixed(2)}</td>
              <td className="p-1 border text-right">{home1Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{home2Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{home3Consumption.toFixed(2)}</td>
              <td className="p-1 border text-right">{businessConsumption.toFixed(2)}</td>
              <td className={`p-1 border text-right ${gridInteraction > 0 ? "text-red-600" : "text-green-600"}`}>
                {gridInteraction > 0 ? `+${gridInteraction.toFixed(2)}` : gridInteraction.toFixed(2)}
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

export default EnergyGridSimulator;