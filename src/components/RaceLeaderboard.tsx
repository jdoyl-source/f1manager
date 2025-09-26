import React from 'react';
import { Trophy, Clock, Flag, Target } from 'lucide-react';
import { Driver } from '../types/game';

interface RaceLeaderboardProps {
  grid: Driver[];
  userTeamName: string;
  lapTarget: number;
  raceRunning: boolean;
}

export const RaceLeaderboard: React.FC<RaceLeaderboardProps> = ({ 
  grid, 
  userTeamName, 
  lapTarget, 
  raceRunning 
}) => {
  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-600 text-amber-100';
      default: return 'bg-white';
    }
  };

  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-4 h-4 text-yellow-600" />;
      case 2: return <Trophy className="w-4 h-4 text-gray-500" />;
      case 3: return <Trophy className="w-4 h-4 text-amber-600" />;
      default: return <div className="w-4 h-4 flex items-center justify-center text-xs font-bold text-gray-600">{position}</div>;
    }
  };

  const getLapProgress = (driver: Driver) => {
    const totalProgress = driver.laps + ((driver.angle || 0) / (Math.PI * 2));
    return Math.min(totalProgress / lapTarget * 100, 100);
  };

  const getGapToLeader = (driver: Driver, leader: Driver) => {
    if (driver.position === 1) return "Leader";
    
    const driverProgress = driver.laps + ((driver.angle || 0) / (Math.PI * 2));
    const leaderProgress = leader.laps + ((leader.angle || 0) / (Math.PI * 2));
    const gap = leaderProgress - driverProgress;
    
    if (gap < 0.1) return "+0.1";
    return `+${gap.toFixed(1)}`;
  };

  const sortedGrid = [...grid].sort((a, b) => a.position - b.position);
  const leader = sortedGrid[0];

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 h-full">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <Flag className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-bold text-gray-800">Race Leaderboard</h3>
        </div>
        {raceRunning && (
          <div className="flex items-center space-x-2 text-green-600">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold">LIVE</span>
          </div>
        )}
      </div>

      <div className="space-y-2 max-h-[600px] overflow-y-auto">
        {sortedGrid.map((driver) => {
          const isUserDriver = driver.team === userTeamName;
          const isFinished = driver.laps >= lapTarget;
          const lapProgress = getLapProgress(driver);
          
          return (
            <div
              key={driver.id}
              className={`p-3 rounded-xl border-2 transition-all duration-200 ${
                isUserDriver 
                  ? 'border-red-300 bg-gradient-to-r from-red-50 to-red-100' 
                  : driver.position <= 3
                  ? `border-transparent ${getPositionColor(driver.position)}`
                  : 'border-gray-200 bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center w-8 h-8">
                    {getPositionIcon(driver.position)}
                  </div>
                  
                  <div
                    className="w-3 h-3 rounded-full border border-white shadow-sm"
                    style={{ backgroundColor: driver.color }}
                  />
                  
                  <div className="flex-1">
                    <div className={`font-semibold ${isUserDriver ? 'text-red-700' : 'text-gray-800'}`}>
                      {driver.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      #{driver.number} • {driver.team}
                    </div>
                  </div>
                </div>
                
                <div className="text-right space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="text-sm font-semibold text-gray-700">
                      {driver.laps}/{lapTarget}
                    </div>
                    {isFinished && (
                      <Flag className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                  
                  <div className="text-xs text-gray-500">
                    {leader && getGapToLeader(driver, leader)}
                  </div>
                </div>
              </div>
              
              {/* Lap Progress Bar */}
              <div className="mt-2">
                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{lapProgress.toFixed(1)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${
                      isFinished 
                        ? 'bg-gradient-to-r from-green-400 to-green-500' 
                        : isUserDriver
                        ? 'bg-gradient-to-r from-red-400 to-red-500'
                        : 'bg-gradient-to-r from-blue-400 to-blue-500'
                    }`}
                    style={{ width: `${lapProgress}%` }}
                  />
                </div>
              </div>
              
              {/* Driver Stats */}
              <div className="mt-2 flex items-center justify-between text-xs">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-1">
                    <Target className="w-3 h-3 text-gray-400" />
                    <span className="text-gray-600">Skill: {driver.skill}</span>
                  </div>
                </div>
                
                {raceRunning && !isFinished && (
                  <div className="flex items-center space-x-1 text-blue-600">
                    <Clock className="w-3 h-3" />
                    <span>Racing</span>
                  </div>
                )}
                
                {isFinished && (
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <Flag className="w-3 h-3" />
                    <span>Finished</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {grid.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Build the grid to see the leaderboard</p>
        </div>
      )}
    </div>
  );
};