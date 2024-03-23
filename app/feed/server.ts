export default async function generateFeed(userId: string) {
  const res = await fetch(`http://localhost:5000/api/generate_feed?user_id=${userId}`, {
    method: 'GET',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to generate feed');
  }

  const data = await res.json();
  return data
}