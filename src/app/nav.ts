interface NavItem {
    name: string;
    url: string;
}

export default function getNav(): NavItem[] {
    return [{
        name: 'About',
        url: '/about'
    }, {
        name: 'Music',
        url: '/music'
    }, {
        name: 'Mixes',
        url: '/mixes'
    }, {
        name: 'Projects',
        url: '/projects'
    }, {
        name: 'Contact',
        url: '/contact'
    }]
}