import React from 'react';
import { Driver } from '../types/game';

interface RaceTrackProps {
  grid: Driver[];
  userTeamName: string;
  lapTarget: number;
}

export const RaceTrack: React.FC<RaceTrackProps> = ({ grid, userTeamName, lapTarget }) => {
  const trackWidth = 800;
  const trackHeight = 600;
  
  // Monza track path points (simplified version of the actual layout)
  const getTrackPath = () => {
    const points = [
     
    ];
    return points;
  };

  const trackPoints = getTrackPath();
  const totalPoints = trackPoints.length;

  // Function to get position along track based on progress (0-1)
  const getPositionOnTrack = (progress: number, offset: number = 0) => {
    const adjustedProgress = (progress + offset) % 1;
    const pointIndex = adjustedProgress * (totalPoints - 1);
    const lowerIndex = Math.floor(pointIndex);
    const upperIndex = Math.ceil(pointIndex);
    const t = pointIndex - lowerIndex;

    if (lowerIndex === upperIndex) {
      return trackPoints[lowerIndex];
    }

    const lowerPoint = trackPoints[lowerIndex];
    const upperPoint = trackPoints[upperIndex];

    return {
      x: lowerPoint.x + (upperPoint.x - lowerPoint.x) * t,
      y: lowerPoint.y + (upperPoint.y - lowerPoint.y) * t
    };
  };

  // Function to get track direction at a point
  const getTrackDirection = (progress: number) => {
    const current = getPositionOnTrack(progress);
    const next = getPositionOnTrack(progress + 0.01);
    return Math.atan2(next.y - current.y, next.x - current.x);
  };

  // Create SVG path string for the track
  const createTrackPath = () => {
    let pathString = `M ${trackPoints[0].x} ${trackPoints[0].y}`;
    for (let i = 1; i < trackPoints.length; i++) {
      pathString += ` L ${trackPoints[i].x} ${trackPoints[i].y}`;
    }
    pathString += ' Z';
    return pathString;
  };

  return (
    <div className="relative">
      <svg 
        width={trackWidth} 
        height={trackHeight} 
        className="bg-gradient-to-br from-green-100 to-green-200 rounded-2xl shadow-lg border-4 border-gray-300"
        style={{ filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}
      >
        <defs>
          <pattern id="trackPattern" patternUnits="userSpaceOnUse" width="20" height="20">
            <rect width="20" height="20" fill="#374151"/>
            <rect x="0" y="0" width="10" height="10" fill="#4b5563"/>
            <rect x="10" y="10" width="10" height="10" fill="#4b5563"/>
          </pattern>
          <pattern id="grassPattern" patternUnits="userSpaceOnUse" width="30" height="30">
            <rect width="30" height="30" fill="#10b981"/>
            <rect x="0" y="0" width="15" height="15" fill="#059669"/>
            <rect x="15" y="15" width="15" height="15" fill="#059669"/>
          </pattern>
        </defs>
        
        {/* Grass background */}
        <rect width={trackWidth} height={trackHeight} fill="url(#grassPattern)" />
        
        {/* Track outer boundary */}
        <path
          d={createTrackPath()}
          fill="none"
          stroke="#6b7280"
          strokeWidth={80}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Track surface */}
        <path
          d={createTrackPath()}
          fill="none"
          stroke="url(#trackPattern)"
          strokeWidth={60}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Track center line */}
        <path
          d={createTrackPath()}
          fill="none"
          stroke="#fbbf24"
          strokeWidth={2}
          strokeDasharray="10,10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        
        {/* Start/finish line */}
        <line
          x1={trackPoints[0].x - 20}
          y1={trackPoints[0].y - 30}
          x2={trackPoints[0].x - 20}
          y2={trackPoints[0].y + 30}
          stroke="#ef4444"
          strokeWidth={8}
        />
        <line
          x1={trackPoints[0].x - 25}
          y1={trackPoints[0].y - 30}
          x2={trackPoints[0].x - 25}
          y2={trackPoints[0].y + 30}
          stroke="#ffffff"
          strokeWidth={4}
        />
        
        {/* Track sections labels */}
        <text x={500} y={320} fontSize="12" fontWeight="bold" fill="#374151" textAnchor="middle">
          Main Straight
        </text>
        <text x={650} y={250} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">
          Rettifilo Tribune
        </text>
        <text x={680} y={120} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">
          Curva Grande
        </text>
        <text x={400} y={100} fontSize="12" fontWeight="bold" fill="#374151" textAnchor="middle">
          Back Straight
        </text>
        <text x={100} y={200} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">
          Lesmo
        </text>
        <text x={350} y={330} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">
          Ascari
        </text>
        <text x={500} y={400} fontSize="10" fontWeight="bold" fill="#374151" textAnchor="middle">
          Parabolica
        </text>
        
        {/* Cars following the track */}
        {grid.map((car, index) => {
          const lapProgress = car.laps || 0;
          const angleProgress = (car.angle || 0) / (Math.PI * 2);
          const totalProgress = (lapProgress + angleProgress) / lapTarget;
          const currentProgress = angleProgress;
          
          // Add slight offset for each car to prevent overlap
          const carOffset = (index * 0.02) % 1;
          const position = getPositionOnTrack(currentProgress, carOffset);
          const direction = getTrackDirection(currentProgress);
          
          const isUserCar = car.team === userTeamName;
          const isTopThree = car.position <= 3;
          
          return (
            <g key={car.id}>
              {/* Car shadow */}
              <ellipse
                cx={position.x + 2}
                cy={position.y + 2}
                rx={isUserCar ? 12 : 8}
                ry={isUserCar ? 8 : 6}
                fill="rgba(0,0,0,0.3)"
                transform={`rotate(${direction * 180 / Math.PI} ${position.x + 2} ${position.y + 2})`}
              />
              
              {/* Car body */}
              <ellipse
                cx={position.x}
                cy={position.y}
                rx={isUserCar ? 12 : 8}
                ry={isUserCar ? 8 : 6}
                fill={car.color}
                stroke={isTopThree ? "#fbbf24" : isUserCar ? "#ffffff" : "none"}
                strokeWidth={isTopThree ? 3 : isUserCar ? 2 : 0}
                transform={`rotate(${direction * 180 / Math.PI} ${position.x} ${position.y})`}
                style={{
                  filter: isUserCar ? 'drop-shadow(0 0 8px rgba(239, 68, 68, 0.6))' : 'none'
                }}
              />
              
              {/* Car number */}
              <text
                x={position.x}
                y={position.y + 4}
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
                <>
                  <circle
                    cx={position.x - 20}
                    cy={position.y - 20}
                    r={8}
                    fill={car.position === 1 ? "#ffd700" : car.position === 2 ? "#c0c0c0" : "#cd7f32"}
                    stroke="#ffffff"
                    strokeWidth={2}
                  />
                  <text
                    x={position.x - 20}
                    y={position.y - 16}
                    fontSize="10"
                    fontWeight="bold"
                    fill="#000000"
                    textAnchor="middle"
                  >
                    {car.position}
                  </text>
                </>
              )}
              
              {/* Lap progress indicator */}
              <rect
                x={position.x - 10}
                y={position.y + 20}
                width={20}
                height={4}
                fill="rgba(0,0,0,0.3)"
                rx={2}
              />
              <rect
                x={position.x - 10}
                y={position.y + 20}
                width={20 * (car.laps / lapTarget)}
                height={4}
                fill="#10b981"
                rx={2}
              />
            </g>
          );
        })}
        
        {/* Track info */}
        <rect x={10} y={10} width={200} height={100} fill="rgba(255,255,255,0.95)" rx={8} stroke="#374151" strokeWidth={2} />
        <text x={20} y={35} fontSize="16" fontWeight="bold" fill="#374151">Autodromo Nazionale Monza</text>
        <text x={20} y={55} fontSize="12" fill="#6b7280">Distance: {lapTarget} Laps</text>
        <text x={20} y={75} fontSize="12" fill="#6b7280">Cars: {grid.length}</text>
        <text x={20} y={95} fontSize="12" fill="#6b7280">Length: 5.793 km</text>
        
        {/* Legend */}
        <rect x={trackWidth - 150} y={10} width={140} height={80} fill="rgba(255,255,255,0.95)" rx={8} stroke="#374151" strokeWidth={2} />
        <text x={trackWidth - 140} y={30} fontSize="12" fontWeight="bold" fill="#374151">Legend</text>
        <line x1={trackWidth - 140} y1={40} x2={trackWidth - 120} y2={40} stroke="#ef4444" strokeWidth={4} />
        <text x={trackWidth - 115} y={45} fontSize="10" fill="#6b7280">Start/Finish</text>
        <line x1={trackWidth - 140} y1={55} x2={trackWidth - 120} y2={55} stroke="#fbbf24" strokeWidth={2} strokeDasharray="5,5" />
        <text x={trackWidth - 115} y={60} fontSize="10" fill="#6b7280">Track Center</text>
        <circle cx={trackWidth - 130} cy={75} r={6} fill="#ef4444" stroke="#ffffff" strokeWidth={2} />
        <text x={trackWidth - 115} y={80} fontSize="10" fill="#6b7280">Your Car</text>
      </svg>
    </div>
  );
};