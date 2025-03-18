import MixCard from '@/components/MixCard';
import ReleaseCard from '@/components/ReleaseCard';
import { getReleases, getMixes } from '@/lib/mongodb';
import Mix from '@/lib/types/Mix';
import Release from '@/lib/types/Release';
import { use } from 'react';

export default function Home() {
  const releases: Release[] = use(getReleases(6));
  const mixes: Mix[] = use(getMixes(6));
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
            <div className="col-lg-2 col-md-3 col-6" key={release.id}>
              <ReleaseCard key={release.id} release={release} />
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col-4 text-center">
            <a href="/music" className="btn bg-primary text-primary-emphasis">View More</a>
          </div>
        </div>
      </div>
      <div className="row justify-content-center mt-3">
        <h1 className="text-center p-2 display-6">Latest Mixes</h1>
        <div className="row gy-2 gx-2 d-flex justify-content-center">
          {mixes.map((mix) => (
            <div key={mix.key} className="col-lg-2 col-md-3 col-6">
              <MixCard mix={mix} />
            </div>
          ))}
        </div>
        <div className="row justify-content-center mt-2">
          <div className="col-4 text-center">
            <a href="/mixes" className="btn bg-primary text-primary-emphasis">View More</a>
          </div>
        </div>
      </div>
    </main>
  )
}
