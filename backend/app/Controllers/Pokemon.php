<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CapturaModel;

class Pokemon extends ResourceController
{
    protected $format = 'json';
    protected $helpers = ['jwt']; // Aseguramos carga del helper

    // --- FUNCIÓN SEGURA ---
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

    // 1. ALTERNAR CAPTURA
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
        
        // Acceso seguro al ID
        $userId = $user->uid ?? null;

        $existe = $capturaModel->where('user_id', $userId)
                               ->where('pokemon_id', $pokemonId)
                               ->first();

        if ($existe) {
            // Soltar
            $capturaModel->delete($existe['id']);
            return $this->respond(['status' => 'released']);
        } else {
            // Atrapar
            $capturaModel->insert([
                'user_id' => $userId,
                'pokemon_id' => $pokemonId
            ]);
            return $this->respond(['status' => 'caught']);
        }
    }

    // 2. OBTENER CAPTURAS
    public function getCapturas($userId = null)
    {
        // Si no viene ID en la URL, usamos el del token
        if (!$userId) {
            $user = $this->getUserFromToken();
            $userId = $user->uid ?? null;
        }

        if (!$userId) return $this->fail('Usuario desconocido');

        $capturaModel = new CapturaModel();
        // Seleccionamos solo la columna pokemon_id para devolver array simple
        $data = $capturaModel->select('pokemon_id')->where('user_id', $userId)->findAll();
        
        $ids = array_column($data, 'pokemon_id');

        // Nos aseguramos de devolver números enteros, no strings
        $ids = array_map('intval', $ids);

        return $this->respond($ids);
    }
}