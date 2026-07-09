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
  votingEntries: null,
  votingResult: null,
  playersCount: 0, // Total number of players
  speechTimer: 60, // Timer for speech phase
  round: 1, // Current round number

  // ACTIONS

  setPhase: (phaseName: phaseNames) => set({ phase: phaseName }),

  setRound: (roundNumber: number) => set({ round: roundNumber }),

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
          votesReceived: 0,
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

  submitReceivedVotes: (playerId: number, votesReceived: number) =>
    set((state: any) => {
      const alivePlayersCount = state.players.filter(
        (player: any) => player.isAlive,
      ).length;

      if (state.raisedForVotingPlayers.length === 0) {
        return { votingEntries: null };
      }

      const currentEntries = state.votingEntries ?? {};
      const nextEntries: any = {
        ...currentEntries,
        [playerId]: votesReceived,
      };

      const totalCandidates = state.raisedForVotingPlayers.length;
      const entriesCount = Object.keys(nextEntries).length;

      if (entriesCount < totalCandidates) {
        return {
          votingEntries: nextEntries,
        };
      }

      const orderedCandidates = state.raisedForVotingPlayers;
      const lastCandidate = orderedCandidates[orderedCandidates.length - 1];
      const submittedSum: any = Object.values(nextEntries).reduce(
        (sum: number, value: any) => sum + value,
        0,
      );
      const unusedVotes = Math.max(0, alivePlayersCount - submittedSum);

      const finalEntries: number[] = {
        ...nextEntries,
        [lastCandidate.id]: (nextEntries[lastCandidate.id] ?? 0) + unusedVotes,
      };

      const maxVotes = Math.max(...Object.values(finalEntries));
      const topPlayers = orderedCandidates.filter(
        (player: any) => finalEntries[player.id] === maxVotes,
      );
      const eliminatedPlayer = topPlayers.length === 1 ? topPlayers[0] : null;

      const updatedPlayers = state.players.map((player: any) => {
        if (!finalEntries.hasOwnProperty(player.id)) {
          return player;
        }

        const finalVotes = finalEntries[player.id];
        return {
          ...player,
          votesReceived: finalVotes,
          raisedForVoting: false,
          isVoted: eliminatedPlayer?.id === player.id,
          isAlive: eliminatedPlayer?.id === player.id ? false : player.isAlive,
        };
      });

      return {
        players: updatedPlayers,
        raisedForVotingPlayers: [],
        votingEntries: null,
        votingResult: {
          playerId: eliminatedPlayer?.id ?? null,
          nickname: eliminatedPlayer?.nickname ?? null,
          votesReceived: eliminatedPlayer
            ? finalEntries[eliminatedPlayer.id]
            : 0,
          alivePlayersCount,
          finalEntries,
        },
      };
    }),

  clearVotingResult: () => set({ votingResult: null }),

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
