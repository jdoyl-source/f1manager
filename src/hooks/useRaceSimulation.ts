import { useState, useEffect, useRef, useCallback } from 'react';
import { Driver } from '../types/game';

export const useRaceSimulation = (lapTarget: number) => {
  const [grid, setGrid] = useState<Driver[]>([]);
  const [raceRunning, setRaceRunning] = useState(false);
  const [raceResults, setRaceResults] = useState<Driver[] | null>(null);
  const raceInterval = useRef<NodeJS.Timeout | null>(null);

  const updateRace = useCallback(() => {
    setGrid(prevGrid => {
      if (!prevGrid || prevGrid.length === 0) return prevGrid;

      let updatedGrid = [...prevGrid];

      // Simulate race progress with improved performance calculation
      updatedGrid = updatedGrid.map(driver => {
        if (driver.laps >= lapTarget) return driver;

        // Enhanced progress calculation based on skill with more realistic variance
        const baseProgress = (driver.skill / 100) * 0.015;
        const randomFactor = (Math.random() - 0.5) * 0.01;
        const progressChance = baseProgress + randomFactor;

        let newAngle = (driver.angle || 0) + progressChance;
        let laps = driver.laps || 0;

        // Complete lap when full circle
        if (newAngle >= Math.PI * 2) {
          laps++;
          newAngle = newAngle - Math.PI * 2;
        }

        return { ...driver, angle: newAngle, laps: laps };
      });

      // Sort by laps completed (desc), then by angle progress (desc)
      updatedGrid.sort((a, b) => {
        if (b.laps !== a.laps) return b.laps - a.laps;
        return (b.angle || 0) - (a.angle || 0);
      });

      // Update positions
      updatedGrid.forEach((driver, index) => {
        driver.position = index + 1;
      });

      // Check for race completion
      const finishedDrivers = updatedGrid.filter(d => d.laps >= lapTarget);
      if (finishedDrivers.length === updatedGrid.length) {
        setRaceRunning(false);
        if (raceInterval.current) {
          clearInterval(raceInterval.current);
        }
        setRaceResults([...updatedGrid]);
      }

      return updatedGrid;
    });
  }, [lapTarget]);

  useEffect(() => {
    if (raceRunning) {
      raceInterval.current = setInterval(updateRace, 100); // Slightly slower for better visual tracking
      return () => {
        if (raceInterval.current) {
          clearInterval(raceInterval.current);
        }
      };
    }
  }, [raceRunning, updateRace]);

  const startRace = useCallback(() => {
    if (grid.length === 0) return false;
    setRaceRunning(true);
    return true;
  }, [grid.length]);

  const pauseRace = useCallback(() => {
    setRaceRunning(false);
    if (raceInterval.current) {
      clearInterval(raceInterval.current);
    }
  }, []);

  const resetRace = useCallback(() => {
    setRaceRunning(false);
    if (raceInterval.current) {
      clearInterval(raceInterval.current);
    }
    setRaceResults(null);
    setGrid(prevGrid => 
      prevGrid.map(driver => ({
        ...driver,
        laps: 0,
        angle: 0,
        position: 0
      }))
    );
  }, []);

  return {
    grid,
    setGrid,
    raceRunning,
    raceResults,
    setRaceResults,
    startRace,
    pauseRace,
    resetRace
  };
};