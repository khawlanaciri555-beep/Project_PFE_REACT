const fs = require('fs');
try {
    const data = fs.readFileSync('c:\\Users\\youne_xdgo4rt\\Desktop\\project_PFE\\Project_PFE_REACT\\src\\i18n\\locales\\ar.json', 'utf8');
    JSON.parse(data);
    console.log('JSON is valid');
} catch (e) {
    console.error('JSON is invalid:', e.message);
}
