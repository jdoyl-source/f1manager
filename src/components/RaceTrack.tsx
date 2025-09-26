import React from 'react';
import { Driver } from '../types/game';

interface RaceTrackProps {
  grid: Driver[];
  userTeamName: string;
  lapTarget: number;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ grid, userTeamName, lapTarget }) => {
  const trackWidth = 700;
  const trackHeight = 500;
  const centerX = trackWidth / 2;
  const centerY = trackHeight / 2;
  const trackRadius = 180;
  const innerRadius = 120;

  return (
    <div className="relative">
      <svg 
        width={trackWidth} 
        height={trackHeight} 
        className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg border-4 border-gray-300"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
      >
        {/* Track surface */}
        <defs>
          <radialGradient id="trackGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#374151" />
            <stop offset="100%" stopColor="#1f2937" />
          </radialGradient>
          <pattern id="trackPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#374151"/>
            <rect x="0" y="0" width="10" height="10" fill="#4b5563"/>
            <rect x="10" y="10" width="10" height="10" fill="#4b5563"/>
          </pattern>
        </defs>
        
        {/* Outer track */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={trackRadius} 
          fill="url(#trackPattern)" 
          stroke="#6b7280" 
          strokeWidth={4}
        />
        
        {/* Inner track */}
        <circle 
          cx={centerX} 
          cy={centerY} 
          r={innerRadius} 
          fill="#10b981" 
          stroke="#059669" 
          strokeWidth={3}
        />
        
        {/* Track markings */}
        {[0, Math.PI/2, Math.PI, 3*Math.PI/2].map((angle, i) => (
          <g key={i}>
            <line
              x1={centerX + (innerRadius + 10) * Math.cos(angle)}
              y1={centerY + (innerRadius + 10) * Math.sin(angle)}
              x2={centerX + (trackRadius - 10) * Math.cos(angle)}
              y2={centerY + (trackRadius - 10) * Math.sin(angle)}
              stroke="#fbbf24"
              strokeWidth={3}
              strokeDasharray="10,5"
            />
          </g>
        ))}
        
        {/* Start/finish line */}
        <line
          x1={centerX + innerRadius}
          y1={centerY}
          x2={centerX + trackRadius}
          y2={centerY}
          stroke="#ef4444"
          strokeWidth={6}
        />
        <text
          x={centerX + trackRadius + 15}
          y={centerY + 5}
          fontSize="14"
          fontWeight="bold"
          fill="#ef4444"
        >
          START/FINISH
        </text>
        
        {/* Cars */}
        {grid.map((car, index) => {
          const angle = car.angle || 0;
          const radius = trackRadius - 30;
          const x = centerX + radius * Math.cos(angle);
          const y = centerY + radius * Math.sin(angle);
          const isUserCar = car.team === userTeamName;
          const isTopThree = car.position <= 3;
          
          return (
            <g key={car.id}>
              {/* Car shadow */}
              <ellipse
                cx={x + 2}
                cy={y + 2}
                rx={isUserCar ? 12 : 8}
                ry={isUserCar ? 8 : 6}
                fill="rgba(0,0,0,0.3)"
              />
              
              {/* Car body */}
              <ellipse
                cx={x}
                cy={y}
                rx={isUserCar ? 12 : 8}
                ry={isUserCar ? 8 : 6}
                fill={car.color}
                stroke={isTopThree ? "#fbbf24" : isUserCar ? "#ffffff" : "none"}
                strokeWidth={isTopThree ? 3 : isUserCar ? 2 : 0}
                style={{
                  filter: isUserCar ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none',
                  transform: `rotate(${angle + Math.PI/2}rad)`,
                  transformOrigin: `${x}px ${y}px`
                }}
              />
              
              {/* Car number */}
              <text
                x={x}
                y={y + 4}
                fontSize={isUserCar ? "12" : "10"}
                fontWeight="bold"
                fill="#ffffff"
                textAnchor="middle"
                style={{ userSelect: "none" }}
              >
                {car.number}
              </text>
              
              {/* Position indicator for top 3 */}
              {isTopThree && (
                <circle
                  cx={x - 15}
                  cy={y - 15}
                  r={8}
                  fill={car.position === 1 ? "#ffd700" : car.position === 2 ? "#c0c0c0" : "#cd7f32"}
                  stroke="#ffffff"
                  strokeWidth={2}
                />
              )}
              {isTopThree && (
                <text
                  x={x - 15}
                  y={y - 11}
                  fontSize="10"
                  fontWeight="bold"
                  fill="#000000"
                  textAnchor="middle"
                >
                  {car.position}
                </text>
              )}
              
              {/* Lap progress indicator */}
              <rect
                x={x - 10}
                y={y + 15}
                width={20}
                height={4}
                fill="rgba(0,0,0,0.3)"
                rx={2}
              />
              <rect
                x={x - 10}
                y={y + 15}
                width={20 * (car.laps / lapTarget)}
                height={4}
                fill="#10b981"
                rx={2}
              />
            </g>
          );
        })}
        
        {/* Track info */}
        <rect x={10} y={10} width={200} height={80} fill="rgba(255,255,255,0.9)" rx={8} />
        <text x={20} y={30} fontSize="14" fontWeight="bold" fill="#374151">Monaco Grand Prix</text>
        <text x={20} y={50} fontSize="12" fill="#6b7280">Distance: {lapTarget} Laps</text>
        <text x={20} y={70} fontSize="12" fill="#6b7280">Cars: {grid.length}</text>
      </svg>
    </div>
  );
};