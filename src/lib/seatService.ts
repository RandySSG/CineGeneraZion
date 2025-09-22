import { supabase } from '@/lib/supabase';

export interface DBSeat {
  id: string;
  row: string;
  number: number;
  is_occupied: boolean;
  created_at: string;
}

export interface DBReservation {
  id: string;
  seat_id: string;
  customer_name: string;
  customer_phone?: string;
  created_at: string;
}

export const seatService = {
  async getAllSeats() {
    const { data: reservations, error: reservationsError } = await supabase
      .from('reservations')
      .select('seat_id, customer_name, customer_phone')
      .order('created_at', { ascending: false });
    
    if (reservationsError) throw reservationsError;

    const occupiedSeatsWithPeople = new Map(reservations?.map(r => [
      r.seat_id,
      { name: r.customer_name, phone: r.customer_phone }
    ]) || []);
    
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 18;
    const seats: (DBSeat & { person?: { name: string; phone?: string } })[] = [];

    for (const row of rows) {
      for (let number = 1; number <= seatsPerRow; number++) {
        const seatId = `${row}${number.toString().padStart(2, '0')}`;
        const person = occupiedSeatsWithPeople.get(seatId);
        seats.push({
          id: seatId,
          row,
          number,
          is_occupied: occupiedSeatsWithPeople.has(seatId),
          created_at: new Date().toISOString(),
          ...(person ? { person } : {})
        });
      }
    }
    
    return seats;
  },

  async createInitialSeats() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
    const seatsPerRow = 18;
    const seats = [];

    for (const row of rows) {
      for (let number = 1; number <= seatsPerRow; number++) {
        seats.push({
          row,
          number,
          is_occupied: false
        });
      }
    }

    const { error } = await supabase
      .from('seats')
      .insert(seats);
    
    if (error) throw error;
  },

  async createReservation(reservations: { seatId: string, name: string, phone?: string }[]) {
    console.log('Creando reservaciones:', reservations);
    
    // Create a reservation for each seat
    const dbReservations = reservations.map(r => ({
      seat_id: r.seatId,
      customer_name: r.name,
      customer_phone: r.phone
    }));

    console.log('Reservaciones a crear:', dbReservations);

    const { data, error: reservationsError } = await supabase
      .from('reservations')
      .insert(dbReservations)
      .select();

    if (reservationsError) {
      console.error('Error al crear reservaciones:', reservationsError);
      throw reservationsError;
    }

    console.log('Reservaciones creadas:', data);
  },

  async deleteReservation(ids: string[], useReservationId: boolean = false) {
    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .in(useReservationId ? 'id' : 'seat_id', ids);

    if (deleteError) {
      console.error('Error al eliminar reservaciones:', deleteError);
      throw deleteError;
    }
  },

  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
};