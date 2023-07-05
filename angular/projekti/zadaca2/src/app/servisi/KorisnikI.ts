export interface KorisnikI {
    id: number;
    korime: string;
    lozinka: string;
    email: string;
    ime?: string;
    prezime?: string;
    TOTP_kljuc: string;
    aktivacijski_kljuc: number;
    tip_korisnika_id: number;
  }
