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
  const [email, setEmail] = useState(seat?.person?.email || "");

  const handleSave = () => {
    if (name.trim() && email.trim()) {
      onSave({
        name: name.trim(),
        email: email.trim()
      });
      handleClose();
    }
  };

  const handleClose = () => {
    setName("");
    setEmail("");
    onClose();
  };

  if (!seat) return null;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {mode === "add" ? "Reservar" : "Editar"} Asiento {seat.id}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-foreground">
              Nombre *
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder=""
              autoComplete="off"
              className="bg-input border-border text-foreground"
              autoFocus
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-foreground">
              Correo electrónico *
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="ejemplo@correo.com"
              autoComplete="email"
              className="bg-input border-border text-foreground"
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!name.trim() || !email.trim() || !email.includes('@')}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {mode === "add" ? "Reservar" : "Actualizar"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PersonModal;