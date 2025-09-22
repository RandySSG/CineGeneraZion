import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DBReservation } from "@/lib/seatService";
import { ArrowLeft, User, Phone, Printer, Download } from "lucide-react";
import { seatService } from "@/lib/seatService";

interface ReservationListProps {
  onBack: () => void;
}

const ReservationList = ({ onBack }: ReservationListProps) => {
  const [reservations, setReservations] = useState<DBReservation[]>([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await seatService.getAllReservations();
      setReservations(data);
    } catch (error) {
      console.error('Error al cargar las reservaciones:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ['ID', 'Cliente', 'Teléfono', 'Asientos', 'Fecha'],
      ...reservations.map(reservation => [
        reservation.id,
        reservation.customer_name,
        reservation.customer_phone || '',
        reservation.seats.join(', '),
        new Date(reservation.created_at).toLocaleDateString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cinema-reservations-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <Button
            onClick={onBack}
            variant="secondary"
            className="font-semibold"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al menú
          </Button>
          
          <div className="flex gap-2">
            <Button
              onClick={handlePrint}
              variant="secondary"
              className="font-semibold"
            >
              <Printer className="mr-2 h-4 w-4" />
              Imprimir
            </Button>
            <Button
              onClick={handleDownload}
              variant="secondary"
              className="font-semibold"
            >
              <Download className="mr-2 h-4 w-4" />
              Descargar CSV
            </Button>
          </div>
        </div>

        <Card className="p-6 bg-card border-border">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Reservaciones</h1>
            <p className="text-muted-foreground">
              Total: <span className="font-semibold text-foreground">{reservations.length}</span>
            </p>
          </div>

          <Separator className="mb-6" />

          {reservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No se encontraron reservaciones</p>
              <p className="text-sm text-muted-foreground mt-2">Todos los asientos están disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reservations.map((reservation) => (
                <div
                  key={reservation.id}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-seat-occupied rounded-lg flex items-center justify-center font-bold text-primary-foreground">
                      {reservation.seats.length}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-foreground" />
                        <span className="font-semibold text-foreground text-lg">{reservation.customer_name}</span>
                      </div>
                      {reservation.customer_phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{reservation.customer_phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">
                      Asientos: {reservation.seats.join(', ')}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {new Date(reservation.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ReservationList;