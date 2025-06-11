
export async function fetchWebsiteContent(url: string): Promise<{
  htmlContent: string;
  title: string;
  description: string;
}> {
  const websiteResponse = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });
  
  if (!websiteResponse.ok) {
    throw new Error(`Failed to fetch website: ${websiteResponse.status}`);
  }

  const htmlContent = await websiteResponse.text();
  console.log('Website content fetched, length:', htmlContent.length);

  // Extract basic website info
  const titleMatch = htmlContent.match(/<title[^>]*>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'Unknown Website';
  
  const descriptionMatch = htmlContent.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
  const description = descriptionMatch ? descriptionMatch[1] : '';

  return { htmlContent, title, description };
}
