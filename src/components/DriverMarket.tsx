import React from 'react';
import { User, DollarSign, Star, Briefcase } from 'lucide-react';
import { Driver } from '../types/game';

interface DriverMarketProps {
  driversMarket: Driver[];
  userTeam: { name: string; drivers: Driver[] };
  money: number;
  maxTeamDrivers: number;
  onHireDriver: (driver: Driver) => void;
  onFireDriver: (driver: Driver) => void;
}

export const DriverMarket: React.FC<DriverMarketProps> = ({
  driversMarket,
  userTeam,
  money,
  maxTeamDrivers,
  onHireDriver,
  onFireDriver
}) => {
  const getSkillColor = (skill: number) => {
    if (skill >= 90) return 'text-purple-600 bg-purple-100';
    if (skill >= 80) return 'text-blue-600 bg-blue-100';
    if (skill >= 70) return 'text-green-600 bg-green-100';
    if (skill >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-gray-600 bg-gray-100';
  };

  const getSkillStars = (skill: number) => {
    const stars = Math.ceil(skill / 20);
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < stars ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <Briefcase className="w-8 h-8 text-blue-600" />
        <h2 className="text-2xl font-bold text-gray-800">Driver Market</h2>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 max-h-[500px] overflow-y-auto mb-6">
        {driversMarket.map(driver => {
          const canHire = userTeam.drivers.length < maxTeamDrivers && money >= driver.salary;
          
          return (
            <div
              key={driver.id}
              className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-200 hover:scale-105"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div
                    className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                    style={{ backgroundColor: driver.preferredColor }}
                  />
                  <div>
                    <div className="font-semibold text-gray-800">{driver.name}</div>
                    <div className="text-sm text-gray-500">#{driver.number}</div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Skill Level</span>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getSkillColor(driver.skill)}`}>
                    {driver.skill}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1">
                  {getSkillStars(driver.skill)}
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Salary</span>
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{driver.salary.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              
              <button
                className={`w-full py-2 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  canHire
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-md hover:shadow-lg'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => onHireDriver(driver)}
                disabled={!canHire}
                title={
                  userTeam.drivers.length >= maxTeamDrivers
                    ? `You can only hire ${maxTeamDrivers} drivers`
                    : money < driver.salary
                    ? "Not enough money"
                    : ""
                }
              >
                {canHire ? 'Hire Driver' : 'Cannot Hire'}
              </button>
            </div>
          );
        })}
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="w-6 h-6 text-red-600" />
          <h3 className="text-xl font-semibold text-gray-800">Your Drivers</h3>
        </div>
        
        {userTeam.drivers.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No drivers hired yet. Start building your team!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userTeam.drivers.map(driver => (
              <div
                key={driver.id}
                className="bg-gradient-to-r from-red-50 to-red-100 border-2 border-red-200 p-4 rounded-xl"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow-md"
                      style={{ backgroundColor: driver.preferredColor }}
                    />
                    <div>
                      <div className="font-semibold text-red-700">{driver.name}</div>
                      <div className="text-sm text-red-500">#{driver.number}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getSkillColor(driver.skill)}`}>
                    {driver.skill}
                  </div>
                </div>
                
                <div className="flex items-center space-x-1 mb-3">
                  {getSkillStars(driver.skill)}
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1 text-green-600 font-semibold">
                    <DollarSign className="w-4 h-4" />
                    <span>{driver.salary.toLocaleString()}</span>
                  </div>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-3 py-1 rounded-lg hover:from-red-600 hover:to-red-700 transition-all duration-200 text-sm font-semibold"
                    onClick={() => onFireDriver(driver)}
                  >
                    Release
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};