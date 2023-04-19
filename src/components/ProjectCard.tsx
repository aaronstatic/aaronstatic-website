import Project from "@/lib/types/Project";
import Link from "next/link";

interface ProjectCardProps {
    project: Project;
}

export default function ProjectCard({ project, ...otherProps }: ProjectCardProps) {
    return (
        <div {...otherProps} className="card mb-1" style={{ border: "none" }}>
            <div className="card-header text-center">
                <h2 className="card-title">{project.name}</h2>
            </div>
            <img src={`/img/projects/${project.photo}`} className="card-img-top" alt={project.name} />

            <div className="card-body">
                {project.paragraphs && project.paragraphs.map((paragraph, index) => (
                    <p key={index} className="card-text"><small>{paragraph}</small></p>
                ))}
            </div>
            <div className="card-footer text-center">
                {project.external_urls.github && (
                    <Link href={project.external_urls.github} target="_new">
                        <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-github"></i> View On GitHub</button>
                    </Link>
                )}
                {project.external_urls.vcvrack && (
                    <Link href={project.external_urls.vcvrack} target="_new">
                        <button type="button" className="btn bg-primary text-primary-emphasis m-1"><img height="16" width="16" src="/img/icons/vcvrack.svg" style={{ marginTop: "-3px" }} /> Add to VCV Rack</button>
                    </Link>
                )}
                {project.external_urls.steam && (
                    <Link href={project.external_urls.steam} target="_new">
                        <button type="button" className="btn bg-primary text-primary-emphasis m-1"><i className="fa fa-steam"></i> View On Steam</button>
                    </Link>
                )}
            </div>
        </div >
    )
}