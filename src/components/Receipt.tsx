import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Seat } from "@/types/reservation";
import { Printer, Home, User, Phone, Calendar } from "lucide-react";

interface ReceiptProps {
  seats: Seat[];
  onPrint: () => void;
  onBackToMenu: () => void;
}

const Receipt = ({ seats, onPrint, onBackToMenu }: ReceiptProps) => {
  const date = new Date();
  const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const currentDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}, ${days[date.getDay()]}`;
  const currentTime = date.toLocaleTimeString();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl p-8 bg-card border-border">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-foreground mb-2">Cine GeneraZion</h1>
          <span>Película: Radical</span>
          <Separator className="mb-6" />

          <div className="flex justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              <span>{currentDate} a las {currentTime}</span>
            </div>
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="space-y-4 mb-6">
          <h2 className="text-lg font-semibold text-foreground">Asientos Reservados</h2>
          <div className="grid gap-3">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-seat-selected rounded-lg flex items-center justify-center font-bold text-foreground">
                    {seat.id}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <User className="h-4 w-4 text-foreground" />
                      <span className="font-semibold text-foreground">{seat.person?.name}</span>
                    </div>
                    {seat.person?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground text-sm">{seat.person.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator className="mb-6" />

        <div className="text-center space-y-2 mb-6">
          <div className="text-sm text-muted-foreground">
            <p>Asientos Totales Reservados: <span className="font-semibold text-foreground">{seats.length}</span></p>
            <p>Código de Reservación: <span className="font-semibold text-foreground">#{Date.now().toString().slice(-6)}</span></p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Button
            onClick={onPrint}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            <Printer className="mr-2 h-4 w-4" />
            Imprimir Comprobante
          </Button>
          <Button
            onClick={onBackToMenu}
            variant="secondary"
            className="font-semibold"
          >
            <Home className="mr-2 h-4 w-4" />
            Volver al Menú
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Receipt;