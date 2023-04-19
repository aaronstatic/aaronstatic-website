import ProjectCard from '@/components/ProjectCard';
import { getContent, getProjects } from '@/lib/mongodb';
import { Content } from '@/lib/types/Content';
import Project from '@/lib/types/Project';
import { use } from 'react';

export const metadata = {
    title: 'Aaron Static - Projects'
}

export default function Projects() {
    const projects: Project[] = use(getProjects(100));
    const intro: Content = use(getContent("projects"));
    return (
        <main className="">
            <h1 className="text-center p-2 mt-4 display-6">Projects</h1>
            <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8 col-12 text-center text-small">
                    {intro && intro.paragraphs.map((paragraph: string, i: number) => (
                        <p key={i}><small>{paragraph}</small></p>
                    ))}
                </div>
            </div>
            <div className="row gy-2 gx-2 d-flex justify-content-center">
                {projects.map((project) => (
                    <div key={project.name} className="col-12">
                        <ProjectCard project={project} />
                    </div>
                ))}

            </div>
        </main>
    )
}