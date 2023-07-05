export interface FilmI {
  id?: number;
  naziv?: string;
  orginalni_naziv?: string;
  opis?: string;
  datum_unosa?: string;
  popularnost?: number;
  datum_izdanja?: string;
  prihod?: number;
  'budžet'?: number;
  trajanje?: number;
  status?: string;
  za_odrasle?: number;
  poster?: string;
  'početna_stranica'?: string;
  pozadinska_slika?: string;
  imdb_id?: string;
  'prosječna_ocjena'?: number;
  broj_ocjena?: number;
  orginalni_jezik?: string;
  video?: number;
  slogan?: string;
  odobren?: number;
  korisnik_id?: number;
  zanr?: string;
  brojStranica?: string;
}


export interface FilmoviTMDBI {
    page: number;
    results: FilmTMDBI[];
    total_pages: number;
    total_results: number;
  }
  
export interface FilmTMDBI {
    adult: boolean;
    backdrop_path?: string;
    genre_ids: number[];
    id: number;
    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string;
    release_date: string;
    title: string;
    video: boolean;
    vote_average: number;
    vote_count: number;
  }
