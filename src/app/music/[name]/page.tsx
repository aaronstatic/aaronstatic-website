import { Metadata, ResolvingMetadata } from 'next';
import { getReleaseByName } from '@/lib/mongodb';
import { use } from 'react';
import Link from 'next/link';
import { Review } from '@/lib/types/Release';

type Props = {
    params: { name: string };
};

export async function generateMetadata(
    { params }: Props,
    parent?: ResolvingMetadata,
): Promise<Metadata> {
    const release = await getReleaseByName(params.name);

    if (release === null) throw new Error(`Release not found: ${params.name}`);

    return {
        title: `${release.artists.map(artist => (artist.name)).join(", ")} - ${release.name}`,
    };
}

function msToMinutesSeconds(ms: number): string {
    const millisecondsInSecond = 1000;
    const secondsInMinute = 60;

    const msInMinute = millisecondsInSecond * secondsInMinute;

    const minutes = Math.floor(ms / msInMinute);
    ms %= msInMinute;

    const seconds = Math.floor(ms / millisecondsInSecond);

    const formattedMinutes = minutes.toString().padStart(1, '0');
    const formattedSeconds = seconds.toString().padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}


export default function Release({ params }: { params: { name: string } }) {
    const release = use(getReleaseByName(params.name));

    if (release === null) {
        return (
            <main className="">
                <h1>Release not found</h1>
            </main>
        )
    }

    return (
        <main className="">
            <h1 className="text-center display-6">{`${release.artists.map(artist => (artist.name)).join(", ")} - ${release.name}`}</h1>
            <div className="row justify-content-center">
                <div className="col-lg-3 col-md-5 col-12">
                    <div className="card mb-1">
                        <img src={release.images[0].url} className="card-img-top" alt={release.name} />
                    </div>
                </div>
                <div className="col-lg-9 col-md-6 col-12">
                    {release.description && release.description.map((paragraph: string, i: number) => (
                        <p key={i}><small>{paragraph}</small></p>
                    ))}
                    {release.reviews && (<h6>Reviews</h6>)}
                    {release.reviews && release.reviews.map((review: Review, i: number) => (

                        <figure key={i}>
                            <blockquote className="blockquote">
                                <p>{review.text}</p>
                            </blockquote>
                            <figcaption className="blockquote-footer">
                                {review.publisher}
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </div>
            <div className="row mt-2">
                <div className="col-lg-3 col-md-8 col-12">
                    <div className="card">
                        <div className="card-header">
                            Release Info
                        </div>
                        <div className="card-body">
                            <p className="card-text"><small><strong>Release Date:</strong> {new Date(release.release_date).toLocaleDateString()}</small></p>
                            <p className="card-text"><small><strong>Label:</strong> {release.label}</small></p>
                        </div>
                    </div>
                </div>
                <div className="row justify-content-center mt-2">
                    {release.external_urls.spotify && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={release.external_urls.spotify} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-spotify"></i> Listen on Spotify</button>
                            </Link>
                        </div>
                    )}


                    {release.external_urls.apple && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={release.external_urls.apple} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-apple"></i> Listen on Apple</button>
                            </Link>
                        </div>
                    )}
                    {release.external_urls.tidal && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={release.external_urls.tidal} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/tidal.svg" /> Listen on Tidal</button>
                            </Link>
                        </div>
                    )}
                    {release.external_urls.bandcamp && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={release.external_urls.bandcamp} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/bandcamp.svg" /> Buy on Bandcamp</button>
                            </Link>
                        </div>
                    )}
                    {release.external_urls.beatport && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={release.external_urls.beatport} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/beatport.svg" /> Buy on Beatport</button>
                            </Link>
                        </div>
                    )}
                </div>
                <div className="row justify-content-center mt-2">
                    <div className="col-lg-9 col-md-8 col-12">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th scope="col">#</th>
                                    <th scope="col">Artist/s</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Length</th>
                                </tr>
                            </thead>
                            <tbody>
                                {release.tracks.map((track, index) => (
                                    <tr key={index}>
                                        <th scope="row">{index + 1}</th>
                                        <td>{track.artists.map(artist => (artist.name)).join(", ")}</td>
                                        <td>{track.name}</td>
                                        <td>{msToMinutesSeconds(track.duration_ms)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {
                release.lyrics && (
                    <div className="row justify-content-center">
                        <div className="col-lg-4 col-md-8 col-12">
                            <h5>Lyrics</h5>
                            <p style={{ whiteSpace: "pre-wrap" }}>{release.lyrics}</p>
                        </div>
                    </div>
                )
            }
        </main >
    )
}