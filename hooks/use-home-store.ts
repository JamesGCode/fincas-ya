import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HomeState {
  category: string;
  destination: string;
  guests: string;
  setCategory: (category: string) => void;
  setDestination: (destination: string) => void;
  setGuests: (guests: string) => void;
  resetFilters: () => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      category: "cerca-bogota",
      destination: "",
      guests: "",
      setCategory: (category) => set({ category }),
      setDestination: (destination) => set({ destination }),
      setGuests: (guests) => set({ guests }),
      resetFilters: () =>
        set({ category: "cerca-bogota", destination: "", guests: "" }),
    }),
    {
      name: "home-filters-storage",
    },
  ),
);
