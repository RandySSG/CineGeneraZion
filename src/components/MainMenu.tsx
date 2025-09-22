import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Film, Trash2, List } from "lucide-react";

interface MainMenuProps {
  onNewReservation: () => void;
  onDeleteReservation: () => void;
  onReservationList: () => void;
}

const MainMenu = ({ onNewReservation, onDeleteReservation, onReservationList }: MainMenuProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 text-center bg-gradient-to-br from-card to-secondary border-border">
        <div className="mb-8">
          <Film className="h-16 w-16 mx-auto mb-4 text-primary" />
          <h1 className="text-3xl font-bold text-foreground mb-2">RADICAL</h1>
          <p className="text-muted-foreground">Cine GeneraZion</p>
        </div>
        
        <div className="space-y-4">
          <Button 
            onClick={onNewReservation}
            className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Film className="mr-2 h-5 w-5" />
            Nueva Reservación
          </Button>
          
          <Button 
            onClick={onDeleteReservation}
            variant="secondary"
            className="w-full h-12 text-lg font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <Trash2 className="mr-2 h-5 w-5" />
            Eliminar Reservación
          </Button>
          
          <Button 
            onClick={onReservationList}
            variant="secondary"
            className="w-full h-12 text-lg font-semibold bg-secondary hover:bg-secondary/80 text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <List className="mr-2 h-5 w-5" />
            Lista
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default MainMenu;