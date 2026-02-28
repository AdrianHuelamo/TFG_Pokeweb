<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;

class Admin extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt'];

    public function dashboardStats()
    {
        $user = $this->getUserFromToken();
        if (!$user || $user->role !== 'admin') return $this->failForbidden('Acceso denegado.');

        $db = \Config\Database::connect();
        try {
            $stats = [
                'usuarios' => $db->table('users')->countAllResults(),
                'noticias' => $db->table('noticias')->countAllResults(),
                'equipos'  => $db->table('teams')->countAllResults(),
                'capturas' => $db->table('user_capturas')->countAllResults()
            ];
            return $this->respond(['status' => 200, 'data' => $stats]);
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function getUsers() {
        if (!$this->esAdmin()) return $this->failForbidden();
        $db = \Config\Database::connect();
        $users = $db->table('users')->orderBy('id', 'DESC')->get()->getResultArray();
        return $this->respond(['data' => $users]);
    }

    public function deleteUser($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        $admin = $this->getUserFromToken();
        if ($admin->uid == $id) return $this->fail('No puedes eliminar tu propia cuenta.');

        $db = \Config\Database::connect();
        $db->table('users')->where('id', $id)->delete();
        return $this->respondDeleted(['message' => 'Usuario eliminado']);
    }

    public function updateUser() {
        if (!$this->esAdmin()) return $this->failForbidden();
        $id = $this->request->getVar('id');
        $db = \Config\Database::connect();
        $data = [];

        if ($role = $this->request->getVar('role')) $data['role'] = $role;
        if ($pass = $this->request->getVar('password')) $data['password'] = password_hash($pass, PASSWORD_DEFAULT);

        if (!empty($data)) {
            $db->table('users')->where('id', $id)->update($data);
            return $this->respond(['message' => 'Actualizado']);
        }
        return $this->fail('Sin datos');
    }

    public function getNews() {
    $db = \Config\Database::connect();
    
    $noticias = $db->table('noticias')
                   ->select('noticias.*, users.email as autor_email') 
                   ->join('users', 'users.id = noticias.autor_id', 'left') 
                   ->orderBy('noticias.created_at', 'DESC')
                   ->get()->getResultArray();

    return $this->respond(['data' => $noticias]);
}

    public function createNews() {
        if (!$this->esAdmin()) return $this->failForbidden();
        $user = $this->getUserFromToken();
        $db = \Config\Database::connect();

        $data = [
            'titulo'    => $this->request->getVar('titulo'),
            'contenido' => $this->request->getVar('contenido'),
            'resumen'   => $this->request->getVar('resumen'),
            'autor_id'  => $user->uid, // Guardamos el ID del creador
            'destacada' => 0
        ];

        $file = $this->request->getFile('imagen');
        if ($file && $file->isValid() && !$file->hasMoved()) {
            $newName = $file->getRandomName();
            $uploadPath = FCPATH . 'uploads/noticias';
            if (!is_dir($uploadPath)) mkdir($uploadPath, 0777, true);
            $file->move($uploadPath, $newName);
            $data['imagen'] = 'uploads/noticias/' . $newName;
        }

        $db->table('noticias')->insert($data);
        return $this->respondCreated(['message' => 'Noticia creada']);
    }

    public function toggleHighlight($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        $db = \Config\Database::connect();
        $db->query("UPDATE noticias SET destacada = NOT destacada WHERE id = ?", [$id]);
        return $this->respond(['message' => 'Estado cambiado']);
    }

    public function deleteNews($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        $db = \Config\Database::connect();
        $db->table('noticias')->where('id', $id)->delete();
        return $this->respondDeleted(['message' => 'Noticia eliminada']);
    }

    public function getTeams() {
        if (!$this->esAdmin()) return $this->failForbidden();
        $db = \Config\Database::connect();
        $teams = $db->table('teams')
                    ->select('teams.*, users.username as owner_name, users.email as owner_email')
                    ->join('users', 'users.id = teams.user_id', 'left') // En equipos es user_id
                    ->orderBy('teams.created_at', 'DESC')
                    ->get()->getResultArray();
        return $this->respond(['data' => $teams]);
    }

    public function deleteTeam($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        $db = \Config\Database::connect();
        $db->table('teams')->where('id', $id)->delete();
        return $this->respondDeleted(['message' => 'Equipo eliminado']);
    }

    private function esAdmin() {
        $user = $this->getUserFromToken();
        return ($user && $user->role === 'admin');
    }

    private function getUserFromToken() {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        
        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            if (function_exists('is_jwt_valid')) {
                try {
                    $decoded = is_jwt_valid($token, $secret);
                    if ($decoded) return (object)$decoded;
                } catch (\Exception $e) { return null; }
            }
        }
        return null;
    }
}