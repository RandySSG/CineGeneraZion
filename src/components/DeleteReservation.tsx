import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Trash2, User, Phone } from "lucide-react";
import SeatGrid from "./SeatGrid";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Seat } from "@/types/reservation";

interface DeleteReservationProps {
  seats: Seat[];
  onBack: () => void;
  onDeleteReservation: (seatId: string) => void;
}

const DeleteReservation = ({ seats, onBack, onDeleteReservation }: DeleteReservationProps) => {
  const [selectedSeat, setSelectedSeat] = useState<Seat | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSeatClick = (seat: Seat) => {
    if (seat.isOccupied && seat.person) {
      setSelectedSeat(seat);
      setIsModalOpen(true);
    }
  };

  const handleDelete = () => {
    if (selectedSeat) {
      onDeleteReservation(selectedSeat.id);
      setIsModalOpen(false);
      setSelectedSeat(null);
    }
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setSelectedSeat(null);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Button
            onClick={onBack}
            variant="ghost"
            size="sm"
            className="p-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-foreground">Eliminar Reservación</h1>
        </div>

        <Card className="p-6 mb-6 bg-card border-border">
          <p className="text-center text-muted-foreground mb-4">
            Haz clic en cualquier asiento ocupado (en rojo) para ver la reserva y cancelarla.
          </p>
        </Card>

        <SeatGrid
          seats={seats}
          onSeatClick={handleSeatClick}
          mode="delete"
        />

        <Dialog open={isModalOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md bg-card border-border">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                Eliminar Reservación - Asiento {selectedSeat?.id}
              </DialogTitle>
              <p className="text-sm text-muted-foreground">
                Aquí puede revisar y confirmar la eliminación de la reservación.
              </p>
            </DialogHeader>
            
            {selectedSeat?.person && (
              <div className="space-y-4 py-4">
                <div className="bg-secondary p-4 rounded-lg border border-border">
                  <h3 className="font-semibold text-foreground mb-3">Reservado para</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-foreground" />
                      <span className="text-foreground">{selectedSeat.person.name}</span>
                    </div>
                    {selectedSeat.person.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{selectedSeat.person.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="bg-destructive/10 border border-destructive/20 p-4 rounded-lg">
                  <p className="text-sm text-foreground">
                    <p>¿Está seguro de que desea eliminar esta reservación?</p>
                    <p>Esta acción no se puede deshacer.</p>
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2">
              <Button variant="secondary" onClick={handleClose}>
                Cancelar
              </Button>
              <Button 
                onClick={handleDelete}
                className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Eliminar Reservación
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default DeleteReservation;