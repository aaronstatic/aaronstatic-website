import { Metadata } from 'next';
import { getReleaseByName } from '@/lib/mongodb';

type Props = {
  params: { name: string };
};

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const release = await getReleaseByName(resolvedParams.name);

    if (!release) {
      return {
        title: 'Release not found',
      };
    }

    // Create a plain string for the title to avoid any serialization issues
    let artistNames = '';
    if (release.artists && Array.isArray(release.artists)) {
      artistNames = release.artists
        .map(artist => artist && typeof artist.name === 'string' ? artist.name : '')
        .filter(name => name)
        .join(", ");
    }

    const releaseName = release.name && typeof release.name === 'string' ? release.name : '';
    const titleString = artistNames ? `${artistNames} - ${releaseName}` : releaseName;

    return {
      title: titleString || 'Music Release',
    };
  } catch (error) {
    console.error('Error generating metadata:', error);
    return {
      title: 'Music Release',
    };
  }
} 