import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Seat, Person } from "@/types/reservation";

interface PersonModalProps {
  isOpen: boolean;
  seat: Seat | null;
  onClose: () => void;
  onSave: (person: Person) => void;
  mode: "add" | "edit";
}

const PersonModal = ({ isOpen, seat, onClose, onSave, mode }: PersonModalProps) => {
  const [name, setName] = useState(seat?.person?.name || "");
  const [phone, setPhone] = useState(seat?.person?.phone || "");

  const handleSave = () => {
    if (name.trim()) {
      onSave({
        name: name.trim(),
        phone: phone.trim() || undefined
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName("");
    setPhone("");
    onClose();
  };

  if (!seat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[90vw] max-w-md bg-card border-border p-4 sm:p-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg sm:text-xl text-foreground text-center">
            {mode === "add" ? "Reservar" : "Editar"} Asiento {seat.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm sm:text-base text-foreground">
              Nombre *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              autoComplete="off"
              className="bg-input border-border text-foreground h-10 sm:h-12 text-sm sm:text-base"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm sm:text-base text-foreground">
              Teléfono (Opcional)
            </Label>
            <Input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder=""
              autoComplete="off"
              className="bg-input border-border text-foreground h-10 sm:h-12 text-sm sm:text-base"
            />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3">
          <Button 
            variant="secondary" 
            onClick={handleClose}
            className="w-full sm:w-auto h-10 sm:h-12 text-sm sm:text-base"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim()}
            className="w-full sm:w-auto h-10 sm:h-12 text-sm sm:text-base bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {mode === "add" ? "Reservar" : "Actualizar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonModal;