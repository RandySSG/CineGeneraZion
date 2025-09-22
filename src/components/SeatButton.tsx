import { cn } from "@/lib/utils";
import { Seat } from "@/types/reservation";

interface SeatButtonProps {
  seat: Seat;
  seatId: string;
  seatNumber: number;
  isHovered: boolean;
  canClick: boolean;
  onClick: () => void;
  onHover: (isHovered: boolean) => void;
  getColor: (seat: Seat) => string;
}

const SeatButton = ({ 
  seat, 
  seatId, 
  seatNumber, 
  isHovered, 
  canClick, 
  onClick, 
  onHover,
  getColor 
}: SeatButtonProps) => {
  const getSeatTitle = (seatId: string, seat: Seat) => {
    return `Asiento ${seatId}${seat.isOccupied && seat.person ? ` - ${seat.person.name}` : ''}`;
  };

  return (
    <button
      key={seatId}
      className={cn(
        "w-8 h-8 rounded-lg border-2 transition-all duration-200 text-xs font-bold flex items-center justify-center",
        getColor(seat),
        !canClick && "cursor-not-allowed opacity-50",
        isHovered && canClick && "transform scale-110 shadow-lg"
      )}
      onClick={onClick}
      onMouseEnter={() => onHover(true)}
      onMouseLeave={() => onHover(false)}
      disabled={!canClick}
      title={getSeatTitle(seatId, seat)}
    >
      {seatNumber}
    </button>
  );
};

export default SeatButton;