interface Pictures {
    small: string;
    medium: string;
    large: string;
}

interface Tag {
    key: string;
    name: string;
    url: string;
}

export default interface Mix {
    key: string;
    name: string;
    audio_length: number;
    pictures: Pictures;
    created_time: string;
    tags: Tag[];
    url: string;
}