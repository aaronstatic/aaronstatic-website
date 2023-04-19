import Mix from "@/lib/types/Mix";
import Link from "next/link";

interface MixCardProps {
    mix: Mix;
}

export default function MixCard({ mix, ...otherProps }: MixCardProps) {
    return (

        <div {...otherProps} className="card mb-1">
            <a href={mix.url} target="_new">
                <img src={mix.pictures.large} className="card-img-top" alt={mix.name} />
            </a>
            <div className="card-body text-center" style={{ height: "120px" }}>
                {mix.name}
            </div>
            <ul className="list-group list-group-flush text-center">
                {mix.tags && mix.tags.slice(0, 1).map((tag, i) => (
                    <li key={i} className="list-group-item">{tag.name}</li>
                ))}
            </ul>
            <div className="card-footer text-center">
                <a className="btn bg-dark" href={mix.url} target="_new">
                    <i className="fa fa-headphones"></i> Listen
                </a>
            </div>
        </div >
    )
}