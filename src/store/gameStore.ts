import { create } from "zustand";

export type phaseNames =
  | "lobby"
  | "night"
  | "day"
  | "discussion"
  | "voting"
  | "gameOver"
  | "acquaintance";

export const useGameStore = create((set) => ({
  // STATE
  phase: "lobby",
  players: [], // Array of player objects
  playersCount: 0, // Total number of players
  speechTimer: 60, // Timer for speech phase
  round: 1, // Current round number

  // ACTIONS

  setPhase: (phaseName: phaseNames) => set({ phase: phaseName }),

  setPlayers: (playersArray: any[]) => set({ players: playersArray }),

  addPlayer: (nickname: string, tableOrder: number) =>
    set((state: any) => ({
      players: [
        ...state.players,
        {
          nickname: nickname,
          tableOrder: tableOrder,
          role: "Citizen",
          id: tableOrder,
          isAlive: true,
          fouls: 0,
          isVoted: false,
          votesRecived: 0,
        },
      ],
    })),

  addFoul: (playerId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) =>
        player.id === playerId
          ? { ...player, fouls: player.fouls + 1 }
          : player,
      ),
    })),

  killPlayer: (playerId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) =>
        player.id === playerId ? { ...player, isAlive: false } : player,
      ),
    })),

  votesFor: (votedId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) =>
        player.id === votedId
          ? { ...player, votesRecived: player.votesRecived + 1 }
          : player,
      ),
    })),
}));
