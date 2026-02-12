export interface UserLogin {
    email: string;
    password: string;
}

// Actualizada con confirmPassword
export interface UserRegister {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string; 
}

export interface LoginResponse {
    status: number;
    mensaje: string;
    data?: any; 
}