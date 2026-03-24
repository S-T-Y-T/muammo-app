import { useEffect, useRef, useState } from "react";
import { useMuammolar } from "@/lib/store";
import { useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Info, MapPin, LocateFixed } from "lucide-react";

interface MapTabProps {
  onCoordsSelected: () => void;
}

export function MapTab({ onCoordsSelected }: MapTabProps) {
  const { muammolar, setPendingCoords } = useMuammolar();
  const [, setLocation] = useLocation();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [ymapsLoaded, setYmapsLoaded] = useState(false);
  
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [clickedCoords, setClickedCoords] = useState<{lat: number, lng: number} | null>(null);
  const [userCoords, setUserCoords] = useState<{lat: number, lng: number} | null>(null);

  useEffect(() => {
    if (window.ymaps) {
      window.ymaps.ready(() => setYmapsLoaded(true));
      return;
    }
    const script = document.createElement("script");
    // Adding optional API key and keeping init standard
    script.src = "https://api-maps.yandex.ru/2.1/?lang=uz_UZ&apikey=24eceecc-b34e-4f05-88ff-1e82a938cbe6";
    script.async = true;
    script.onload = () => window.ymaps.ready(() => setYmapsLoaded(true));
    document.head.appendChild(script);
  }, []);

  useEffect(() => {
    if (!ymapsLoaded || !mapContainerRef.current) return;

    // Initialize Map
    const map = new window.ymaps.Map(mapContainerRef.current, {
      center: [41.2995, 69.2401], // Tashkent
      zoom: 12,
      controls: ['zoomControl']
    });
    
    mapInstanceRef.current = map;

    // Handle map click
    map.events.add('click', (e: any) => {
      const coords = e.get('coords');
      setClickedCoords({ lat: coords[0], lng: coords[1] });
      setBottomSheetOpen(true);
    });

    return () => {
      map.destroy();
      mapInstanceRef.current = null;
    };
  }, [ymapsLoaded]);

  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const map = mapInstanceRef.current;
    
    // Clear old placemarks
    map.geoObjects.removeAll();

    // Add muammolar to map
    muammolar.forEach(m => {
      const isUrgent = m.muhimlik === 'yuqori';
      const placemark = new window.ymaps.Placemark(
        [m.lat, m.lng],
        {
          balloonContent: `<b>${m.nomi}</b><br/>${m.tavsif.substring(0, 50)}...`,
        },
        {
          preset: isUrgent ? 'islands#redCircleIcon' : 'islands#yellowCircleIcon',
        }
      );
      
      placemark.events.add('click', (e: any) => {
        // Prevent map click event
        e.preventDefault();
        setLocation(`/muammo/${m.id}`);
      });
      
      map.geoObjects.add(placemark);
    });

    // Add user location marker if we have coordinates
    if (userCoords) {
      const userPlacemark = new window.ymaps.Placemark(
        [userCoords.lat, userCoords.lng],
        {
          balloonContent: `<b>Sizning joylashuvingiz</b>`,
        },
        {
          preset: 'islands#blueDotIcon',
        }
      );
      map.geoObjects.add(userPlacemark);
    }
  }, [ymapsLoaded, muammolar, userCoords, setLocation]);

  const handleMyGeolocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        
        setUserCoords({ lat, lng });

        if (mapInstanceRef.current) {
          // Smoothly transition to the user's location
          mapInstanceRef.current.setCenter([lat, lng], 16, {
            checkZoomRange: true,
            duration: 800
          });
        }
      }, (err) => {
        console.error("Geolocation error:", err);
      });
    }
  };

  const handleUrgencySelect = (muhimlik: 'yuqori' | 'orta') => {
    if (clickedCoords) {
      setPendingCoords({ ...clickedCoords, muhimlik });
      setBottomSheetOpen(false);
      onCoordsSelected(); // Switches tab to Add Form
    }
  };

  return (
    <div className="relative w-full h-full bg-muted">
      {!ymapsLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            <p className="text-muted-foreground font-medium">Xarita yuklanmoqda...</p>
          </div>
        </div>
      )}
      
      <div ref={mapContainerRef} className="w-full h-full" />

      {/* Floating instruction pill */}
      <div className="absolute top-4 left-4 right-4 pointer-events-none flex justify-center z-10">
        <div className="bg-background/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-border/50 text-sm font-medium text-foreground flex items-center gap-2">
          <MapPin className="w-4 h-4 text-primary" />
          Muammo joyini xaritadan tanlang
        </div>
      </div>

      {/* Geolocation Button */}
      <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={handleMyGeolocation}
          className="w-14 h-14 bg-background shadow-xl rounded-full flex items-center justify-center border border-border/50 text-foreground hover:bg-muted active:scale-95 transition-all"
        >
          <LocateFixed className="w-6 h-6 text-primary" />
        </button>
      </div>

      {/* Bottom Sheet for Urgency Selection */}
      <AnimatePresence>
        {bottomSheetOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 z-20"
              onClick={() => setBottomSheetOpen(false)}
            />
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", bounce: 0, duration: 0.4 }}
              className="absolute bottom-0 left-0 right-0 bg-background rounded-t-3xl shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-30 p-6 pb-24"
            >
              <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
              <h3 className="text-xl font-display font-bold text-center mb-6">Muammo darajasini tanlang</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleUrgencySelect('yuqori')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-destructive/10 border-2 border-destructive/20 hover:bg-destructive/20 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center text-destructive">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-destructive">Qizil</span>
                  <span className="text-xs text-destructive/80 font-medium">Shoshilinch muammo</span>
                </button>

                <button 
                  onClick={() => handleUrgencySelect('orta')}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl bg-yellow-500/10 border-2 border-yellow-500/20 hover:bg-yellow-500/20 active:scale-95 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-600">
                    <Info className="w-6 h-6" />
                  </div>
                  <span className="font-bold text-yellow-600">Sariq</span>
                  <span className="text-xs text-yellow-600/80 font-medium">Oddiy muammo</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
