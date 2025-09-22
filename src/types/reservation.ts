export interface Person {
  name: string;
  phone?: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  isOccupied: boolean;
  person?: Person;
}

export interface Reservation {
  seats: Seat[];
  date: Date;
}