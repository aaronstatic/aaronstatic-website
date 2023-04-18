import MixCard from '@/components/MixCard';
import { getContent, getMixes } from '@/lib/mongodb';
import { Content } from '@/lib/types/Content';
import Mix from '@/lib/types/Mix';
import { use } from 'react';

export const metadata = {
    title: 'Aaron Static - Mixes'
}

export default function Mixes() {
    const mixes: Mix[] = use(getMixes(100));
    const intro: Content = use(getContent("mixes"));
    return (
        <main className="">
            <h1 className="text-center p-2 mt-4 display-6">Mixes</h1>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-12 text-center text-small">
                    {intro && intro.paragraphs.map((paragraph: string, i: number) => (
                        <p key={i}><small>{paragraph}</small></p>
                    ))}
                </div>
            </div>
            <div className="row gy-2 gx-2 d-flex justify-content-center">
                {mixes.map((mix) => (
                    <div key={mix.key} className="col-lg-2 col-md-3 col-6">
                        <MixCard mix={mix} />
                    </div>
                ))}

            </div>
        </main>
    )
}