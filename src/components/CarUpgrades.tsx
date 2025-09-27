import React, { useState } from 'react';
import { Wrench, Zap, Shield, Wind, DollarSign, CheckCircle } from 'lucide-react';

interface CarUpgradesProps {
  money: number;
  onPurchaseUpgrade: (cost: number) => void;
}

interface Upgrade {
  id: string;
  name: string;
  description: string;
  cost: number;
  icon: React.ReactNode;
  category: 'engine' | 'aerodynamics' | 'safety' | 'electronics';
  benefit: string;
}

export const CarUpgrades: React.FC<CarUpgradesProps> = ({ money, onPurchaseUpgrade }) => {
  const [purchasedUpgrades, setPurchasedUpgrades] = useState<Set<string>>(new Set());

  const upgrades: Upgrade[] = [
    {
      id: 'Turbo-Engine',
      name: 'Turbo Engine Upgrade',
      description: 'Increases top speed and acceleration on straights',
      cost: 250000,
      icon: <Zap className="w-6 h-6" />,
      category: 'engine',
      benefit: '+5% Speed Boost'
    },
    {
      id: 'Aero Package',
      name: 'Advanced Aerodynamics',
      description: 'Improved downforce and cornering performance',
      cost: 180000,
      icon: <Wind className="w-6 h-6" />,
      category: 'aerodynamics',
      benefit: '+3% Cornering'
    },
    {
      id: 'Safety-upgrade',
      name: 'Enhanced Safety Systems',
      description: 'Better crash protection and driver confidence',
      cost: 120000,
      icon: <Shield className="w-6 h-6" />,
      category: 'safety',
      benefit: '+2% Reliability'
    },
    {
      id: 'Electronics',
      name: 'Advanced Electronics',
      description: 'Improved telemetry and race strategy systems',
      cost: 200000,
      icon: <Wrench className="w-6 h-6" />,
      category: 'electronics',
      benefit: '+4% Strategy'
    },
    {
      id: 'Material Research',
      name: 'Carbon Fiber Body',
      description: 'Reduces weight for better performance',
      cost: 300000,
      icon: <Wind className="w-6 h-6" />,
      category: 'aerodynamics',
      benefit: '+6% Overall Performance'
    },
    {
      id: 'hybrid-system',
      name: 'Hybrid Power Unit',
      description: 'Energy recovery system for extra power',
      cost: 400000,
      icon: <Zap className="w-6 h-6" />,
      category: 'engine',
      benefit: '+8% Power Output'
    }
  ];

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'engine': return 'from-red-500 to-red-600';
      case 'aerodynamics': return 'from-blue-500 to-blue-600';
      case 'safety': return 'from-green-500 to-green-600';
      case 'electronics': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  const handlePurchase = (upgrade: Upgrade) => {
    if (money >= upgrade.cost && !purchasedUpgrades.has(upgrade.id)) {
      setPurchasedUpgrades(prev => new Set([...prev, upgrade.id]));
      onPurchaseUpgrade(upgrade.cost);
    }
  };

  const totalSpent = Array.from(purchasedUpgrades).reduce((total, upgradeId) => {
    const upgrade = upgrades.find(u => u.id === upgradeId);
    return total + (upgrade?.cost || 0);
  }, 0);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Wrench className="w-8 h-8 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Car Upgrades</h2>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">${money.toLocaleString()}</div>
          <div className="text-sm text-gray-600">Available Budget</div>
        </div>
      </div>

      {purchasedUpgrades.size > 0 && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4 mb-6">
          <div className="flex items-center space-x-2 mb-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="font-semibold text-green-700">Upgrades Purchased: {purchasedUpgrades.size}</span>
          </div>
          <div className="text-sm text-green-600">
            Total Investment: ${totalSpent.toLocaleString()}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {upgrades.map(upgrade => {
          const isPurchased = purchasedUpgrades.has(upgrade.id);
          const canAfford = money >= upgrade.cost;
          
          return (
            <div
              key={upgrade.id}
              className={`relative p-6 rounded-xl border-2 transition-all duration-300 ${
                isPurchased
                  ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-300'
                  : 'bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 hover:shadow-lg hover:scale-105'
              }`}
            >
              {isPurchased && (
                <div className="absolute top-3 right-3">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
              )}
              
              <div className={`inline-flex p-3 rounded-full bg-gradient-to-r ${getCategoryColor(upgrade.category)} text-white mb-4`}>
                {upgrade.icon}
              </div>
              
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{upgrade.name}</h3>
              <p className="text-sm text-gray-600 mb-4">{upgrade.description}</p>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                <div className="text-sm font-semibold text-blue-700">{upgrade.benefit}</div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-1 text-lg font-bold text-gray-800">
                  <DollarSign className="w-5 h-5" />
                  <span>{upgrade.cost.toLocaleString()}</span>
                </div>
              </div>
              
              <button
                className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
                  isPurchased
                    ? 'bg-green-500 text-white cursor-default'
                    : canAfford
                    ? `bg-gradient-to-r ${getCategoryColor(upgrade.category)} text-white hover:shadow-lg`
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
                onClick={() => handlePurchase(upgrade)}
                disabled={isPurchased || !canAfford}
              >
                {isPurchased ? 'Purchased' : canAfford ? 'Purchase' : 'Insufficient Funds'}
              </button>
            </div>
          );
        })}
      </div>
      
      <div className="mt-8 p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200">
        <h3 className="font-semibold text-blue-800 mb-2">Upgrade Strategy Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Engine upgrades provide the biggest performance gains</li>
          <li>• Aerodynamics help with cornering and fuel efficiency</li>
          <li>• Safety upgrades reduce the risk of race incidents</li>
          <li>• Electronics improve race strategy and pit stop timing</li>
        </ul>
      </div>
    </div>
  );
};