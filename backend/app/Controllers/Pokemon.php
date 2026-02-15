<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CapturaModel;

class Pokemon extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt']; 

    private function getUserFromToken()
    {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            $decoded = is_jwt_valid($token, $secret);
            return $decoded ? (object) $decoded : null;
        }
        return null;
    }

    public function toggleCatch()
    {
        $user = $this->getUserFromToken();
        
        if (!$user) {
            return $this->failUnauthorized('Sesión expirada o inválida');
        }

        $json = $this->request->getJSON();
        $pokemonId = $json->pokemon_id ?? null;

        if (!$pokemonId) return $this->fail('Falta ID Pokemon');

        $capturaModel = new CapturaModel();
        
        $userId = $user->uid ?? null;

        $existe = $capturaModel->where('user_id', $userId)
                               ->where('pokemon_id', $pokemonId)
                               ->first();

        if ($existe) {
            $capturaModel->delete($existe['id']);
            return $this->respond(['status' => 'released']);
        } else {
            $capturaModel->insert([
                'user_id' => $userId,
                'pokemon_id' => $pokemonId
            ]);
            return $this->respond(['status' => 'caught']);
        }
    }

    public function getCapturas($userId = null)
    {
        if (!$userId) {
            $user = $this->getUserFromToken();
            $userId = $user->uid ?? null;
        }

        if (!$userId) return $this->fail('Usuario desconocido');

        $capturaModel = new CapturaModel();
        $data = $capturaModel->select('pokemon_id')->where('user_id', $userId)->findAll();
        
        $ids = array_column($data, 'pokemon_id');

        $ids = array_map('intval', $ids);

        return $this->respond($ids);
    }
}