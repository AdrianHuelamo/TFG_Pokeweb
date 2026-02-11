export interface Noticia {
    id: number;
    titulo: string;
    resumen: string;
    contenido: string;
    imagen: string;
    created_at: string;
    destacada?: number;
}

export interface NoticiasResponse {
    status: number;
    mensaje: string;
    data: Noticia[];
}