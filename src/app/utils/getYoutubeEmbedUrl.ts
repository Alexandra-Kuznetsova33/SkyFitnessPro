export const getYoutubeEmbedUrl = (url: string): string => {
  if (url.includes('youtube.com/embed/')) return url;
  
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:.*v\/|.*u\/\w\/|embed\/|watch\?v=|&v=))([^#&?]*).*/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : url;
};