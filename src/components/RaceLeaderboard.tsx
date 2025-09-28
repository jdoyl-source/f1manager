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