import ReleaseCard from '@/components/ReleaseCard';
import { getReleases } from '@/lib/mongodb';
import Release from '@/lib/types/Release';
import { use } from 'react';

export default function Home() {
  const releases: Release[] = use(getReleases(12));
  return (
    <main className="">
      <div className="row justify-content-center">
        <div className="col-lg-7 col-md-8 col-12">
          <img className="img-fluid" src="/img/aaronstatic_photo_home.jpg" alt="Aaron Static" />
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <h1 className="text-center p-2 display-6">Latest Releases</h1>
        <div className="row gy-2 gx-2 d-flex justify-content-center">
          {releases.map((release) => (
            <div className="col-lg-2 col-md-3 col-6">
              <ReleaseCard key={release.id} release={release} />
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
