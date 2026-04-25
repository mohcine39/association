// Puppeteer is dynamically imported to avoid build errors on Vercel

export interface ScrapedEvent {
  title: string;
  description: string;
  imageUrl: string | null;
  facebookUrl: string;
  date?: Date;
  location?: string;
}

export async function scrapeFacebookEvents(pageUrl: string): Promise<ScrapedEvent[]> {
  let puppeteer;
  try {
    puppeteer = (await import('puppeteer')).default;
  } catch (e) {
    console.warn("Puppeteer is not available in this environment. Scraper disabled.");
    return [];
  }

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  
  // Set user agent to look like a real browser
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

  try {
    console.log(`Navigating to ${pageUrl}...`);
    await page.goto(pageUrl, { waitUntil: 'networkidle2' });

    // Wait for posts to load
    await page.waitForSelector('div[role="main"]', { timeout: 10000 });

    // Scroll down to load more content
    for (let i = 0; i < 3; i++) {
      await page.evaluate(() => window.scrollBy(0, 1000));
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    const events = await page.evaluate(() => {
      // Common Facebook post selectors
      const postSelectors = [
        'div[role="article"]',
        'div[data-testid="post_container"]',
        'div[data-ad-preview="message"]'
      ];
      
      let postElements: Element[] = [];
      for (const selector of postSelectors) {
        const found = Array.from(document.querySelectorAll(selector));
        if (found.length > postElements.length) postElements = found;
      }
      
      return postElements.map(post => {
        // Extract text content
        const textElement = post.querySelector('div[data-ad-preview="message"], div[data-testid="post_message"], div[dir="auto"]');
        const text = textElement?.textContent?.trim() || post.textContent?.trim() || '';
        
        // Skip if too short or likely not a main post
        if (text.length < 20) return null;

        // Find all images in the post
        const imgElements = Array.from(post.querySelectorAll('img'));
        // Filter out tiny icons or avatars
        const imageUrls = imgElements
          .map(img => img.src)
          .filter(src => src && !src.includes('static.xx.fbcdn.net') && !src.includes('/rsrc.php/'));
        
        const imageUrl = imageUrls[0] || null;

        // Try to find a link to the post
        const linkElement = post.querySelector('a[href*="/posts/"], a[href*="/photos/"], a[href*="/videos/"], a[href*="permalink"]');
        const facebookUrl = linkElement instanceof HTMLAnchorElement ? linkElement.href : window.location.href;

        // Basic title extraction (first line or first few words)
        const lines = text.split('\n').filter(l => l.trim());
        const title = lines[0]?.substring(0, 100) || 'فعالية جديدة';

        return {
          title,
          description: text,
          imageUrl,
          facebookUrl,
        };
      }).filter(Boolean) as any[];
    });

    await browser.close();
    return events;
  } catch (error) {
    console.error('Error during scraping:', error);
    await browser.close();
    throw error;
  }
}
