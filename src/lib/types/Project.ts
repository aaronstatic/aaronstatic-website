interface URLS {
    github: string;
    vcvrack: string;
    steam: string;
}

export default interface Project {
    name: string;
    paragraphs: string[];
    photo: string;
    external_urls: URLS;
}