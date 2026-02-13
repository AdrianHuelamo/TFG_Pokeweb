<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;

class Auth extends ResourceController
{
    protected $format = 'json';

    public function register()
    {
        // 1. Recoger el JSON primero
        $input = $this->request->getJSON(true); // 'true' devuelve un array asociativo

        if (!$input) {
            return $this->fail('No se han recibido datos JSON validos.', 400);
        }

        // 2. Definir las reglas de seguridad
        $rules = [
            'username' => 'required|min_length[3]',
            'email'    => 'required|valid_email|is_unique[users.email]',
            'password' => [
                'rules'  => 'required|min_length[8]|regex_match[/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*(_|[^\w])).+$/]',
                'errors' => [
                    'regex_match' => 'La contraseña debe tener mayúscula, minúscula, número y símbolo.'
                ]
            ],
            'confirmPassword' => 'required|matches[password]'
        ];

        // 3. Ejecutar la validación explícita sobre el JSON ($input)
        $this->validator = \Config\Services::validation();
        $this->validator->setRules($rules);

        if (!$this->validator->run($input)) {
            // Si falla, devolvemos los errores exactos
            return $this->fail($this->validator->getErrors(), 400);
        }

        // 4. Si todo está bien, guardamos
        $userModel = new UserModel();
        $data = [
            'username'   => $input['username'],
            'email'      => $input['email'],
            'password'   => password_hash($input['password'], PASSWORD_BCRYPT),
            'role'       => 'entrenador',
            'created_at' => date('Y-m-d H:i:s')
        ];

        try {
            $userModel->insert($data);
            return $this->respondCreated(['mensaje' => 'Registro completado con éxito']);
        } catch (\Exception $e) {
            return $this->failServerError('Error al guardar en la base de datos.');
        }
    }

    public function login()
    {
        // Recogemos JSON
        $input = $this->request->getJSON(true);

        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required'
        ];

        $this->validator = \Config\Services::validation();
        $this->validator->setRules($rules);

        if (!$this->validator->run($input)) {
            return $this->fail($this->validator->getErrors(), 400);
        }

        $userModel = new UserModel();
        $user = $userModel->where('email', $input['email'])->first();

        if (!$user) {
            return $this->failNotFound('Usuario no encontrado.');
        }

        if (!password_verify($input['password'], $user['password'])) {
            return $this->fail('Contraseña incorrecta.', 401);
        }

        unset($user['password']);

        return $this->respond([
            'status' => 200,
            'mensaje' => 'Login correcto',
            'data'   => $user
        ]);
    }
}