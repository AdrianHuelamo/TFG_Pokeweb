export interface Noticia {
    id: number;
    titulo: string;
    resumen: string;
    contenido: string;
    imagen: string;
    destacada: number;
    created_at: string;     
    autor_id: number; 
}

export interface NoticiasResponse {
    status: number;
    mensaje: string;
    data: Noticia[];
}