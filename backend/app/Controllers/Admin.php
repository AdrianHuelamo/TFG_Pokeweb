<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\NoticiaModel;
use App\Models\TeamModel;
// No necesitamos modelo específico para capturas si usamos db->table, 
// pero si tienes CapturaModel, asegúrate de que apunte a 'user_capturas'.

class Admin extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt'];

    // --- DASHBOARD STATS ---
    public function dashboardStats()
    {
        // Validación de Admin
        if (!$this->esAdmin()) return $this->failForbidden('Acceso denegado');

        $db = \Config\Database::connect();

        // CONTADORES (Usando los nombres reales de tu SQL)
        $usuarios = $db->table('users')->countAll();
        $noticias = $db->table('noticias')->countAll();
        $equipos  = $db->table('teams')->countAll();
        $capturas = $db->table('user_capturas')->countAll(); // <--- CORREGIDO: user_capturas

        return $this->respond([
            'status' => 200,
            'data' => [
                'usuarios' => $usuarios,
                'noticias' => $noticias,
                'equipos'  => $equipos,
                'capturas' => $capturas
            ]
        ]);
    }

    // --- GESTIÓN DE USUARIOS ---
    public function getUsers() {
        if (!$this->esAdmin()) return $this->failForbidden();
        
        $model = new UserModel();
        // Ocultamos passwords
        $users = $model->select('id, username, email, role, avatar, created_at')->findAll();
        return $this->respond(['data' => $users]);
    }

    public function deleteUser($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        
        $model = new UserModel();
        $admin = $this->getUserFromToken();
        if ($admin->id == $id) return $this->fail('No puedes eliminar tu propia cuenta.');

        if ($model->delete($id)) return $this->respondDeleted(['message' => 'Usuario eliminado']);
        return $this->fail('Error al eliminar');
    }

    public function updateUser() {
        if (!$this->esAdmin()) return $this->failForbidden();

        $model = new UserModel();
        $id = $this->request->getVar('id');
        $data = [];

        if ($role = $this->request->getVar('role')) $data['role'] = $role;
        // La contraseña en tu base de datos es varchar(255), perfecto para hash
        if ($pass = $this->request->getVar('password')) {
            if (strlen($pass) > 0) $data['password'] = password_hash($pass, PASSWORD_DEFAULT);
        }

        if (!empty($data) && $model->update($id, $data)) {
            return $this->respond(['message' => 'Usuario actualizado']);
        }
        return $this->fail('No se pudo actualizar');
    }

    // --- VISTA ADMIN DE EQUIPOS ---
    public function getTeamsList() {
        if (!$this->esAdmin()) return $this->failForbidden();
        
        $model = new TeamModel();
        // JOIN para ver de quién es cada equipo (nombre y email)
        // En tu SQL la FK es user_id, correcto.
        $teams = $model->select('teams.*, users.username as owner_name, users.email as owner_email')
                       ->join('users', 'users.id = teams.user_id')
                       ->orderBy('teams.created_at', 'DESC')
                       ->findAll();
        
        return $this->respond(['data' => $teams]);
    }

    public function deleteTeam($id = null) {
        if (!$this->esAdmin()) return $this->failForbidden();
        $model = new TeamModel();
        if ($model->delete($id)) return $this->respondDeleted(['message' => 'Equipo eliminado por Admin']);
        return $this->fail('Error al eliminar equipo');
    }

    // --- HELPERS PRIVADOS ---
    private function esAdmin() {
        $user = $this->getUserFromToken();
        return ($user && $user->role === 'admin');
    }

    private function getUserFromToken() {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        
        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $key = getenv('JWT_SECRET'); 
            $decoded = is_jwt_valid($token, $key);
            
            if ($decoded) {
                $data = (object) $decoded;
                $model = new UserModel();
                return $model->find($data->uid);
            }
        }
        return null;
    }
}