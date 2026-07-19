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
  votingTie: null,
  votingResult: null,
  playersCount: 0, // Total number of players
  speechTimer: 60, // Timer for speech phase
  round: 1, // Current round number
  lastDoctorHealedPlayerId: null,
  lastDoctorHealRound: 0,
  selectedGameRoles: {
    Don: 1,
    Mafia: 1,
    Sheriff: 1,
    Doctor: 1,
    Journalist: 1,
    Thief: 1,
    Maniac: 1,
    Citizen: 1,
  },
  roleLimits: {
    Don: { min: 1, max: 1 },
    Mafia: { min: 1, max: 4 },
    Sheriff: { min: 1, max: 1 },
    Doctor: { min: 1, max: 1 },
    Journalist: { min: 1, max: 1 },
    Thief: { min: 1, max: 1 },
    Maniac: { min: 1, max: 1 },
    Citizen: { min: 1, max: 15 },
  },

  // ACTIONS

  setPhase: (phaseName: phaseNames) => set({ phase: phaseName }),

  setRound: (roundNumber: number) => set({ round: roundNumber }),

  setPlayers: (playersArray: any[]) =>
    set({
      players: playersArray.map((player: any) => ({
        ...player,
        pendingMafiaKill: player.pendingMafiaKill ?? false,
        pendingManiacKill: player.pendingManiacKill ?? false,
        pendingThiefBlock: player.pendingThiefBlock ?? false,
      })),
    }),

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
          pendingMafiaKill: false,
          pendingManiacKill: false,
          pendingThiefBlock: false,
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
      const nextEntries: Record<number, number> = {
        ...currentEntries,
        [playerId]: votesReceived,
      };

      const orderedCandidates = state.raisedForVotingPlayers;
      const totalCandidates = orderedCandidates.length;
      const entriesCount = Object.keys(nextEntries).length;

      // Helper to finalize with given entries - unused votes go to specified receiverId
      const finalize = (
        entries: Record<number, number>,
        receiverId?: number,
      ) => {
        const finalEntries: Record<number, number> = { ...entries };
        if (receiverId !== undefined) {
          finalEntries[receiverId] = finalEntries[receiverId] ?? 0;
        }

        const maxVotes = Math.max(...Object.values(finalEntries));
        const topPlayers = orderedCandidates.filter(
          (p: any) => finalEntries[p.id] === maxVotes,
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
            isAlive:
              eliminatedPlayer?.id === player.id ? false : player.isAlive,
          };
        });

        const remainingPlayersCount = updatedPlayers.filter(
          (player: any) => player.isAlive,
        ).length;

        return {
          players: updatedPlayers,
          raisedForVotingPlayers: [],
          votingEntries: null,
          votingTie: null,
          votingResult: {
            eliminated: Boolean(eliminatedPlayer),
            eliminatedIds: eliminatedPlayer ? [eliminatedPlayer.id] : [],
            playerId: eliminatedPlayer?.id ?? null,
            nickname: eliminatedPlayer?.nickname ?? "",
            votesReceived: eliminatedPlayer
              ? finalEntries[eliminatedPlayer.id]
              : maxVotes,
            alivePlayersCount: remainingPlayersCount,
            finalEntries,
          },
        };
      };

      // If not all entries yet, check for early finish conditions
      if (entriesCount < totalCandidates) {
        // compute sums
        const sumSoFar = Object.values(nextEntries).reduce(
          (s: number, v: number) => s + v,
          0,
        );
        const remainingVotes = Math.max(0, alivePlayersCount - sumSoFar);
        const currentVotes = nextEntries[playerId] ?? 0;

        // If current has majority
        if (currentVotes > alivePlayersCount / 2) {
          return finalize(nextEntries, playerId);
        }

        // If current is guaranteed top (others cannot catch up even if remaining votes go to them)
        const others = orderedCandidates.filter((p: any) => p.id !== playerId);
        const guaranteed = others.every((p: any) => {
          const otherVotes = nextEntries[p.id] ?? 0;
          const maxOtherPossible = otherVotes + remainingVotes;
          return currentVotes > maxOtherPossible;
        });

        if (guaranteed) {
          // assign leftover votes to current player and finalize
          return finalize(nextEntries, playerId);
        }

        // otherwise store the partial entries and continue
        return { votingEntries: nextEntries };
      }

      // All entries submitted - assign unused votes to last candidate
      const lastCandidate = orderedCandidates[orderedCandidates.length - 1];
      const submittedSum = Object.values(nextEntries).reduce(
        (s: number, v: number) => s + v,
        0,
      );
      const unusedVotes = Math.max(0, alivePlayersCount - submittedSum);
      const finalEntries: Record<number, number> = {
        ...nextEntries,
        [lastCandidate.id]: (nextEntries[lastCandidate.id] ?? 0) + unusedVotes,
      };

      const maxVotes = Math.max(...Object.values(finalEntries));
      const topPlayers = orderedCandidates.filter(
        (p: any) => finalEntries[p.id] === maxVotes,
      );

      if (topPlayers.length === 1) {
        // single winner -> eliminate
        return finalize(finalEntries, undefined);
      }

      // tie detected
      const tiedIds = topPlayers.map((p: any) => p.id);

      if (
        state.votingTie &&
        Array.isArray(state.votingTie.ids) &&
        state.votingTie.attempts >= 1
      ) {
        return {
          players: state.players.map((player: any) => ({
            ...player,
            raisedForVoting: false,
          })),
          raisedForVotingPlayers: [],
          votingEntries: null,
          votingTie: null,
          votingResult: {
            type: "tieResolution",
            eliminated: false,
            eliminatedIds: tiedIds,
            playerId: null,
            nickname: "",
            votesReceived: maxVotes,
            alivePlayersCount,
            finalEntries,
            tiedIds,
          },
        };
      }

      // Start a revote among tied players
      const tiedPlayers = orderedCandidates.filter((p: any) =>
        tiedIds.includes(p.id),
      );
      return {
        players: state.players.map((p: any) => ({
          ...p,
          raisedForVoting: tiedIds.includes(p.id),
        })),
        raisedForVotingPlayers: tiedPlayers,
        votingEntries: null,
        votingTie: {
          ids: tiedIds,
          attempts: (state.votingTie?.attempts ?? 0) + 1,
        },
      };
    }),

  resolveTieResolution: (decision: "leave" | "kick") =>
    set((state: any) => {
      const result = state.votingResult;

      if (result?.type !== "tieResolution" || !Array.isArray(result.tiedIds)) {
        return {};
      }

      const tiedIds = result.tiedIds;
      const updatedPlayers = state.players.map((player: any) => {
        if (!tiedIds.includes(player.id)) {
          return player;
        }

        if (decision === "kick") {
          return {
            ...player,
            raisedForVoting: false,
            isAlive: false,
            isVoted: true,
          };
        }

        return {
          ...player,
          raisedForVoting: false,
          isVoted: false,
        };
      });

      return {
        players: updatedPlayers,
        raisedForVotingPlayers: [],
        votingEntries: null,
        votingTie: null,
        votingResult: {
          ...result,
          eliminated: decision === "kick",
          eliminatedIds: decision === "kick" ? tiedIds : [],
          playerId: null,
          nickname: "",
          alivePlayersCount: updatedPlayers.filter(
            (player: any) => player.isAlive,
          ).length,
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

  updateSelectedRoleCount: (role: string, count: number) =>
    set((state: any) => ({
      selectedGameRoles: {
        ...state.selectedGameRoles,
        [role]: Math.max(0, count),
      },
    })),

  setPlayerImmunity: (playerId: number, nights: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) =>
        player.id === playerId
          ? { ...player, immunityNights: Math.max(0, nights) }
          : player,
      ),
    })),

  setMafiaNightTarget: (playerId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) => ({
        ...player,
        pendingMafiaKill:
          player.id === playerId && (player.immunityNights ?? 0) <= 0,
      })),
    })),

  setManiacNightTarget: (playerId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) => ({
        ...player,
        pendingManiacKill:
          player.id === playerId && (player.immunityNights ?? 0) <= 0,
      })),
    })),

  setThiefNightTarget: (playerId: number) =>
    set((state: any) => ({
      players: state.players.map((player: any) => ({
        ...player,
        pendingThiefBlock: player.id === playerId,
      })),
    })),

  doctorHealTarget: (playerId: number, currentRound: number) =>
    set((state: any) => {
      const samePlayerBlocked =
        state.lastDoctorHealedPlayerId === playerId &&
        state.lastDoctorHealRound === currentRound - 1;

      const updatedPlayers = state.players.map((player: any) => {
        if (player.id !== playerId) {
          return player;
        }

        if (samePlayerBlocked) {
          return player;
        }

        const hasMafiaKill = Boolean(player.pendingMafiaKill);
        const hasManiacKill = Boolean(player.pendingManiacKill);
        const killCount = Number(hasMafiaKill) + Number(hasManiacKill);

        if (killCount === 1) {
          return {
            ...player,
            pendingMafiaKill: false,
            pendingManiacKill: false,
          };
        }

        return player;
      });

      return {
        players: updatedPlayers,
        lastDoctorHealedPlayerId: playerId,
        lastDoctorHealRound: currentRound,
      };
    }),

  commitNightDeaths: () =>
    set((state: any) => ({
      players: state.players.map((player: any) => {
        const hasMafiaKill = Boolean(player.pendingMafiaKill);
        const hasManiacKill = Boolean(player.pendingManiacKill);
        const killCount = Number(hasMafiaKill) + Number(hasManiacKill);
        const isImmune = (player.immunityNights ?? 0) > 0;
        const shouldDie = killCount > 0 && !isImmune;

        return {
          ...player,
          isAlive: player.isAlive ? !shouldDie : player.isAlive,
          pendingMafiaKill: false,
          pendingManiacKill: false,
          pendingThiefBlock: false,
          immunityNights: Math.max(0, (player.immunityNights ?? 0) - 1),
        };
      }),
    })),

  clearNightMarks: () =>
    set((state: any) => ({
      players: state.players.map((player: any) => ({
        ...player,
        pendingMafiaKill: false,
        pendingManiacKill: false,
        pendingThiefBlock: false,
      })),
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
