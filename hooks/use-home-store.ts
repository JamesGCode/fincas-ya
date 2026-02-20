import { create } from "zustand";
import { persist } from "zustand/middleware";

import { DateRange } from "react-day-picker";

interface HomeState {
  category: string;
  destination: string;
  guests: string;
  dateRange: DateRange | undefined;
  setCategory: (category: string) => void;
  setDestination: (destination: string) => void;
  setGuests: (guests: string) => void;
  setDateRange: (dateRange: DateRange | undefined) => void;
  resetFilters: () => void;
}

export const useHomeStore = create<HomeState>()(
  persist(
    (set) => ({
      category: "cerca-bogota",
      destination: "",
      guests: "",
      dateRange: undefined,
      setCategory: (category) => set({ category }),
      setDestination: (destination) => set({ destination }),
      setGuests: (guests) => set({ guests }),
      setDateRange: (dateRange) => set({ dateRange }),
      resetFilters: () =>
        set({
          category: "cerca-bogota",
          destination: "",
          guests: "",
          dateRange: undefined,
        }),
    }),
    {
      name: "home-filters-storage",
    },
  ),
);
