export interface Person {
  name: string;
  email: string;
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