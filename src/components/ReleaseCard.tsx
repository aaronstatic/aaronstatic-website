import Release from "@/lib/types/Release";
import Link from "next/link";

interface ReleaseCardProps {
    release: Release;
}

export default function ReleaseCard({ release, ...otherProps }: ReleaseCardProps) {
    return (
        <Link {...otherProps} href={`music/${release.name.replace(/ /g, '-')}`}>

            <div className="card mb-1">
                <img src={release.images[0].url} className="card-img-top" alt={release.name} />
            </div>

        </Link>
    )
}