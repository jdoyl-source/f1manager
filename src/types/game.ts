export interface Driver {
  id: string;
  name: string;
  number: number;
  skill: number;
  salary: number;
  preferredColor: string;
  team?: string;
  color?: string;
  laps?: number;
  position?: number;
  angle?: number;
}

export interface Team {
  name: string;
  color: string;
  drivers: Driver[];
}

export interface RaceState {
  running: boolean;
  results: Driver[] | null;
  grid: Driver[];
}