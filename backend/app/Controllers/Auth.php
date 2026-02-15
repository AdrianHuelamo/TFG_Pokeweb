<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt']; 

    private function getUserFromToken()
    {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        
        if (!$header) {
            $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            
            $decoded = is_jwt_valid($token, $secret);
            
            return $decoded ? (object) $decoded : null;
        }
        return null;
    }

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
            'avatar'   => 'default.webp' 
        ]);

        return $this->respondCreated(['status' => 201, 'mensaje' => 'Usuario registrado']);
    }

    public function login()
    {
        $input = $this->request->getJSON(true);
        $userModel = new UserModel();

        $user = $userModel->where('email', $input['email'] ?? '')->first();
        if (!$user) return $this->failNotFound('Usuario no encontrado.');

        if (!password_verify($input['password'] ?? '', $user['password'])) {
            return $this->fail('Contraseña incorrecta.', 401);
        }

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
                'avatar' => $user['avatar'] ?? null 
            ]
        ]);
    }

    public function uploadAvatar() {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $rules = [
            'avatar' => [
                'uploaded[avatar]', 
                'is_image[avatar]', 
                'mime_in[avatar,image/jpg,image/jpeg,image/png,image/webp]', 
                'max_size[avatar, 4096]', 
            ]
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $file = $this->request->getFile('avatar');

        if (!$file->isValid()) {
            return $this->fail($file->getErrorString());
        }

        $newName = $file->getRandomName();
        $file->move(FCPATH . 'uploads/avatars', $newName);

        $userModel = new UserModel();
        $userModel->update($user->uid, ['avatar' => $newName]);

        return $this->respond([
            'mensaje' => 'Avatar actualizado correctamente',
            'avatar' => $newName
        ]);
    }

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
        $uid = $userToken->uid ?? null;
        $dbUser = $userModel->find($uid);

        if (!$dbUser || !password_verify($current, $dbUser['password'])) {
            return $this->fail('La contraseña actual es incorrecta', 401);
        }

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
        $data = $userModel->find($userToken->uid);

        if (!$data) {
            return $this->failNotFound('Usuario no encontrado');
        }

        unset($data['password']);
        
        return $this->respond($data);
    }

    public function refresh() {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            
            $datos = is_jwt_valid($token, $secret);

            if ($datos) {
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