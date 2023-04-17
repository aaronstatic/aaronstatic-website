import 'bootstrap/dist/css/bootstrap.css'
import './globals.css'
import Image from 'next/image'
import getNav from './nav'
import Bootstrap from '@/components/Bootstrap'
import { headers } from 'next/headers';
import Link from 'next/link'

export const metadata = {
  title: 'Aaron Static',
  description: 'Australian based music artist and app developer producing Ambient, Liquid Drum & Bass, Organic House, Future Garage, and code to help people write music.',
  metadataBase: new URL('http://aaronstatic.com'),
  keywords: ['music', 'artist', 'app developer', 'ambient', 'liquid', 'drum & bass', 'organic house', 'house', 'future garage', 'code'],
  colorScheme: 'dark',
  openGraph: {
    title: "Aaron Static",
    description: "Australian-based music artist and app developer",
    url: "http://aaronstatic.com",
    siteName: "Aaron Static",
    images: ['social-preview.png']
  },
  viewport: 'width=device-width, initial-scale=1.0'
}

function SocialLinks() {
  return (
    <div className="social-links">
      <div className="container text-center">
        <a target="_new" href="https://open.spotify.com/artist/0Nsz79ZcE8E4i3XZhCzZ1l?si=NOiKauhCQPaQtbklBEJx9Q"><i className="fa fa-spotify"></i></a>
        <a target="_new" href="https://instagram.com/aaronstatic"><i className="fa fa-instagram"></i></a>
        <a target="_new" href="https://facebook.com/aaronstatic"><i className="fa fa-facebook"></i></a>
        <a target="_new" href="https://twitter.com/aaronstatic"><i className="fa fa-twitter"></i></a>
        <a target="_new" href="https://soundcloud.com/aaronstatic"><i className="fa fa-soundcloud"></i></a>
        <a target="_new" href="https://youtube.com/aaronstatic"><i className="fa fa-youtube"></i></a>
        <a target="_new" href="https://github.com/aaronstatic"><i className="fa fa-github"></i></a>
      </div>
    </div>
  )
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headersList = headers();
  const url = headersList.get('x-url') || "";
  let path = "/" + url.split('/')[3];


  const nav = getNav();
  return (
    <html lang="en" data-bs-theme="dark">
      <body>
        <nav className="navbar navbar-expand-lg">
          <div className="container-fluid">
            <a className="navbar-brand" href="/"><Image height={50} width={280} alt="Aaron Static" src="/img/aaronstatic_logo.png" /></a>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                {nav.map((item) => (
                  <li className="nav-item" key={item.url}>
                    <a className={"nav-link" + (item.url == path ? ' active' : '')} aria-current="page" href={item.url}>{item.name}</a>
                  </li>
                ))}
              </ul>
              <SocialLinks />
              <div>
                <Link target="_new" href="https://patreon.com/aaronstatic">
                  <button type="button" className="btn bg-primary text-primary-emphasis">
                    Support&nbsp;
                    <Image height={16} width={16} alt="Support" src="/img/love.svg" />
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </nav>
        <main className="">
          <div className="container">
            {children}
          </div>
        </main>
        <link href="https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css" rel="stylesheet" />

        <SocialLinks />
        <Bootstrap />
      </body>
    </html >
  )
}
