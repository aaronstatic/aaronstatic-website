
import { getContent } from '@/lib/mongodb';
import { Content } from '@/lib/types/Content';
import React, { use } from 'react';

export const metadata = {
    title: 'Aaron Static - About'
}

export default function About() {
    const bio: Content = use(getContent("bio"));
    let photoIndex = 0;
    let photoCounter = 0;
    let photoAlign = "float-end";
    return (
        <main className="">
            <div className="row justify-content-center">
                <div className="col-lg-7 col-md-8 col-12">
                    {bio && bio.paragraphs.map((paragraph: string, i: number): React.ReactNode => {
                        let showPhoto = false;
                        if (photoCounter === 0 && bio.photos.length > photoIndex) {
                            photoIndex++;
                            showPhoto = true;
                            photoAlign = photoAlign == "float-end" ? "float-start" : "float-end";
                        }
                        photoCounter++;
                        if (photoCounter === 3) {
                            photoCounter = 0;
                        }
                        return (
                            <div key={i}>
                                {showPhoto && (
                                    <img className={`w-50 m-2 ${photoAlign}`} src={`/img/photos/${bio.photos[photoIndex - 1]}`} alt="Aaron Static" />
                                )}

                                <p>
                                    <small>{paragraph}</small>
                                </p>
                            </div>
                        )
                    })}
                </div>
            </div>
        </main>
    )
}