// Fetch hymns for a given deity and mandala from the REST API
export async function fetchHymnsByDeityMandala(deity, mandala) {
  const url = `https://api-rv.herokuapp.com/rv/v2/meta/god/${deity}/${mandala}`;
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    const data = await response.json();
    // The API returns an array of hymn objects
    return data;
  } catch (error) {
    console.error('Failed to fetch hymns:', error);
    return [];
  }
}

