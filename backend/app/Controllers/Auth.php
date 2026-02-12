<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    // --- 1. REGISTRO (Ya lo tenías, lo dejo igual) ---
    public function register()
    {
        $rules = [
            'username' => 'required|min_length[3]|is_unique[users.username]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => [
                'rules'  => 'required|min_length[8]|regex_match[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/]',
                'errors' => ['regex_match' => 'La contraseña debe tener mayúsculas, minúsculas, números y símbolos.']
            ],
            'confirmPassword' => 'required|matches[password]'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        $json = $this->request->getJSON();
        $userModel = new UserModel();
        $data = [
            'username'   => $json->username,
            'email'      => $json->email,
            'password'   => password_hash($json->password, PASSWORD_BCRYPT),
            'role'       => 'entrenador',
            'created_at' => date('Y-m-d H:i:s')
        ];

        try {
            $userModel->insert($data);
            return $this->respondCreated(['mensaje' => 'Registro OK']);
        } catch (\Exception $e) {
            return $this->failServerError('Error en base de datos.');
        }
    }

    // --- 2. LOGIN (¡FALTABA ESTO!) ---
    public function login()
    {
        // Validamos que lleguen los datos básicos
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required'
        ];

        if (!$this->validate($rules)) {
            return $this->fail($this->validator->getErrors());
        }

        // Recogemos los datos de Angular
        $json = $this->request->getJSON();
        $userModel = new UserModel();

        // 1. Buscar usuario por Email
        $user = $userModel->where('email', $json->email)->first();

        if (!$user) {
            return $this->failNotFound('Este correo no está registrado.');
        }

        // 2. Comprobar Contraseña (password_verify compara la escrita con la encriptada)
        if (!password_verify($json->password, $user['password'])) {
            return $this->fail('La contraseña es incorrecta.', 401);
        }

        // 3. ¡Éxito! Quitamos la contraseña del array por seguridad antes de enviarlo
        unset($user['password']);

        // Enviamos la respuesta a Angular
        return $this->respond([
            'status' => 200,
            'mensaje' => 'Login correcto',
            'data'   => $user
        ]);
    }
}