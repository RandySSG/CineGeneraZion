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
  person_name: string;
  person_phone?: string;
  created_at: string;
}

export const seatService = {
  async getAllSeats() {
    const { data, error } = await supabase
      .from('seats')
      .select('*')
      .order('row')
      .order('number');
    
    if (error) throw error;
    return data;
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

  async reserveSeats(reservations: { seat_id: string; person_name: string; person_phone?: string }[]) {
    // Start a transaction
    const { error: seatsError } = await supabase
      .from('seats')
      .update({ is_occupied: true })
      .in('id', reservations.map(r => r.seat_id));

    if (seatsError) throw seatsError;

    const { error: reservationsError } = await supabase
      .from('reservations')
      .insert(reservations);

    if (reservationsError) throw reservationsError;
  },

  async deleteReservation(seatId: string) {
    // Start a transaction
    const { error: seatsError } = await supabase
      .from('seats')
      .update({ is_occupied: false })
      .eq('id', seatId);

    if (seatsError) throw seatsError;

    const { error: reservationsError } = await supabase
      .from('reservations')
      .delete()
      .eq('seat_id', seatId);

    if (reservationsError) throw reservationsError;
  },

  async getAllReservations() {
    const { data, error } = await supabase
      .from('reservations')
      .select(`
        *,
        seat:seats(*)
      `)
      .order('created_at');
    
    if (error) throw error;
    return data;
  }
};