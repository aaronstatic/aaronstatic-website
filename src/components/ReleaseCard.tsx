import Release from "@/lib/types/Release";
import Link from "next/link";

interface ReleaseCardProps {
    release: Release;
}

export default function ReleaseCard({ release, ...otherProps }: ReleaseCardProps) {
    return (
        <div {...otherProps} className="card mb-1">
            <a href={`music/${release.name.replace(/ /g, '-')}`}>
                <img src={release.images[0].url} className="card-img-top" alt={release.name} />
            </a>
            <div className="card-body text-center" style={{ height: "90px" }}>
                <small>{`${release.artists.map(artist => (artist.name)).join(", ")} - ${release.name}`}</small>
            </div>
            <ul className="list-group list-group-flush text-center">

                <li className="list-group-item">{release.label}</li>

            </ul>
            <div className="card-footer text-center">
                <a className="btn bg-dark" href={`music/${release.name.replace(/ /g, '-')}`}>
                    <i className="fa fa-info-circle"></i> More Info
                </a>
            </div>
        </div>
    )
}