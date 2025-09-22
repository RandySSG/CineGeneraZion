import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import MainMenu from "@/components/MainMenu";
import NewReservation from "@/components/NewReservation";
import DeleteReservation from "@/components/DeleteReservation";
import ReservationList from "@/components/ReservationList";
import Receipt from "@/components/Receipt";
import { Seat } from "@/types/reservation";
import { useToast } from "@/hooks/use-toast";
import { seatService } from "@/lib/seatService";

type AppState = "menu" | "new-reservation" | "delete-reservation" | "reservation-list" | "receipt";

const Index = () => {
  const [currentState, setCurrentState] = useState<AppState>("menu");
  const [completedReservation, setCompletedReservation] = useState<Seat[]>([]);
  const { toast } = useToast();

  const { data: seats = [], refetch: refetchSeats } = useQuery({
    queryKey: ['seats'],
    queryFn: async () => {
      const dbSeats = await seatService.getAllSeats();
      return dbSeats.map(dbSeat => ({
        id: dbSeat.id,
        row: dbSeat.row,
        number: dbSeat.number,
        isOccupied: dbSeat.is_occupied,
        person: dbSeat.person
      }));
    }
  });

  const handleNewReservation = () => {
    setCurrentState("new-reservation");
  };

  const handleDeleteReservation = () => {
    setCurrentState("delete-reservation");
  };

  const handleReservationList = () => {
    setCurrentState("reservation-list");
  };

  const handleReservationComplete = async (selectedSeats: Seat[]) => {
    // La reserva ya se creó en la base de datos, solo necesitamos actualizar la UI
    await refetchSeats(); // Actualizamos los asientos desde la base de datos

    setCompletedReservation(selectedSeats);
    setCurrentState("receipt");
    
    toast({
      title: "Reservación Completada!",
      description: `Se reservaron ${selectedSeats.length} asientos exitosamente.`,
    });
  };

  const handleDeleteSeatReservation = async (seatId: string) => {
    try {
      await seatService.deleteReservation([seatId], false);  // false indica que es ID de asiento
      await refetchSeats(); // Actualizamos los asientos desde la base de datos

      toast({
        title: "Reservación Eliminada",
        description: `El asiento ${seatId} ahora está disponible.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar la reservación.",
        variant: "destructive"
      });
    }
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