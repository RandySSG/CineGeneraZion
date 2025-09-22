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

interface GroupedReservation {
  customerName: string;
  customerPhone?: string;
  seats: string[];
  createdAt: string;
  ids: string[];
}

const formatDate = (date: Date) => {
  const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const diaSemana = diasSemana[date.getDay()];
  const hora = date.toLocaleTimeString('es-US', { 
    hour: '2-digit', 
    minute: '2-digit', 
    second: '2-digit',
    hour12: true 
  });

  return `${year}-${month}-${day}, ${diaSemana} a las ${hora}`;
};

const ReservationList = ({ onBack }: ReservationListProps) => {
  const [groupedReservations, setGroupedReservations] = useState<GroupedReservation[]>([]);

  useEffect(() => {
    loadReservations();
  }, []);

  const loadReservations = async () => {
    try {
      const data = await seatService.getAllReservations();
      
      // Agrupar reservaciones por nombre y teléfono
      const groupedData = data.reduce((acc, curr) => {
        const key = `${curr.customer_name}-${curr.customer_phone || ''}`;
        if (!acc[key]) {
          acc[key] = {
            customerName: curr.customer_name,
            customerPhone: curr.customer_phone,
            seats: [curr.seat_id],
            createdAt: curr.created_at,
            ids: [curr.id]
          };
        } else {
          acc[key].seats.push(curr.seat_id);
          acc[key].ids.push(curr.id);
        }
        return acc;
      }, {} as Record<string, GroupedReservation>);

      setGroupedReservations(Object.values(groupedData));
    } catch (error) {
      console.error('Error al cargar las reservaciones:', error);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    const csvContent = [
      ['Cliente', 'Teléfono', 'Asientos', 'Fecha'],
      ...groupedReservations.map(reservation => [
        reservation.customerName,
        reservation.customerPhone || '',
        reservation.seats.join(', '),
        new Date(reservation.createdAt).toLocaleDateString()
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

  const handleDeleteReservation = async (ids: string[]) => {
    try {
      await seatService.deleteReservation(ids);
      loadReservations(); // Recargar la lista
    } catch (error) {
      console.error('Error al eliminar la reservación:', error);
    }
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
              Total: <span className="font-semibold text-foreground">{groupedReservations.length}</span>
            </p>
          </div>

          <Separator className="mb-6" />

          {groupedReservations.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-muted-foreground">No se encontraron reservaciones</p>
              <p className="text-sm text-muted-foreground mt-2">Todos los asientos están disponibles</p>
            </div>
          ) : (
            <div className="space-y-3">
              {groupedReservations.map((reservation) => (
                <div
                  key={`${reservation.customerName}-${reservation.seats.join(',')}`}
                  className="flex items-center justify-between p-4 bg-secondary rounded-lg border border-border hover:bg-secondary/80 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-seat-occupied rounded-lg flex items-center justify-center font-bold text-primary-foreground">
                      {reservation.seats[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <User className="h-4 w-4 text-foreground" />
                        <span className="font-semibold text-foreground text-lg">{reservation.customerName}</span>
                      </div>
                      {reservation.customerPhone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4 text-muted-foreground" />
                          <span className="text-muted-foreground">{reservation.customerPhone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm text-muted-foreground">
                        Asientos: {reservation.seats.join(', ')}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        {formatDate(new Date(reservation.createdAt))}
                      </div>
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteReservation(reservation.ids)}
                    >
                      Eliminar
                    </Button>
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