import { useState } from "react";
import { Seat } from "@/types/reservation";
import { cn } from "@/lib/utils";

interface SeatGridProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  mode: "select" | "delete";
  selectedSeats?: Seat[];
}

const SeatGrid = ({ seats, onSeatClick, mode, selectedSeats = [] }: SeatGridProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const rows = ['A', 'B', 'C', 'D', 'E'];
  const seatsPerRow = 18;
  
  const getSeatColor = (seat: Seat) => {
    if (selectedSeats.some(s => s.id === seat.id)) {
      return "bg-seat-selected hover:bg-seat-selected/80 border-seat-selected";
    }
    if (seat.isOccupied) {
      return "bg-seat-occupied hover:bg-seat-occupied/80 border-seat-occupied cursor-pointer";
    }
    return "bg-seat-available hover:bg-seat-hover border-seat-available cursor-pointer";
  };

  const canClickSeat = (seat: Seat) => {
    if (mode === "select") {
      return !seat.isOccupied || selectedSeats.some(s => s.id === seat.id);
    }
    if (mode === "delete") {
      return seat.isOccupied;
    }
    return false;
  };

  return (
    <div className="bg-card p-8 rounded-lg border border-border">
      {/* Screen */}
      <div className="mb-8 text-center">
        <div className="w-full h-4 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2"></div>
        <p className="text-sm text-muted-foreground font-semibold">PANTALLA</p>
      </div>
      
      {/* Seat Grid */}
      <div className="grid grid-cols-1 gap-4 max-w-4xl mx-auto">
        {rows.map((row) => (
          <div key={row} className="flex items-center justify-center gap-2">
            {/* Row Label */}
            <div className="w-8 text-center font-bold text-foreground">{row}</div>
            
            {/* Seats */}
            <div className="flex gap-2">
              {/* First aisle */}
              <div className="w-4"></div>
              
              {/* First section (9 seats) */}
              {Array.from({ length: 9 }, (_, index) => {
                const seatNumber = index + 1;
                // Asegurarnos de que el número de asiento tenga dos dígitos
                const formattedSeatNumber = seatNumber.toString().padStart(2, '0');
                const seatId = `${row}${formattedSeatNumber}`;
                const seat = seats.find(s => s.id === seatId) || {
                  id: seatId,
                  row,
                  number: seatNumber,
                  isOccupied: false
                };
              
                return (
                  <button
                    key={seatId}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all duration-200 text-xs font-bold flex items-center justify-center",
                      getSeatColor(seat),
                      !canClickSeat(seat) && "cursor-not-allowed opacity-50",
                      hoveredSeat === seatId && canClickSeat(seat) && "transform scale-110 shadow-lg"
                    )}
                    onClick={() => canClickSeat(seat) && onSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seatId)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={!canClickSeat(seat)}
                    title={`Seat ${seatId}${seat.isOccupied ? ` - ${seat.person?.name || 'Occupied'}` : ''}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}

              {/* Middle aisle */}
              <div className="w-8"></div>

              {/* Second section (9 seats) */}
              {Array.from({ length: 9 }, (_, index) => {
                const seatNumber = index + 10;
                // Asegurarnos de que el número de asiento tenga dos dígitos
                const formattedSeatNumber = seatNumber.toString().padStart(2, '0');
                const seatId = `${row}${formattedSeatNumber}`;
                const seat = seats.find(s => s.id === seatId) || {
                  id: seatId,
                  row,
                  number: seatNumber,
                  isOccupied: false
                };
                
                return (
                  <button
                    key={seatId}
                    className={cn(
                      "w-8 h-8 rounded-lg border-2 transition-all duration-200 text-xs font-bold flex items-center justify-center",
                      getSeatColor(seat),
                      !canClickSeat(seat) && "cursor-not-allowed opacity-50",
                      hoveredSeat === seatId && canClickSeat(seat) && "transform scale-110 shadow-lg"
                    )}
                    onClick={() => canClickSeat(seat) && onSeatClick(seat)}
                    onMouseEnter={() => setHoveredSeat(seatId)}
                    onMouseLeave={() => setHoveredSeat(null)}
                    disabled={!canClickSeat(seat)}
                    title={`Seat ${seatId}${seat.isOccupied ? ` - ${seat.person?.name || 'Occupied'}` : ''}`}
                  >
                    {seatNumber}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex justify-center gap-6 mt-8 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-seat-available rounded border-2 border-seat-available"></div>
          <span className="text-foreground">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-seat-occupied rounded border-2 border-seat-occupied"></div>
          <span className="text-foreground">Ocupado</span>
        </div>
        {mode === "select" && (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-seat-selected rounded border-2 border-seat-selected"></div>
            <span className="text-foreground">Seleccionado</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatGrid;