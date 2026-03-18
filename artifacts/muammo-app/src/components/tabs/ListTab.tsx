import { useMuammolar } from "@/lib/store";
import { Link } from "wouter";
import { Calendar, MapPin } from "lucide-react";
import { format } from "date-fns";

export function ListTab() {
  const { muammolar } = useMuammolar();

  if (muammolar.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center">
        <div className="w-48 h-48 mb-6 relative opacity-80 mix-blend-multiply">
          <img 
            src={`${import.meta.env.BASE_URL}images/empty-state.png`} 
            alt="Bo'sh" 
            className="w-full h-full object-contain"
          />
        </div>
        <h2 className="text-2xl font-display font-bold text-foreground mb-2">Hozircha muammolar yo'q</h2>
        <p className="text-muted-foreground max-w-[250px]">Xaritadan foydalanib shahar muammolarini qo'shishingiz mumkin.</p>
      </div>
    );
  }

  return (
    <div className="p-4 pb-24 space-y-4">
      <h2 className="text-2xl font-display font-bold px-2 pt-2 pb-4">Shahar Muammolari</h2>
      
      {muammolar.map((m) => (
        <Link 
          key={m.id} 
          href={`/muammo/${m.id}`}
          className="block bg-card rounded-2xl overflow-hidden border border-border shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
        >
          <div className="h-32 w-full bg-muted relative overflow-hidden">
            {m.rasm ? (
              <img src={m.rasm} alt={m.nomi} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-secondary">
                <MapPin className="w-8 h-8 text-muted-foreground/30" />
              </div>
            )}
            <div className="absolute top-3 right-3">
              {m.muhimlik === 'yuqori' ? (
                <span className="bg-destructive text-destructive-foreground px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  Yuqori
                </span>
              ) : (
                <span className="bg-yellow-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                  O'rta
                </span>
              )}
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-lg leading-tight mb-1 text-foreground line-clamp-1">{m.nomi}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
              {m.tavsif}
            </p>
            
            <div className="flex items-center text-xs font-medium text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 mr-1.5 opacity-70" />
              {format(new Date(m.sana), "dd MMM, yyyy HH:mm")}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
