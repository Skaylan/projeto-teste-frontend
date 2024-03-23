export default async function handleCreateGroupForm(
  groupName: string,
  groupDescription: string,
  userId: string,
  tags: string[],
  imageBase64: string,
) {
  const request = await fetch('http://localhost:5000/api/create_group', {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      group_name: groupName,
      group_description: groupDescription,
      user_id: userId,
      tags: tags,
      image_base64: imageBase64,
    }),
  });

  if (!request.ok) {
    throw new Error('Failed to create group');
  }

  const data = await request.json();
  return data;
};
