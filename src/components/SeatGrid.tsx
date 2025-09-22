import { useState } from "react";
import { Seat } from "@/types/reservation";
import { cn } from "@/lib/utils";
import SeatButton from "./SeatButton";

interface SeatGridProps {
  seats: Seat[];
  onSeatClick: (seat: Seat) => void;
  mode: "select" | "delete";
  selectedSeats?: Seat[];
}

const SeatGrid = ({ seats, onSeatClick, mode, selectedSeats = [] }: SeatGridProps) => {
  const [hoveredSeat, setHoveredSeat] = useState<string | null>(null);
  
  const rows = ['A', 'B', 'C', 'D', 'E'];
  
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
    return mode === "delete" && seat.isOccupied;
  };

  const renderSeatSection = (startNumber: number, endNumber: number, row: string) => {
    return Array.from({ length: endNumber - startNumber + 1 }, (_, index) => {
      const seatNumber = startNumber + index;
      const formattedSeatNumber = seatNumber.toString().padStart(2, '0');
      const seatId = `${row}${formattedSeatNumber}`;
      const seat = seats.find(s => s.id === seatId) || {
        id: seatId,
        row,
        number: seatNumber,
        isOccupied: false
      };
      
      return (
        <SeatButton
          key={seatId}
          seat={seat}
          seatId={seatId}
          seatNumber={seatNumber}
          isHovered={hoveredSeat === seatId}
          canClick={canClickSeat(seat)}
          onClick={() => canClickSeat(seat) && onSeatClick(seat)}
          onHover={(isHovered) => setHoveredSeat(isHovered ? seatId : null)}
          getColor={getSeatColor}
        />
      );
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border w-full max-w-full">
      {/* Screen */}
      <div className="p-2 sm:p-4">
        <div className="mb-4 text-center">
          <div className="w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent rounded-full mb-2"></div>
          <p className="text-xs text-muted-foreground font-semibold">PANTALLA</p>
        </div>
      </div>

      {/* Scrollable container with better spacing */}
      <div className="relative w-full">
        <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent pb-4">
          <div className="min-w-[300px] w-fit mx-auto px-4">
            {/* Seat Grid */}
            <div className="grid grid-cols-1 gap-y-1">
              {rows.map((row) => (
                <div key={row} className="flex items-center justify-start gap-1">
                  {/* Row Label */}
                  <div className="w-5 text-center font-bold text-foreground text-xs">{row}</div>
                  
                  {/* Seats Container */}
                  <div className="flex gap-x-1">
                    {/* First Section (1-9) */}
                    <div className="flex gap-x-1">
                      {renderSeatSection(1, 9, row)}
                    </div>
                    {/* Aisle */}
                    <div className="w-2"></div>
                    {/* Second Section (10-18) */}
                    <div className="flex gap-x-1">
                      {renderSeatSection(10, 18, row)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Fade effect for scroll indication */}
        <div className="absolute top-0 bottom-4 left-0 w-4 bg-gradient-to-r from-background to-transparent pointer-events-none"></div>
        <div className="absolute top-0 bottom-4 right-0 w-4 bg-gradient-to-l from-background to-transparent pointer-events-none"></div>
      </div>
      
      {/* Legend - More compact and responsive */}
      <div className="p-2 border-t border-border">
        <div className="flex flex-wrap justify-center items-center gap-3 text-xs">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-seat-available rounded border border-seat-available"></div>
            <span className="text-muted-foreground">Disponible</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 bg-seat-occupied rounded border border-seat-occupied"></div>
            <span className="text-muted-foreground">Ocupado</span>
          </div>
          {mode === "select" && (
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 bg-seat-selected rounded border border-seat-selected"></div>
              <span className="text-muted-foreground">Seleccionado</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;