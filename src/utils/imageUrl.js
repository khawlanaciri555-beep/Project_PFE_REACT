const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    if (path.startsWith('/storage')) return `http://localhost:8000${path}`;
    // Assume other paths without leading slash are in storage
    if (!path.startsWith('/')) return `http://localhost:8000/storage/${path}`;
    return `http://localhost:8000${path}`;
};

export default getImageUrl;
