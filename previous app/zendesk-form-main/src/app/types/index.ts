// NOTE: If number of lines crosses 300-500, refactor the file into multiple files

export interface User {
  id: string;
  name: string;
  email: string;
  initial?: string;
  photoUrl?: string;
  role?: string;
}

export interface TicketCreator {
  id: string;
  name: string;
  email: string;
  coPartnerName: string | null;
  coPartnerEmail: string | null;
}

export interface Enterprise {
  id: string;
  name: string;
}

export interface DropdownOption {
  id: string;
  name: string;
}
