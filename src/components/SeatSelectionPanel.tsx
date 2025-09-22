import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Seat } from "@/types/reservation";
import { Edit, User, Phone } from "lucide-react";

interface SeatSelectionPanelProps {
  totalSeats: number;
  selectedSeats: Seat[];
  onEditSeat: (seat: Seat) => void;
  onReserve: () => void;
  onCancel: () => void;
}

const SeatSelectionPanel = ({
  totalSeats,
  selectedSeats,
  onEditSeat,
  onReserve,
  onCancel
}: SeatSelectionPanelProps) => {
  const remainingSeats = totalSeats - selectedSeats.length;
  const canReserve = selectedSeats.length === totalSeats && selectedSeats.every(seat => seat.person);

  return (
    <Card className="lg:w-80 w-full p-4 sm:p-6 bg-card border-border lg:sticky lg:top-4 mt-4 lg:mt-0">
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-2">Resumen de Reservación</h3>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Asientos Totales:</span>
            <span className="font-semibold text-foreground">{totalSeats}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Seleccionados:</span>
            <span className="font-semibold text-foreground">{selectedSeats.length}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Restantes:</span>
            <span className="font-semibold text-primary">{remainingSeats}</span>
          </div>
        </div>

        <Separator />

        <div className="space-y-3 max-h-64 overflow-y-auto">
          <h4 className="font-medium text-foreground">Asientos Seleccionados</h4>
          {selectedSeats.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Aún no se han seleccionado asientos
            </p>
          ) : (
            selectedSeats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-3 bg-secondary rounded-lg border border-border"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-foreground">{seat.id}</span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEditSeat(seat)}
                      className="h-6 w-6 p-0 hover:bg-accent"
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                  </div>
                  {seat.person ? (
                    <div className="text-xs space-y-1">
                      <div className="flex items-center gap-1 text-foreground">
                        <User className="h-3 w-3" />
                        <span>{seat.person.name}</span>
                      </div>
                      {seat.person.phone && (
                        <div className="flex items-center gap-1 text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          <span>{seat.person.phone}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-xs text-muted-foreground">
                      Click para agregar info de la persona
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <Separator />

        <div className="space-y-2">
          <Button
            onClick={onReserve}
            disabled={!canReserve}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Completar Reservación
          </Button>
          <Button
            onClick={onCancel}
            variant="secondary"
            className="w-full"
          >
            Cancelar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SeatSelectionPanel;