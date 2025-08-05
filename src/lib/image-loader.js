export default function imageLoader({ src, width, quality }) {
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  if (src.startsWith('/')) {
    const baseUrl = 'https://unipost.uni-labs.org';
    return `${baseUrl}${src}?w=${width}&q=${quality || 75}`;
  }
  
  return src;
}