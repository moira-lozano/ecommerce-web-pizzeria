export function useStorage() {
    const baseUrl = 'https://www.tecnoweb.org.bo/inf513/grupo12sa/proyecto2/public';

    const storageUrl = (path) => {
        if (!path) return '';
        // Remover cualquier / inicial y agregar la ruta completa
        const cleanPath = path.replace(/^\/+/, '');
        return `${baseUrl}/storage/${cleanPath}`;
    };

    return {
        storageUrl
    };
}
