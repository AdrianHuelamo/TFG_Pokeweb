export interface UserLogin {
    email: string;
    password: string;
}

export interface LoginResponse {
    status: number;
    mensaje: string;
    data?: any; 
}