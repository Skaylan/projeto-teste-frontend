export default async function getUserGroups(userId: string) {
    const res = await fetch(`http://localhost:5000/api/get_user_groups?user_id=${userId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
            'Content-Type': 'application/json'
        },
        cache: 'no-store'
    });

    if (!res.ok) {
        throw new Error('Failed to get user groups');
    }

    const data = await res.json();
    return data
}