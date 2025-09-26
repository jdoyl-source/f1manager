import React from 'react';
import { Play, Pause, RotateCcw, Users } from 'lucide-react';

interface RaceControlsProps {
  money: number;
  userTeam: { name: string; drivers: any[] };
  raceRunning: boolean;
  gridLength: number;
  onBuildGrid: () => void;
  onStartRace: () => void;
  onPauseRace: () => void;
  onResetRace: () => void;
}

export const RaceControls: React.FC<RaceControlsProps> = ({
  money,
  userTeam,
  raceRunning,
  gridLength,
  onBuildGrid,
  onStartRace,
  onPauseRace,
  onResetRace
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-4">
      <div className="text-center space-y-2">
        <div className="text-2xl font-bold text-green-600">
          ${money.toLocaleString()}
        </div>
        <div className="text-sm text-gray-600">Team Budget</div>
        
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white px-4 py-2 rounded-lg">
          <div className="font-semibold">{userTeam.name}</div>
          <div className="text-sm opacity-90">
            <Users className="inline w-4 h-4 mr-1" />
            {userTeam.drivers.length}/2 Drivers
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onBuildGrid}
          disabled={userTeam.drivers.length === 0}
          title={userTeam.drivers.length === 0 ? "Hire drivers first" : "Build race grid"}
        >
          <Users className="w-5 h-5" />
          <span>Build Grid</span>
        </button>
        
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl shadow-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onStartRace}
          disabled={raceRunning || gridLength === 0}
        >
          <Play className="w-5 h-5" />
          <span>Start Race</span>
        </button>
        
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl shadow-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
          onClick={onPauseRace}
          disabled={!raceRunning}
        >
          <Pause className="w-5 h-5" />
          <span>Pause Race</span>
        </button>
        
        <button
          className="w-full px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl shadow-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 flex items-center justify-center space-x-2"
          onClick={onResetRace}
        >
          <RotateCcw className="w-5 h-5" />
          <span>Reset Race</span>
        </button>
      </div>
    </div>
  );
};