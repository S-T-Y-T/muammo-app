import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useMuammolar } from "@/lib/store";
import { MapPin, ImagePlus, AlertCircle } from "lucide-react";
import { useState } from "react";

const formSchema = z.object({
  nomi: z.string().min(3, "Muammo nomini kamida 3ta harfdan iborat qilib kiriting"),
  tavsif: z.string().min(10, "Tavsifni batafsilroq kiriting (kamida 10ta harf)"),
  muhimlik: z.enum(["yuqori", "orta"], { required_error: "Muhimlikni tanlang" }),
  narx: z.coerce.number().min(0, "Narx manfiy bo'lishi mumkin emas").default(0),
  rasm: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

interface AddTabProps {
  onSuccess: () => void;
  goToMap: () => void;
}

export function AddTab({ onSuccess, goToMap }: AddTabProps) {
  const { addMuammo, pendingCoords } = useMuammolar();
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomi: "",
      tavsif: "",
      muhimlik: pendingCoords?.muhimlik || "orta",
      narx: 0,
    },
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        setImagePreview(base64);
        form.setValue("rasm", base64);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = (data: FormValues) => {
    if (!pendingCoords) {
      form.setError("root", { message: "Iltimos, avval xaritadan joyni tanlang" });
      return;
    }

    addMuammo({
      nomi: data.nomi,
      tavsif: data.tavsif,
      muhimlik: data.muhimlik,
      narx: data.narx,
      rasm: data.rasm,
      lat: pendingCoords.lat,
      lng: pendingCoords.lng,
    });
    
    onSuccess();
  };

  return (
    <div className="p-4 pb-24 max-w-lg mx-auto">
      <h2 className="text-2xl font-display font-bold mb-6 pt-2">Muammo Qo'shish</h2>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        
        {/* Coordinates Section */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Koordinatalar</label>
          {pendingCoords ? (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm font-bold text-foreground">Tanlangan joylashuv</p>
                  <p className="text-xs text-muted-foreground font-mono mt-0.5">
                    {pendingCoords.lat.toFixed(5)}, {pendingCoords.lng.toFixed(5)}
                  </p>
                </div>
              </div>
              <button 
                type="button"
                onClick={goToMap}
                className="text-xs font-bold text-primary px-3 py-1.5 bg-primary/10 hover:bg-primary/20 rounded-lg transition-colors"
              >
                O'zgartirish
              </button>
            </div>
          ) : (
            <button 
              type="button"
              onClick={goToMap}
              className="w-full bg-orange-50 border-2 border-dashed border-orange-200 text-orange-600 rounded-xl p-6 flex flex-col items-center justify-center gap-2 hover:bg-orange-100 transition-colors"
            >
              <AlertCircle className="w-8 h-8 opacity-80" />
              <span className="font-bold">Xaritadan joyni tanlang</span>
            </button>
          )}
        </div>

        {/* Nomi */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Muammo nomi</label>
          <input
            {...form.register("nomi")}
            placeholder="Masalan: Chuqur chuqurchalar"
            className="w-full px-4 py-3.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/60"
          />
          {form.formState.errors.nomi && (
            <p className="text-xs text-destructive font-medium">{form.formState.errors.nomi.message}</p>
          )}
        </div>

        {/* Tavsif */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Tavsif</label>
          <textarea
            {...form.register("tavsif")}
            placeholder="Muammo haqida batafsil ma'lumot bering..."
            rows={4}
            className="w-full px-4 py-3.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none placeholder:text-muted-foreground/60"
          />
          {form.formState.errors.tavsif && (
            <p className="text-xs text-destructive font-medium">{form.formState.errors.tavsif.message}</p>
          )}
        </div>

        {/* Rasm */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Rasm yuklash (ixtiyoriy)</label>
          <label className="cursor-pointer group">
            {imagePreview ? (
              <div className="relative w-full h-48 rounded-xl overflow-hidden border border-border">
                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-white font-medium bg-black/50 px-4 py-2 rounded-lg backdrop-blur-sm">O'zgartirish</span>
                </div>
              </div>
            ) : (
              <div className="w-full h-32 rounded-xl border-2 border-dashed border-border bg-muted/50 flex flex-col items-center justify-center text-muted-foreground group-hover:bg-muted group-hover:border-primary/50 transition-all">
                <ImagePlus className="w-8 h-8 mb-2 opacity-50" />
                <span className="text-sm font-medium">Kameradan yoki galereyadan</span>
              </div>
            )}
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        </div>

        {/* Muhimlik */}
        <div className="space-y-3">
          <label className="text-sm font-semibold text-foreground">Muhimlik darajasi</label>
          <div className="grid grid-cols-2 gap-3">
            <label className={`
              cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all
              ${form.watch("muhimlik") === "yuqori" ? "border-destructive bg-destructive/5" : "border-border bg-background hover:bg-muted"}
            `}>
              <input type="radio" value="yuqori" {...form.register("muhimlik")} className="hidden" />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.watch("muhimlik") === "yuqori" ? "border-destructive" : "border-muted-foreground"}`}>
                {form.watch("muhimlik") === "yuqori" && <div className="w-2 h-2 rounded-full bg-destructive" />}
              </div>
              <span className="font-bold text-destructive">Yuqori (Qizil)</span>
            </label>

            <label className={`
              cursor-pointer border-2 rounded-xl p-4 flex items-center gap-3 transition-all
              ${form.watch("muhimlik") === "orta" ? "border-yellow-500 bg-yellow-500/5" : "border-border bg-background hover:bg-muted"}
            `}>
              <input type="radio" value="orta" {...form.register("muhimlik")} className="hidden" />
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${form.watch("muhimlik") === "orta" ? "border-yellow-500" : "border-muted-foreground"}`}>
                {form.watch("muhimlik") === "orta" && <div className="w-2 h-2 rounded-full bg-yellow-500" />}
              </div>
              <span className="font-bold text-yellow-600">O'rta (Sariq)</span>
            </label>
          </div>
        </div>

        {/* Narx */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-foreground">Taxminiy narx (so'm)</label>
          <input
            type="number"
            {...form.register("narx")}
            className="w-full px-4 py-3.5 rounded-xl bg-background border border-input focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
          {form.formState.errors.narx && (
            <p className="text-xs text-destructive font-medium">{form.formState.errors.narx.message}</p>
          )}
        </div>

        {form.formState.errors.root && (
          <div className="bg-destructive/10 text-destructive text-sm font-medium p-4 rounded-xl border border-destructive/20 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {form.formState.errors.root.message}
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-primary text-primary-foreground font-bold text-lg py-4 rounded-xl shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 active:translate-y-0 active:shadow-md transition-all"
        >
          Tasdiqlash
        </button>

      </form>
    </div>
  );
}
