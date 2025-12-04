import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json({ 
            error: `API returned status ${response.status}`,
            data: errorData
        }, { status: response.status });
    }

    // Try to parse as JSON, but fall back to text if it fails
    const responseText = await response.text();
    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
    } catch (jsonError) {
        // If it's not JSON, it might be a direct media stream or an error page
        // For this app, we expect JSON, so failing to parse is an issue.
        return NextResponse.json({ 
            error: "API returned a non-JSON response.",
            data: responseText
        }, { status: 500 });
    }
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json({ error: 'Failed to fetch from the target API', details: (error as Error).message }, { status: 500 });
  }
}
