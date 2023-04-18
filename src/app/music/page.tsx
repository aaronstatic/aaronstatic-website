import ReleaseCard from '@/components/ReleaseCard';
import { getAlbums, getSingles, getContent, getAppearsOn } from '@/lib/mongodb';
import { Content } from '@/lib/types/Content';
import Release from '@/lib/types/Release';
import { use } from 'react';

export const metadata = {
    title: 'Aaron Static - Music'
}

export default function Music() {
    const releases: Release[] = use(getAlbums());
    const singles: Release[] = use(getSingles());
    const appears: Release[] = use(getAppearsOn());
    const intro: Content = use(getContent("music"));
    return (
        <main className="">
            <h1 className="text-center p-2 mt-4 display-6">Music</h1>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-12 text-center text-small">
                    {intro && intro.paragraphs.map((paragraph: string, i: number) => (
                        <p key={i}><small>{paragraph}</small></p>
                    ))}
                </div>
            </div>
            <h1 className="text-center p-2 display-6">Albums</h1>
            <div className="row gy-2 gx-2 d-flex justify-content-center">
                {releases.map((release) => (
                    <div key={release.id} className="col-lg-2 col-md-4 col-6">
                        <ReleaseCard key={release.id} release={release} />
                    </div>
                ))}

            </div>
            <h1 className="text-center p-2 mt-4 display-6">Singles</h1>
            <div className="row gy-2 gx-2 d-flex justify-content-center">
                {singles.map((release) => (
                    <div key={release.id} className="col-lg-2 col-md-4 col-6">
                        <ReleaseCard key={release.id} release={release} />
                    </div>
                ))}
            </div>
            <h1 className="text-center p-2 mt-4 display-6">Appears On</h1>
            <div className="row gy-2 gx-2 d-flex justify-content-center">
                {appears.map((release) => (
                    <div key={release.id} className="col-lg-2 col-md-4 col-6">
                        <ReleaseCard key={release.id} release={release} />
                    </div>
                ))}
            </div>
        </main>
    )
}