import { Map, List, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BottomNavProps {
  activeTab: string;
  setTab: (tab: string) => void;
}

export function BottomNav({ activeTab, setTab }: BottomNavProps) {
  const tabs = [
    { id: "xarita", label: "Xarita", icon: Map },
    { id: "muammolar", label: "Muammolar", icon: List },
    { id: "qoshish", label: "Qo'shish", icon: PlusCircle },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 p-4 pb-6 z-50 pointer-events-none flex justify-center">
      <div className="bg-white/85 backdrop-blur-xl border border-border/50 shadow-2xl rounded-full flex items-center justify-between px-2 py-2 pointer-events-auto w-full max-w-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setTab(tab.id)}
              className="relative flex flex-col items-center justify-center w-20 h-14 rounded-full transition-all duration-300"
            >
              {isActive && (
                <motion.div
                  layoutId="nav-bubble"
                  className="absolute inset-0 bg-primary/10 rounded-full"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <Icon
                className={`w-6 h-6 z-10 transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={`text-[10px] mt-1 font-medium z-10 transition-colors duration-300 ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
