import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Users, Plus, Minus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SeatGrid from "./SeatGrid";
import SeatSelectionPanel from "./SeatSelectionPanel";
import PersonModal from "./PersonModal";
import { Seat, Person } from "@/types/reservation";
import { seatService } from "@/lib/seatService";

interface NewReservationProps {
  seats: Seat[];
  onBack: () => void;
  onReservationComplete: (selectedSeats: Seat[]) => void;
}

const NewReservation = ({ seats, onBack, onReservationComplete }: NewReservationProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"select-count" | "select-seats">("select-count");
  const [seatCount, setSeatCount] = useState(1);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [modalSeat, setModalSeat] = useState<Seat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSeatCountSubmit = () => {
    if (seatCount > 0 && seatCount <= 20) {
      setStep("select-seats");
    }
  };

  const handleSeatClick = (seat: Seat) => {
    // If seat is already selected, allow editing
    if (selectedSeats.some(s => s.id === seat.id)) {
      setModalSeat(seat);
      setIsModalOpen(true);
      return;
    }

    // If we haven't reached the limit, select the seat
    if (selectedSeats.length < seatCount) {
      setModalSeat(seat);
      setIsModalOpen(true);
    }
  };

  const handlePersonSave = (person: Person) => {
    if (modalSeat) {
      const updatedSeat = { ...modalSeat, person, isOccupied: false };
      
      // Update or add the seat
      const existingIndex = selectedSeats.findIndex(s => s.id === modalSeat.id);
      let newSelectedSeats;
      
      if (existingIndex >= 0) {
        newSelectedSeats = [...selectedSeats];
        newSelectedSeats[existingIndex] = updatedSeat;
      } else {
        newSelectedSeats = [...selectedSeats, updatedSeat];
      }
      
      setSelectedSeats(newSelectedSeats);
    }
  };

  const handleEditSeat = (seat: Seat) => {
    setModalSeat(seat);
    setIsModalOpen(true);
  };

  const handleReserve = async () => {
    try {
      // Verificar que todos los asientos tengan información de persona
      const invalidSeats = selectedSeats.filter(seat => !seat.person);
      if (invalidSeats.length > 0) return;

      await seatService.createReservation(
        selectedSeats.map(seat => ({
          seatId: seat.id,
          name: seat.person!.name,
          phone: seat.person!.phone
        }))
      );

      toast({
        title: "Reservación exitosa",
        description: "Los asientos han sido reservados correctamente.",
      });

      onReservationComplete(selectedSeats);
    } catch (error) {
      console.error('Error al crear la reservación:', error);
      toast({
        variant: "destructive",
        title: "Error al crear la reservación",
        description: "Por favor intenta nuevamente."
      });
    }
  };

  const handleCancel = () => {
    setSelectedSeats([]);
    setStep("select-count");
    setSeatCount(1);
  };

  if (step === "select-count") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-8 bg-card border-border">
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={onBack}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">Nueva Reservación</h1>
          </div>

          <div className="space-y-6">
            <div className="text-center">
              <Users className="h-16 w-16 mx-auto mb-4 text-primary" />
              <h2 className="text-xl font-semibold text-foreground mb-2">
                ¿Cuántos asientos necesitas?
              </h2>
              <p className="text-muted-foreground">
                Selecciona el número de personas
              </p>
            </div>

            <div className="space-y-3">
              {/*
              <Label htmlFor="seat-count" className="text-foreground text-center block">
                Número de asientos (1-20)
              </Label>
              */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setSeatCount(Math.max(1, seatCount - 1))}
                  disabled={seatCount <= 1}
                >
                  <Minus className="h-6 w-6" />
                </Button>
                <div className="text-4xl font-bold text-primary w-16 text-center">
                  {seatCount}
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  className="h-12 w-12 rounded-full"
                  onClick={() => setSeatCount(Math.min(20, seatCount + 1))}
                  disabled={seatCount >= 20}
                >
                  <Plus className="h-6 w-6" />
                </Button>
              </div>
            </div>

            <Button
              onClick={handleSeatCountSubmit}
              disabled={seatCount < 1 || seatCount > 20}
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground"
            >
              Seleccionar asientos
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="flex gap-6 max-w-7xl mx-auto">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-6">
            <Button
              onClick={() => setStep("select-count")}
              variant="ghost"
              size="sm"
              className="p-2"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-foreground">
              Selecciona {seatCount} Asientos
            </h1>
          </div>

          <SeatGrid
            seats={seats}
            onSeatClick={handleSeatClick}
            mode="select"
            selectedSeats={selectedSeats}
          />
        </div>

        <SeatSelectionPanel
          totalSeats={seatCount}
          selectedSeats={selectedSeats}
          onEditSeat={handleEditSeat}
          onReserve={handleReserve}
          onCancel={handleCancel}
        />
      </div>

      <PersonModal
        isOpen={isModalOpen}
        seat={modalSeat}
        onClose={() => {
          setIsModalOpen(false);
          setModalSeat(null);
        }}
        onSave={handlePersonSave}
        mode={selectedSeats.some(s => s.id === modalSeat?.id) ? "edit" : "add"}
      />
    </div>
  );
};

export default NewReservation;