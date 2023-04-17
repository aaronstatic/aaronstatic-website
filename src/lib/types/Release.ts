export interface Image {
    url: string;
}

export interface URL {
    spotify: string;
    bandcamp: string;
    youtube: string;
    apple: string;
    soundcloud: string;
    tidal: string;
    deezer: string;
    amazon: string;
    beatport: string;
}

export interface Track {
    id: string;
    name: string;
    duration_ms: number;
    external_urls: URL;
    artists: Artist[];
}

export interface Artist {
    id: string;
    name: string;
    external_urls: URL;
}

export interface Review {
    text: string;
    publisher: string;
}

export default interface Release {
    id: string;
    name: string;
    images: Image[];
    external_urls: URL;
    album_type: string;
    album_group: string;
    popularity: number;
    release_date: string;
    genres: string[];
    tracks: Track[];
    label: string;
    artists: Artist[];
    description: string[];
    lyrics: string;
    reviews: Review[];
}