import { create } from "zustand";

export type phaseNames =
  | "lobby"
  | "night"
  | "day"
  | "discussion"
  | "voting"
  | "gameOver"
  | "night acquaintance"
  | "day acquaintance";

export const useGameStore = create((set) => ({
  // STATE
  phase: "lobby",
  players: [], // Array of player objects
  raisedForVotingPlayers: [],
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
          raisedForVoting: false,
        },
      ],
    })),

  changeRole: (playerId: number, role: string) =>
    set((state: any) => ({
      players: state.players.map((player: any) =>
        player.id === playerId
          ? {
              ...player,
              role: role,
            }
          : player,
      ),
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

  raisedForVoting: (votedId: number) => {
    set((state: any) => {
      const updatedPlayers = state.players.map((player: any) =>
        player.id === votedId ? { ...player, raisedForVoting: true } : player,
      );

      const votedPlayer = updatedPlayers.find(
        (player: any) => player.id === votedId,
      );

      if (!votedPlayer) {
        return { players: updatedPlayers };
      }

      const alreadyRaised = state.raisedForVotingPlayers.some(
        (player: any) => player.id === votedId,
      );

      return {
        players: updatedPlayers,
        raisedForVotingPlayers: alreadyRaised
          ? state.raisedForVotingPlayers
          : [...state.raisedForVotingPlayers, votedPlayer],
      };
    });
  },
}));
