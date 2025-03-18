import { NextRequest, NextResponse } from 'next/server';
import { getReleaseByName, getReleases } from '@/lib/mongodb';

export async function GET(request: NextRequest) {
  try {
    // Extract the full path from the URL to handle special characters like '&' properly
    const url = new URL(request.url);
    const fullPath = url.pathname;
    const { searchParams } = url;
    
    console.log('Request URL:', request.url);
    console.log('Path:', fullPath);
    console.log('Raw search params:', url.search);
    
    // Extract the release name from the query parameters
    // Note: We need to be careful as '&' in URLs is a special character for separating query parameters
    let slug = searchParams.get('name');
    
    console.log('Extracted slug from params:', slug);
    
    // Check if there's an encoded '&' in the original URL that might be causing issues
    const rawQueryMatch = url.search.match(/name=([^&]+)/);
    const rawSlug = rawQueryMatch ? rawQueryMatch[1] : null;
    
    console.log('Raw slug from URL match:', rawSlug);
    
    if (rawSlug && rawSlug !== slug) {
      // There might be unencoded '&' causing issues, use the raw extracted version
      slug = decodeURIComponent(rawSlug);
      console.log('Using raw slug after decoding:', slug);
    }
    
    if (!slug) {
      // If no name parameter is provided, try to extract it from path
      const pathParts = fullPath.split('/');
      if (pathParts.length > 2) {
        // Get the last part of the path as the slug
        slug = decodeURIComponent(pathParts[pathParts.length - 1]);
        console.log('Extracted slug from path:', slug);
      }
    }

    // Check if the request is specifically asking to list all releases
    if (slug === '_debug_list_all') {
      const allReleases = await getReleases(100); // Get up to 100 releases for debugging
      return NextResponse.json({ 
        message: 'Listing all releases for debugging', 
        count: allReleases.length,
        releases: allReleases.map(r => r.name)
      });
    }

    if (!slug) {
      return NextResponse.json(
        { error: 'Missing name parameter' },
        { status: 400 }
      );
    }

    // Try different conversions to find the release
    const possibleNames = [];
    
    // 1. First try the exact name as is (after decoding)
    possibleNames.push(slug);
    
    // 2. Basic hyphen to space conversion
    possibleNames.push(slug.replace(/-/g, ' '));
    
    // 3. Replace "and" with "&"
    possibleNames.push(slug.replace(/-/g, ' ').replace(/ and /gi, ' & '));
    
    // 4. The exact name "Remix & Additional Production" found in the database
    if (slug.toLowerCase().includes('remix') && slug.toLowerCase().includes('production')) {
      possibleNames.push('Remix & Additional Production');
    }
    
    // Remove duplicates
    const uniqueNames = Array.from(new Set(possibleNames));
    
    console.log('Trying these possible names:', uniqueNames);

    // Try each possible name until we find a match
    let release = null;
    for (const name of uniqueNames) {
      console.log('Trying to find release with name:', name);
      release = await getReleaseByName(name);
      if (release) {
        console.log('Found release:', release.name);
        break;
      }
    }

    if (!release) {
      console.log('No release found for any of the attempted names');
      return NextResponse.json(
        { 
          error: 'Release not found',
          attempted: uniqueNames,
          requestUrl: request.url
        },
        { status: 404 }
      );
    }

    return NextResponse.json(release);
  } catch (error) {
    console.error('Error fetching release:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 