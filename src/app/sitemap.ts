import { MetadataRoute } from 'next';
import getNav from './nav'

export default function sitemap(): MetadataRoute.Sitemap {
    let pages = [{
        url: 'https://aaronstatic.com',
        lastModified: new Date()
    }];
    let nav = getNav();
    for (const item of nav) {
        pages.push({
            url: 'https://aaronstatic.com' + item.url,
            lastModified: new Date(),
        })
    }
    return pages;
}