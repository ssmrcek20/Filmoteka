export interface ZanroviI {
    id: number;
    naziv: string;
    filmovi: FilmoviI[];
}

interface FilmoviI {
    id: number;
    naziv: string;
    orginalni_naziv: string;
    opis: string;
    datum_unosa: string;
    popularnost: number;
    datum_izdanja: string;
    prihod: number;
    'budžet': number;
    trajanje: number;
    status: string;
    za_odrasle: number;
    poster: string;
    'početna_stranica': string;
    pozadinska_slika: string;
    imdb_id: string;
    'prosječna_ocjena': number;
    broj_ocjena: number;
    orginalni_jezik: string;
    video: number;
    slogan: string;
    odobren: number;
    korisnik_id: number;
    zanr: string;
  }
