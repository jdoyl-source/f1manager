import React from 'react';
import { Trophy, Medal, Award, X } from 'lucide-react';
import { Driver } from '../types/game';

interface RaceResultsProps {
  results: Driver[];
  userTeamName: string;
  onClose: () => void;
}

export const RaceResults: React.FC<RaceResultsProps> = ({ results, userTeamName, onClose }) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1: return <Trophy className="w-5 h-5 text-yellow-500" />;
      case 2: return <Medal className="w-5 h-5 text-gray-400" />;
      case 3: return <Award className="w-5 h-5 text-amber-600" />;
      default: return <div className="w-5 h-5 flex items-center justify-center text-gray-500 font-bold">{position}</div>;
    }
  };

  const getPositionColor = (position: number) => {
    switch (position) {
      case 1: return 'bg-gradient-to-r from-yellow-400 to-yellow-500';
      case 2: return 'bg-gradient-to-r from-gray-300 to-gray-400';
      case 3: return 'bg-gradient-to-r from-amber-500 to-amber-600';
      default: return 'bg-gradient-to-r from-gray-100 to-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        <div className="bg-gradient-to-r from-red-600 to-red-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Trophy className="w-8 h-8" />
            <h2 className="text-2xl font-bold">Race Results</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>
        
        <div className="p-6 max-h-96 overflow-y-auto">
          <div className="space-y-3">
            {results.map((driver, index) => {
              const isUserDriver = driver.team === userTeamName;
              return (
                <div
                  key={driver.id}
                  className={`p-4 rounded-xl shadow-md transition-all duration-200 hover:shadow-lg ${
                    isUserDriver 
                      ? 'bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-300' 
                      : getPositionColor(driver.position)
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      {getPositionIcon(driver.position)}
                      <div>
                        <div className={`font-semibold ${isUserDriver ? 'text-red-700' : 'text-gray-800'}`}>
                          {driver.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {driver.team} • Skill: {driver.skill}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">#{driver.position}</div>
                      <div className="text-sm text-gray-600">{driver.laps} laps</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="bg-gray-50 p-6 border-t">
          <button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200"
          >
            Close Results
          </button>
        </div>
      </div>
    </div>
  );
};