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
  seats: string[];
  customer_name: string;
  customer_email: string;
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

  async createReservation(seats: string[], customerName: string, customerEmail: string) {
    // Start a transaction
    const { error: seatsError } = await supabase
      .from('seats')
      .update({ is_occupied: true })
      .in('id', seats);

    if (seatsError) throw seatsError;

    const { error: reservationsError } = await supabase
      .from('reservations')
      .insert({
        seats,
        customer_name: customerName,
        customer_email: customerEmail
      });

    if (reservationsError) {
      // Rollback seats update if reservation fails
      await supabase
        .from('seats')
        .update({ is_occupied: false })
        .in('id', seats);
      throw reservationsError;
    }
  },

  async deleteReservation(reservationId: string) {
    // First get the seats from the reservation
    const { data: reservation, error: getError } = await supabase
      .from('reservations')
      .select('seats')
      .eq('id', reservationId)
      .single();

    if (getError) throw getError;

    // Update seats to be unoccupied
    const { error: seatsError } = await supabase
      .from('seats')
      .update({ is_occupied: false })
      .in('id', reservation.seats);

    if (seatsError) throw seatsError;

    // Delete the reservation
    const { error: deleteError } = await supabase
      .from('reservations')
      .delete()
      .eq('id', reservationId);

    if (deleteError) throw deleteError;
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