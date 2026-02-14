<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt']; // Cargar nuestro helper manual

    // --- FUNCIÓN SEGURA PARA OBTENER EL USUARIO ---
    private function getUserFromToken()
    {
        // Intentar leer cabecera Authorization
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        
        // Soporte extra para Apache/XAMPP si borra la cabecera
        if (!$header) {
            $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            
            // Usamos la función de nuestro helper
            $decoded = is_jwt_valid($token, $secret);
            
            // Devolvemos como OBJETO para usar flecha -> (ej: $user->uid)
            return $decoded ? (object) $decoded : null;
        }
        return null;
    }

    // 1. REGISTRO
    public function register()
    {
        $input = $this->request->getJSON(true);
        if (!$input) return $this->fail('Datos inválidos', 400);

        $rules = [
            'username' => 'required|min_length[3]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => 'required|min_length[6]',
            'confirmPassword' => 'required|matches[password]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $userModel = new UserModel();
        $userModel->insert([
            'username' => $input['username'],
            'email'    => $input['email'],
            'password' => password_hash($input['password'], PASSWORD_DEFAULT),
            'role'     => 'entrenador',
            'avatar'   => 'default.webp' // <--- ESTA ES LA LÍNEA NUEVA
        ]);

        return $this->respondCreated(['status' => 201, 'mensaje' => 'Usuario registrado']);
    }

    // 2. LOGIN
    public function login()
    {
        $input = $this->request->getJSON(true);
        $userModel = new UserModel();

        $user = $userModel->where('email', $input['email'] ?? '')->first();
        if (!$user) return $this->failNotFound('Usuario no encontrado.');

        if (!password_verify($input['password'] ?? '', $user['password'])) {
            return $this->fail('Contraseña incorrecta.', 401);
        }

        // Generar Token
        $headers = ['alg' => 'HS256', 'typ' => 'JWT'];
        $payload = [
            'uid' => $user['id'],
            'name' => $user['username'],
            'role' => $user['role'],
            'exp' => (time() + 3600 * 2)
        ];

        $token = generate_jwt($headers, $payload, getenv('JWT_SECRET'));

        return $this->respond([
            'status' => 200,
            'mensaje' => 'Login correcto',
            'token' => $token,
            'user' => [
                'id' => $user['id'],
                'username' => $user['username'],
                'role' => $user['role'],
                'avatar' => $user['avatar'] ?? null // Enviamos avatar si existe
            ]
        ]);
    }

    // 3. SUBIR AVATAR (Protegido)
    public function uploadAvatar() {
        // 1. Verificar usuario
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        // 2. Reglas de validación (AQUÍ ESTÁ EL CAMBIO)
        $rules = [
            'avatar' => [
                'uploaded[avatar]', // Que se haya subido algo
                'is_image[avatar]', // Que sea una imagen real
                'mime_in[avatar,image/jpg,image/jpeg,image/png,image/webp]', // Formatos permitidos
                'max_size[avatar, 4096]', // <--- ¡AQUÍ! Cambiado a 4096 KB (4MB)
                // 'max_dims[avatar,1024,768]', // Opcional: Desactivado para no limitar dimensiones
            ]
        ];

        // 3. Si no cumple las reglas, devolvemos el error
        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // 4. Procesar el archivo
        $file = $this->request->getFile('avatar');

        if (!$file->isValid()) {
            return $this->fail($file->getErrorString());
        }

        // 5. Generar nombre aleatorio y mover
        $newName = $file->getRandomName();
        $file->move(FCPATH . 'uploads/avatars', $newName);

        // 6. Actualizar base de datos
        $userModel = new UserModel();
        $userModel->update($user->uid, ['avatar' => $newName]);

        return $this->respond([
            'mensaje' => 'Avatar actualizado correctamente',
            'avatar' => $newName
        ]);
    }

    // 4. CAMBIAR CONTRASEÑA (Protegido)
    public function changePassword()
    {
        $userToken = $this->getUserFromToken();
        if (!$userToken) return $this->failUnauthorized();

        $json = $this->request->getJSON();
        
        $current = $json->currentPassword ?? '';
        $new = $json->newPassword ?? '';
        $confirm = $json->confirmPassword ?? '';

        if ($new !== $confirm) {
            return $this->fail('Las contraseñas nuevas no coinciden');
        }
        if (strlen($new) < 6) {
            return $this->fail('La contraseña nueva es muy corta');
        }

        $userModel = new UserModel();
        // Obtener datos reales de la BD para verificar la contraseña vieja
        $uid = $userToken->uid ?? null;
        $dbUser = $userModel->find($uid);

        if (!$dbUser || !password_verify($current, $dbUser['password'])) {
            return $this->fail('La contraseña actual es incorrecta', 401);
        }

        // Guardar nueva
        $userModel->update($uid, [
            'password' => password_hash($new, PASSWORD_DEFAULT)
        ]);

        return $this->respond(['status' => 200, 'mensaje' => 'Contraseña actualizada']);
    }

    public function me()
    {
        $userToken = $this->getUserFromToken();
        
        if (!$userToken) {
            return $this->failUnauthorized('Sesión inválida');
        }

        $userModel = new UserModel();
        // Buscamos en la BD usando el ID del token
        $data = $userModel->find($userToken->uid);

        if (!$data) {
            return $this->failNotFound('Usuario no encontrado');
        }

        // Devolvemos los datos (quitando la contraseña por seguridad)
        unset($data['password']);
        
        return $this->respond($data);
    }

    public function refresh() {
        // 1. Coger el token que envía el usuario
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        
        // Truco para XAMPP si no llega la cabecera
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

        // Limpiamos "Bearer " para quedarnos solo con el código
        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            
            // 2. Comprobar si el token es auténtico
            $datos = is_jwt_valid($token, $secret);

            if ($datos) {
                // 3. ¡ES VÁLIDO! Creamos uno nuevo usando nuestra función Helper
                // Aquí es donde llamas a la función que acabamos de crear arriba
                $newToken = getSignedJWTForUser($datos->uid, $datos->email, $datos->role);
                
                return $this->respond([
                    'status' => 200,
                    'message' => 'Sesión renovada',
                    'token' => $newToken
                ]);
            }
        }
        
        return $this->failUnauthorized('No se pudo renovar la sesión');
    }
}