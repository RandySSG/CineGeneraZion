import { useState, useEffect } from "react";
import MainMenu from "@/components/MainMenu";
import NewReservation from "@/components/NewReservation";
import DeleteReservation from "@/components/DeleteReservation";
import ReservationList from "@/components/ReservationList";
import Receipt from "@/components/Receipt";
import { Seat } from "@/types/reservation";
import { useToast } from "@/hooks/use-toast";

type AppState = "menu" | "new-reservation" | "delete-reservation" | "reservation-list" | "receipt";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("menu");
  const [seats, setSeats] = useState<Seat[]>([]);
  const [completedReservation, setCompletedReservation] = useState<Seat[]>([]);
  const { toast } = useToast();

  // Initialize seats on component mount
  useEffect(() => {
    const initializeSeats = () => {
      const rows = ['A', 'B', 'C', 'D', 'E'];
      const seatsPerRow = 18;
      const initialSeats: Seat[] = [];

      rows.forEach(row => {
        for (let i = 1; i <= seatsPerRow; i++) {
          const seatNumber = i.toString().padStart(2, '0');
          initialSeats.push({
            id: `${row}${seatNumber}`,
            row,
            number: i,
            isOccupied: false
          });
        }
      });

      setSeats(initialSeats);
    };

    initializeSeats();
  }, []);

  const handleNewReservation = () => {
    setCurrentState("new-reservation");
  };

  const handleDeleteReservation = () => {
    setCurrentState("delete-reservation");
  };

  const handleReservationList = () => {
    setCurrentState("reservation-list");
  };

  const handleReservationComplete = (selectedSeats: Seat[]) => {
    // Update the main seats array with the reserved seats
    setSeats(prevSeats => 
      prevSeats.map(seat => {
        const selectedSeat = selectedSeats.find(s => s.id === seat.id);
        if (selectedSeat) {
          return { ...selectedSeat, isOccupied: true };
        }
        return seat;
      })
    );

    setCompletedReservation(selectedSeats);
    setCurrentState("receipt");
    
    toast({
      title: "Reservación Completada!",
      description: `Se reservaron ${selectedSeats.length} asientos exitosamente.`,
    });
  };

  const handleDeleteSeatReservation = (seatId: string) => {
    setSeats(prevSeats => 
      prevSeats.map(seat => 
        seat.id === seatId 
          ? { ...seat, isOccupied: false, person: undefined }
          : seat
      )
    );

    toast({
      title: "Reservation Eliminada",
      description: `El asiento ${seatId} ahora está disponible.`,
    });
  };

  const handleBackToMenu = () => {
    setCurrentState("menu");
    setCompletedReservation([]);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  switch (currentState) {
    case "new-reservation":
      return (
        <NewReservation
          seats={seats}
          onBack={handleBackToMenu}
          onReservationComplete={handleReservationComplete}
        />
      );
    
    case "delete-reservation":
      return (
        <DeleteReservation
          seats={seats}
          onBack={handleBackToMenu}
          onDeleteReservation={handleDeleteSeatReservation}
        />
      );
    
    case "reservation-list":
      return (
        <ReservationList
          seats={seats}
          onBack={handleBackToMenu}
        />
      );
    
    case "receipt":
      return (
        <Receipt
          seats={completedReservation}
          onPrint={handlePrintReceipt}
          onBackToMenu={handleBackToMenu}
        />
      );
    
    default:
      return (
        <MainMenu
          onNewReservation={handleNewReservation}
          onDeleteReservation={handleDeleteReservation}
          onReservationList={handleReservationList}
        />
      );
  }
};

export default Index;