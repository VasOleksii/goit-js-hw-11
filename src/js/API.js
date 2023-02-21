import axios from 'axios';

export default async function searchImages(value, page) {
  const URL = 'https://pixabay.com/api/';
  const KEY = '33797356-50ef8f6f691cb32ae634945b3';
  const QUERY = `?key=${KEY}&q=${value}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${page}`;

  return await axios.get(`${URL}${QUERY}`).then(response => response.data);
}