import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { BottomNav } from "@/components/BottomNav";
import { MapTab } from "@/components/tabs/MapTab";
import { ListTab } from "@/components/tabs/ListTab";
import { AddTab } from "@/components/tabs/AddTab";
import { useMuammolar } from "@/lib/store";

export function Home() {
  const [searchString, setSearchString] = useSearch();
  const searchParams = new URLSearchParams(searchString);
  const activeTab = searchParams.get("tab") || "xarita";
  const { setPendingCoords } = useMuammolar();

  const setTab = (tab: string) => {
    setSearchString(`tab=${tab}`);
  };

  const handleCoordsSelected = () => {
    setTab("qoshish");
  };

  const handleAddSuccess = () => {
    setPendingCoords(null);
    setTab("xarita");
  };

  return (
    <div className="h-[100dvh] w-full bg-background flex flex-col overflow-hidden relative">
      <main className="flex-1 overflow-y-auto no-scrollbar relative z-0">
        {activeTab === "xarita" && <MapTab onCoordsSelected={handleCoordsSelected} />}
        {activeTab === "muammolar" && <ListTab />}
        {activeTab === "qoshish" && (
          <AddTab onSuccess={handleAddSuccess} goToMap={() => setTab("xarita")} />
        )}
      </main>

      <BottomNav activeTab={activeTab} setTab={setTab} />
    </div>
  );
}
