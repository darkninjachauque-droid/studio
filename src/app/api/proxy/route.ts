import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');
  const filename = searchParams.get('filename') || 'video.mp4';
  const isDownload = searchParams.get('download') === 'true';

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
        const errorData = await response.text();
        return NextResponse.json({ 
            error: `API returned status ${response.status}`,
            data: errorData
        }, { status: response.status });
    }

    // Se for uma requisição de download de arquivo, faz o stream do corpo da resposta
    if (isDownload) {
      const headers = new Headers();
      headers.set('Content-Type', response.headers.get('Content-Type') || 'application/octet-stream');
      headers.set('Content-Disposition', `attachment; filename="${filename}"`);
      if (response.headers.has('Content-Length')) {
        headers.set('Content-Length', response.headers.get('Content-Length')!);
      }

      // Garante que o corpo da resposta exista antes de criar a resposta de stream
      if (!response.body) {
         return NextResponse.json({ error: 'Remote resource has no content' }, { status: 500 });
      }

      return new NextResponse(response.body, { headers });
    }

    // Se for uma requisição de API normal (JSON)
    const responseText = await response.text();
    try {
        const data = JSON.parse(responseText);
        return NextResponse.json(data);
    } catch (jsonError) {
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
