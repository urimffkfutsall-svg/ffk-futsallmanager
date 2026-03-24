export interface Season {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export type CompetitionType = 'superliga' | 'liga_pare' | 'kupa';

export interface Competition {
  id: string;
  name: string;
  type: CompetitionType;
  seasonId: string;
  isActiveLanding: boolean;
}

export interface Team {
  id: string;
  name: string;
  logo: string;
  competitionId: string;
  seasonId: string;
  foundedYear?: string;
  stadium?: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  birthDate?: string;
  position?: string;
  teamId: string;
  seasonId: string;
}

export type MatchStatus = 'planned' | 'live' | 'finished' | 'cancelled';

export interface Match {
  id: string;
  competitionId: string;
  seasonId: string;
  week: number;
  date?: string;
  time?: string;
  venue?: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  status: MatchStatus;
  isFeaturedLanding: boolean;
  referee1?: string;
  referee2?: string;
  referee3?: string;
  delegate?: string;
  possession_home?: number;
  possession_away?: number;
  shots_home?: number;
  shots_away?: number;
  fouls_home?: number;
  fouls_away?: number;
}

export interface Goal {
  id: string;
  matchId: string;
  playerId: string;
  teamId: string;
  minute: number;
  isOwnGoal: boolean;
}

export interface Scorer {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  teamId: string;
  competitionId: string;
  seasonId: string;
  goals: number;
  isManual: boolean;
  matchId?: string;
}

export interface PlayerOfWeek {
  id: string;
  firstName: string;
  lastName: string;
  photo: string;
  teamId: string;
  week: number;
  seasonId: string;
  isScorer: boolean;
  goalsCount: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  role: 'admin' | 'editor';
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  teamId?: string;
  status?: 'pending' | 'approved' | 'rejected' | 'deactive';
}

export interface TeamOfficial {
  id: string;
  teamId: string;
  firstName: string;
  lastName: string;
  position: string;
}

export interface PlayerDiscipline {
  id: string;
  playerId: string;
  teamId: string;
  week: number;
  type: 'yellow' | 'red' | 'note';
  note?: string;
  seasonId?: string;
}

export interface StandingsRow {
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
}

export interface CupRound {
  id: string;
  name: string;
  order: number;
  competitionId: string;
  seasonId: string;
}

export interface AppSettings {
  appName: string;
  logo: string;
  contact: string;
}

export interface CommissionDecision {
  id: string;
  title: string;
  content: string;
  week: number;
  date?: string;
}

export interface WeeklyFormation {
  id: string;
  week: number;
  seasonId?: string;
  players: FormationPlayer[];
  coach?: FormationCoach;
}

export interface FormationPlayer {
  id: string;
  firstName: string;
  lastName: string;
  teamId: string;
  position: 'goalkeeper' | 'field';
  positionIndex: number;
}

export interface FormationCoach {
  firstName: string;
  lastName: string;
  teamId: string;
}
