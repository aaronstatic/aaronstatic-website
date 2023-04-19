import { MongoClient, WithId } from "mongodb";
import * as dotenv from "dotenv";
import Release from "./types/Release";
import { Content } from "./types/Content";
import Mix from "./types/Mix";
import Project from "./types/Project";
dotenv.config();

const URI = process.env.MONGODB_URI;
const options = {};

if (!URI) {
    throw new Error("No Mongo URI found, add it to your .env file");
}

let client = new MongoClient(URI, options);

let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise: Promise<MongoClient>
}
if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(URI)
    globalWithMongo._mongoClientPromise = client.connect()
}
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV !== "production") {
    if (!globalWithMongo._mongoClientPromise) {
        globalWithMongo._mongoClientPromise = client.connect();
    }

    clientPromise = globalWithMongo._mongoClientPromise;
} else {
    clientPromise = client.connect();
}

export default clientPromise

let db = client.db("aaronstatic");

const mapRelease = (doc: any): Release => ({
    id: doc.id,
    name: doc.name,
    release_date: doc.release_date,
    album_type: doc.album_type,
    images: doc.images,
    album_group: doc.album_group,
    external_urls: doc.external_urls,
    artists: doc.artists,
    tracks: doc.tracks.items,
    popularity: doc.popularity,
    genres: doc.genres,
    label: doc.label,
    description: doc.description,
    lyrics: doc.lyrics,
    reviews: doc.reviews
});

const mapMix = (doc: any): Mix => ({
    key: doc.key,
    name: doc.name,
    audio_length: doc.audio_length,
    pictures: doc.pictures,
    created_time: doc.created_time,
    tags: doc.tags,
    url: doc.url
});

const mapProject = (doc: any): Project => ({
    name: doc.name,
    paragraphs: doc.paragraphs,
    photo: doc.photo,
    external_urls: doc.external_urls
});

export const getReleases = async (limit: number): Promise<Release[]> => {
    let collection = db.collection("releases");

    const documents = await collection
        .find({})
        .sort({ release_date: -1 })
        .limit(limit)
        .toArray();

    const releases: Release[] = documents.map(mapRelease);

    return releases;
}

export const getAlbums = async (): Promise<Release[]> => {
    let collection = db.collection("releases");

    const documents = await collection
        .find({
            album_group: "album"
        })
        .sort({ release_date: -1 })
        .toArray();

    const releases: Release[] = documents.map(mapRelease);

    return releases;
}

export const getSingles = async (): Promise<Release[]> => {
    let collection = db.collection("releases");

    const documents = await collection
        .find({
            album_group: "single"
        })
        .sort({ release_date: -1 })
        .toArray();

    const releases: Release[] = documents.map(mapRelease);

    return releases;
}

export const getAppearsOn = async (): Promise<Release[]> => {
    let collection = db.collection("releases");

    const documents = await collection
        .find({
            album_group: "appears_on"
        })
        .sort({ release_date: -1 })
        .toArray();

    const releases: Release[] = documents.map(mapRelease);

    return releases;
}

export const getReleaseByName = async (name: string): Promise<Release | null> => {
    name = name.replace(/-/g, " ");
    name = name.replace(/%26/g, "&");
    name = name.replace(/%2C/g, ",");

    let collection = db.collection("releases");

    const document = await collection
        .findOne({
            name: name
        })

    if (!document) return null;

    return mapRelease(document);
}

export const getMixes = async (limit: number): Promise<Mix[]> => {
    let collection = db.collection("mixes");

    const documents = await collection
        .find({})
        .sort({ created_time: -1 })
        .limit(limit)
        .toArray();

    const mixes: Mix[] = documents.map(mapMix);

    return mixes;
}

export const getProjects = async (limit: number): Promise<Project[]> => {
    let collection = db.collection("projects");

    const documents = await collection
        .find({})
        .limit(limit)
        .toArray();

    const projects: Project[] = documents.map(mapProject);

    return projects;
}

export const getContent = async (key: string): Promise<Content> => {

    let collection = db.collection("content");

    const document = await collection
        .findOne({
            key: key
        })

    if (!document) return {
        paragraphs: [],
        photos: []
    };

    return {
        paragraphs: document.paragraphs,
        photos: document.photos
    };
}