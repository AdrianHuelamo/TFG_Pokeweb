<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\UserModel;
use App\Models\NoticiaModel;
use App\Models\TeamModel;
use App\Models\CapturaModel;

class Admin extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt'];

    public function dashboardStats()
    {
        $user = $this->getUserFromToken();
        if (!$user || $user->role !== 'admin') {
            return $this->failForbidden('Acceso denegado. Área restringida a Administradores.');
        }

        $userModel = new UserModel();
        $noticiaModel = new NoticiaModel();
        $teamModel = new TeamModel();
        $capturaModel = new CapturaModel();

        $stats = [
            'usuarios' => $userModel->countAll(),
            'noticias' => $noticiaModel->countAll(),
            'equipos'  => $teamModel->countAll(),
            'capturas' => $capturaModel->countAll() 
        ];

        return $this->respond([
            'status' => 200,
            'data' => $stats
        ]);
    }

    private function getUserFromToken() {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) return null;
        if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            if (function_exists('is_jwt_valid') && $decoded = is_jwt_valid($token, $secret)) {
                return (object)$decoded;
            }
        }
        return null;
    }
}