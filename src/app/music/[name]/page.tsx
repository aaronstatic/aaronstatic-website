import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getReleaseByName } from '@/lib/mongodb';
import { Review } from '@/lib/types/Release';

// Helper function to convert milliseconds to minutes:seconds format
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

// Generate metadata for better SEO
export async function generateMetadata({ params }: { params: { name: string } }) {
    const slug = (await params).name;
    let possibleNames = [
        slug,
        slug.replace(/-/g, ' '),
        slug.replace(/-/g, ' ').replace(/ and /gi, ' & ')
    ];
    
    // Special case handling
    if (slug.toLowerCase().includes('remix') && slug.toLowerCase().includes('production')) {
        possibleNames.push('Remix & Additional Production');
    }
    
    // Try to find the release
    let release = null;
    for (const name of possibleNames) {
        const result = await getReleaseByName(name);
        if (result) {
            release = result;
            break;
        }
    }
    
    if (!release) {
        return {
            title: 'Release Not Found - Aaron Static',
        };
    }
    
    // Extract artist names
    const artistNames = release.artists && Array.isArray(release.artists)
        ? release.artists
            .map((artist: any) => artist && typeof artist.name === 'string' ? artist.name : '')
            .filter((name: string) => name)
            .join(", ")
        : '';
            
    const releaseName = release.name && typeof release.name === 'string' ? release.name : '';
    const pageTitle = artistNames ? `${artistNames} - ${releaseName}` : releaseName;
    
    return {
        title: `${pageTitle} - Aaron Static`,
        description: release.description?.[0] || 'Music by Aaron Static',
        openGraph: {
            title: `${pageTitle} - Aaron Static`,
            description: release.description?.[0] || 'Music by Aaron Static',
            images: release.images?.[0]?.url ? [{ url: release.images[0].url }] : [],
        },
    };
}

export default async function Release({ params }: { params: { name: string } }) {
    const slug = (await params).name;
    let possibleNames = [
        slug,
        slug.replace(/-/g, ' '),
        slug.replace(/-/g, ' ').replace(/ and /gi, ' & ')
    ];
    
    // Special case handling
    if (slug.toLowerCase().includes('remix') && slug.toLowerCase().includes('production')) {
        possibleNames.push('Remix & Additional Production');
    }
    
    // Try to find the release
    let release = null;
    for (const name of possibleNames) {
        const result = await getReleaseByName(name);
        if (result) {
            release = result;
            break;
        }
    }
    
    if (!release) {
        notFound(); // This will show the 404 page
    }
    
    // Extract data safely from release
    // Prepare data safely to avoid serialization issues
    const artistNames = release.artists && Array.isArray(release.artists)
        ? release.artists
            .map((artist: any) => artist && typeof artist.name === 'string' ? artist.name : '')
            .filter((name: string) => name)
            .join(", ")
        : '';
        
    const releaseName = release.name && typeof release.name === 'string' ? release.name : '';
    const releaseTitle = `${artistNames} - ${releaseName}`;
    
    const images = release.images && Array.isArray(release.images) && release.images.length > 0
        ? release.images
        : [{ url: '' }];
        
    const description = release.description && Array.isArray(release.description)
        ? release.description
        : [];
        
    const reviews = release.reviews && Array.isArray(release.reviews)
        ? release.reviews
        : [];
        
    const tracks = release.tracks && Array.isArray(release.tracks)
        ? release.tracks
        : [];
        
    const externalUrls = release.external_urls || {};

    return (
        <main className="">
            <h1 className="text-center display-6">{releaseTitle}</h1>
            <div className="row justify-content-center">
                <div className="col-lg-3 col-md-7 col-12">
                    <div className="card mb-1">
                        <img src={images[0].url} className="card-img-top" alt={releaseName} />
                    </div>
                </div>
                <div className="col-lg-9 col-md-6 col-12">
                    {description.map((paragraph: string, i: number) => (
                        <p key={i}><small>{paragraph}</small></p>
                    ))}
                    {reviews.length > 0 && (<h6>Reviews</h6>)}
                    {reviews.map((review: Review, i: number) => (
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
            <div className="row mt-2 justify-content-center">
                <div className="row justify-content-center mt-2">
                    {externalUrls.spotify && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={externalUrls.spotify} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-spotify"></i> Listen on Spotify</button>
                            </Link>
                        </div>
                    )}

                    {externalUrls.apple && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={externalUrls.apple} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-apple"></i> Listen on Apple</button>
                            </Link>
                        </div>
                    )}
                    {externalUrls.tidal && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={externalUrls.tidal} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/tidal.svg" /> Listen on Tidal</button>
                            </Link>
                        </div>
                    )}
                    {externalUrls.bandcamp && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={externalUrls.bandcamp} target="_new">
                                <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/bandcamp.svg" /> Buy on Bandcamp</button>
                            </Link>
                        </div>
                    )}
                    {externalUrls.beatport && (
                        <div className="col-lg-2 col-md-8 col-12 text-center">
                            <Link href={externalUrls.beatport} target="_new">
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
                                {tracks.map((track: any, index: number) => {
                                    const trackArtists = track.artists && Array.isArray(track.artists)
                                        ? track.artists
                                            .map((artist: any) => artist && typeof artist.name === 'string' ? artist.name : '')
                                            .filter((name: string) => name)
                                            .join(", ")
                                        : '';
                                    
                                    const trackName = track.name && typeof track.name === 'string' ? track.name : '';
                                    const trackDuration = typeof track.duration_ms === 'number' ? track.duration_ms : 0;
                                    
                                    return (
                                        <tr key={index}>
                                            <th scope="row">{index + 1}</th>
                                            <td>{trackArtists}</td>
                                            <td>{trackName}</td>
                                            <td>{msToMinutesSeconds(trackDuration)}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {release.lyrics && (
                <div className="row justify-content-center">
                    <div className="col-lg-4 col-md-8 col-12">
                        <h5>Lyrics</h5>
                        <p style={{ whiteSpace: "pre-wrap" }}>{release.lyrics}</p>
                    </div>
                </div>
            )}
        </main>
    );
}