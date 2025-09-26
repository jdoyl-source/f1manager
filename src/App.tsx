import React, { useState, useEffect } from "react";
import { RaceTrack } from "./components/RaceTrack";
import { RaceControls } from "./components/RaceControls";
import { RaceLeaderboard } from "./components/RaceLeaderboard";
import { RaceResults } from "./components/RaceResults";
import { DriverMarket } from "./components/DriverMarket";
import { CarUpgrades } from "./components/CarUpgrades";
import { useRaceSimulation } from "./hooks/useRaceSimulation";
import { Driver, Team } from "./types/game";
import { Flag, Users, Wrench } from "lucide-react";

export default function App() {
  const TABS = ["Race", "Driver Market", "Car Upgrades"];
  const GRID_SIZE = 22;
  const MAX_TEAM_DRIVERS = 2;
  const LAP_TARGET = 3;

  const [activeTab, setActiveTab] = useState("Race");
  const [money, setMoney] = useState(1000000);
  const [userTeam, setUserTeam] = useState<Team>({ 
    name: "My Team", 
    color: "#ef4444", 
    drivers: [] 
  });
  const [driversMarket, setDriversMarket] = useState<Driver[]>([]);

  const {
    grid,
    setGrid,
    raceRunning,
    raceResults,
    setRaceResults,
    startRace,
    pauseRace,
    resetRace
  } = useRaceSimulation(LAP_TARGET);

  // Utility functions
  const uid = (n = 6) => Math.random().toString(36).slice(2, 2 + n);
  const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

  const randomName = () => {
    const first = ["Alex","Luca","Jorge","Emma","Zoe","Kai","Maya","Oskar","Nico","Ivy","Liam","Sofia","Elias","Hana","Max","Ravi","Noah","Mia"];
    const last = ["Moretti","Kovacs","Silva","Nguyen","Garcia","Brown","Dubois","Ivanov","Schmidt","Rossi","Lee","Singh","Olsen","Park","Mendez"];
    return first[rand(0, first.length - 1)] + " " + last[rand(0, last.length - 1)];
  };

  const generateMarket = (n = 20) => {
    const colors = ["#ef4444","#2563eb","#10b981","#f59e0b","#8b5cf6","#06b6d4","#ec4899","#374151"];
    const list: Driver[] = [];
    for (let i = 0; i < n; i++) {
      list.push({
        id: uid(8),
        name: randomName(),
        number: i + 1,
        skill: rand(50, 95),
        salary: rand(80000, 400000),
        preferredColor: colors[i % colors.length],
      });
    }
    setDriversMarket(list);
  };

  const randomColor = () => {
    const palette = ["#2563eb","#10b981","#f59e0b","#8b5cf6","#06b6d4","#ec4899","#374151","#0891b2"];
    return palette[Math.floor(Math.random() * palette.length)];
  };

  const randomCPUDriver = (): Driver => ({
    id: uid(6),
    name: randomName(),
    number: 200 + Math.floor(Math.random() * 700),
    skill: rand(45, 92),
    salary: 0,
    preferredColor: randomColor(),
  });

  const buildGrid = () => {
    if (userTeam.drivers.length === 0) {
      alert("Please hire at least one driver to build a grid.");
      return;
    }

    const cpuNeeded = GRID_SIZE - userTeam.drivers.length;
    const cpuDrivers: Driver[] = [];
    const cpuTeams = Math.ceil(cpuNeeded / MAX_TEAM_DRIVERS);

    for (let t = 0; t < cpuTeams; t++) {
      const teamColor = randomColor();
      for (let i = 0; i < MAX_TEAM_DRIVERS && cpuDrivers.length < cpuNeeded; i++) {
        const driver = {
          ...randomCPUDriver(),
          team: `CPU Team ${t + 1}`,
          color: teamColor,
          laps: 0,
          position: 0,
          angle: 0
        };
        cpuDrivers.push(driver);
      }
    }

    const userDrivers = userTeam.drivers.map(driver => ({
      ...driver,
      team: userTeam.name,
      color: userTeam.color,
      laps: 0,
      position: 0,
      angle: 0,
    }));

    const combined = [...cpuDrivers, ...userDrivers];
    combined.sort(() => Math.random() - 0.5);
    combined.forEach((driver, index) => {
      driver.position = index + 1;
    });

    setGrid(combined);
    setRaceResults(null);
  };

  const hireDriver = (driver: Driver) => {
    if (userTeam.drivers.length >= MAX_TEAM_DRIVERS) {
      alert("You can only hire 2 drivers.");
      return;
    }
    if (money < driver.salary) {
      alert("Not enough money to hire this driver.");
      return;
    }

    setUserTeam(prev => ({
      ...prev,
      drivers: [...prev.drivers, { ...driver }]
    }));
    setMoney(prev => prev - driver.salary);
    setDriversMarket(prev => prev.filter(d => d.id !== driver.id));
  };

  const fireDriver = (driver: Driver) => {
    setUserTeam(prev => ({
      ...prev,
      drivers: prev.drivers.filter(d => d.id !== driver.id)
    }));
  };

  const purchaseUpgrade = (cost: number) => {
    setMoney(prev => prev - cost);
  };

  const handleStartRace = () => {
    if (!startRace()) {
      alert("Build the grid first!");
    }
  };

  const getTabIcon = (tab: string) => {
    switch (tab) {
      case "Race": return <Flag className="w-5 h-5" />;
      case "Driver Market": return <Users className="w-5 h-5" />;
      case "Car Upgrades": return <Wrench className="w-5 h-5" />;
      default: return null;
    }
  };

  useEffect(() => {
    generateMarket(20);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 text-gray-900 font-sans">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-red-800 bg-clip-text text-transparent mb-2">
            F1 Race Manager Simulator
          </h1>
          <p className="text-gray-600">Build your team, manage your budget, and race to victory!</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-2 flex space-x-2">
            {TABS.map(tab => (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tab);
                  pauseRace();
                }}
                className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                  activeTab === tab 
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md" 
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {getTabIcon(tab)}
                <span>{tab}</span>
              </button>
            ))}
          </div>
        </div>

        {activeTab === "Race" && (
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
            <div className="xl:col-span-1">
              <RaceControls
                money={money}
                userTeam={userTeam}
                raceRunning={raceRunning}
                gridLength={grid.length}
                onBuildGrid={buildGrid}
                onStartRace={handleStartRace}
                onPauseRace={pauseRace}
                onResetRace={resetRace}
              />
            </div>
            
            <div className="xl:col-span-2 flex justify-center">
              <RaceTrack
                grid={grid}
                userTeamName={userTeam.name}
                lapTarget={LAP_TARGET}
              />
            </div>
            
            <div className="xl:col-span-2">
              <RaceLeaderboard
                grid={grid}
                userTeamName={userTeam.name}
                lapTarget={LAP_TARGET}
                raceRunning={raceRunning}
              />
            </div>
          </div>
        )}

        {activeTab === "Driver Market" && (
          <DriverMarket
            driversMarket={driversMarket}
            userTeam={userTeam}
            money={money}
            maxTeamDrivers={MAX_TEAM_DRIVERS}
            onHireDriver={hireDriver}
            onFireDriver={fireDriver}
          />
        )}

        {activeTab === "Car Upgrades" && (
          <CarUpgrades
            money={money}
            onPurchaseUpgrade={purchaseUpgrade}
          />
        )}

        {raceResults && (
          <RaceResults
            results={raceResults}
            userTeamName={userTeam.name}
            onClose={() => setRaceResults(null)}
          />
        )}
      </div>
    </div>
  );
}