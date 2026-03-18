import { useRoute, Link } from "wouter";
import { useMuammolar } from "@/lib/store";
import { ArrowLeft, Calendar, MapPin, Share2, Wallet, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";

export function DetailPage() {
  const [, params] = useRoute("/muammo/:id");
  const { getMuammoById } = useMuammolar();
  const { toast } = useToast();

  const muammo = params?.id ? getMuammoById(params.id) : undefined;

  if (!muammo) {
    return (
      <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center p-6 text-center">
        <AlertCircle className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h1 className="text-2xl font-bold mb-2">Muammo topilmadi</h1>
        <p className="text-muted-foreground mb-6">Bu muammo o'chirilgan yoki mavjud emas.</p>
        <Link href="/?tab=muammolar" className="bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold">
          Ro'yxatga qaytish
        </Link>
      </div>
    );
  }

  const handleDonate = () => {
    toast({
      title: "Rahmat! 💝",
      description: "To'lovingiz muvaffaqiyatli qabul qilindi. Ushbu muammoni hal qilishga o'z hissangizni qo'shdingiz.",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: muammo.nomi,
          text: muammo.tavsif,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Nusxa olindi",
          description: "Havola vaqtinchalik xotiraga saqlandi.",
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-background pb-20">
      {/* Header Image */}
      <div className="relative w-full h-72 bg-muted">
        {muammo.rasm ? (
          <img src={muammo.rasm} alt={muammo.nomi} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/80">
            <MapPin className="w-12 h-12 text-muted-foreground/30 mb-2" />
            <span className="text-sm font-medium text-muted-foreground/50">Rasm yuklanmagan</span>
          </div>
        )}
        
        {/* Gradient Overlay for Top Nav */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        
        <Link 
          href="/?tab=muammolar" 
          className="absolute top-4 left-4 w-10 h-10 bg-white/20 backdrop-blur-md flex items-center justify-center rounded-full text-white hover:bg-white/30 transition-colors z-10 shadow-sm border border-white/10"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        {/* Urgency Badge */}
        <div className="absolute bottom-4 right-4 z-10">
          {muammo.muhimlik === 'yuqori' ? (
            <span className="bg-destructive text-destructive-foreground px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-destructive/20 border border-destructive-foreground/10 backdrop-blur-md">
              🔴 Yuqori muhimlik
            </span>
          ) : (
            <span className="bg-yellow-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg shadow-yellow-500/20 border border-white/20 backdrop-blur-md">
              🟡 O'rta muhimlik
            </span>
          )}
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Title & Date */}
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground leading-tight mb-3">
            {muammo.nomi}
          </h1>
          <div className="flex items-center text-sm font-medium text-muted-foreground">
            <Calendar className="w-4 h-4 mr-2" />
            {format(new Date(muammo.sana), "dd MMMM, yyyy HH:mm")}
          </div>
        </div>

        {/* Description */}
        <div className="prose prose-sm max-w-none text-foreground/80">
          <p className="leading-relaxed text-base">{muammo.tavsif}</p>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-1 gap-3 bg-secondary/50 rounded-2xl p-4 border border-border/50">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
              <MapPin className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Joylashuv</p>
              <p className="font-medium font-mono text-sm">{muammo.lat.toFixed(5)}, {muammo.lng.toFixed(5)}</p>
            </div>
          </div>
          
          <div className="w-full h-[1px] bg-border/50 my-1" />

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
              <Wallet className="w-4 h-4 text-green-600" />
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-0.5">Taxminiy Narx</p>
              <p className="font-bold text-base text-foreground">
                {muammo.narx > 0 ? new Intl.NumberFormat('uz-UZ').format(muammo.narx) + " so'm" : "Narx belgilanmagan"}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2">
          <button 
            onClick={handleDonate}
            className="flex-1 bg-primary text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Wallet className="w-5 h-5" />
            Donat qilish
          </button>
          <button 
            onClick={handleShare}
            className="w-14 shrink-0 bg-secondary text-secondary-foreground font-bold rounded-xl border border-border hover:bg-secondary/80 active:scale-95 transition-all flex items-center justify-center"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
