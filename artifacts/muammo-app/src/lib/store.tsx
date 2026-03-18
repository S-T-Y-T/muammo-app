import React, { createContext, useContext, useEffect, useState } from "react";
import { Muammo, PendingCoords } from "./types";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "@/hooks/use-toast";

interface MuammoContextType {
  muammolar: Muammo[];
  addMuammo: (muammo: Omit<Muammo, "id" | "sana">) => void;
  getMuammoById: (id: string) => Muammo | undefined;
  pendingCoords: PendingCoords | null;
  setPendingCoords: (coords: PendingCoords | null) => void;
}

const MuammoContext = createContext<MuammoContextType | undefined>(undefined);

export function MuammoProvider({ children }: { children: React.ReactNode }) {
  const { toast } = useToast();
  const [muammolar, setMuammolar] = useState<Muammo[]>([]);
  const [pendingCoords, setPendingCoords] = useState<PendingCoords | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("muammolar");
      if (stored) {
        setMuammolar(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load muammolar", e);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when muammolar changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("muammolar", JSON.stringify(muammolar));
    }
  }, [muammolar, isLoaded]);

  const addMuammo = (m: Omit<Muammo, "id" | "sana">) => {
    const newMuammo: Muammo = {
      ...m,
      id: uuidv4(),
      sana: new Date().toISOString(),
    };
    setMuammolar((prev) => [newMuammo, ...prev]);
    toast({
      title: "Muvaffaqiyatli!",
      description: "Muammo muvaffaqiyatli saqlandi.",
      variant: "default",
    });
  };

  const getMuammoById = (id: string) => {
    return muammolar.find((m) => m.id === id);
  };

  return (
    <MuammoContext.Provider
      value={{
        muammolar,
        addMuammo,
        getMuammoById,
        pendingCoords,
        setPendingCoords,
      }}
    >
      {children}
    </MuammoContext.Provider>
  );
}

export function useMuammolar() {
  const context = useContext(MuammoContext);
  if (!context) {
    throw new Error("useMuammolar must be used within a MuammoProvider");
  }
  return context;
}
