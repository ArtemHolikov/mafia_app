import { create } from "zustand";

export const useLobbySettingsStore = create((set) => ({
    rolesForGame: [],
    allowedNumberOfFouls: 3,
    playersHaveImmunity: [],
}))