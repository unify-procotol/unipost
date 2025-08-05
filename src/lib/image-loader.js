export default function imageLoader({ src, width, quality }) {
  // 如果是外部链接（http/https开头），直接返回
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // 如果是本地图片（以/开头），通过unipost服务访问
  if (src.startsWith('/')) {
    const baseUrl = 'https://unipost.uni-labs.org';
    return `${baseUrl}${src}?w=${width}&q=${quality || 75}`;
  }
  
  // 其他情况直接返回
  return src;
}