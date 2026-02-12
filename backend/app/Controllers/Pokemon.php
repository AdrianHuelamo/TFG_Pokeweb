<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\CapturaModel;

class Pokemon extends ResourceController
{
    protected $format = 'json';

    // 1. Alternar Captura (Atrapar / Soltar)
    public function toggleCatch()
    {
        $json = $this->request->getJSON();
        
        // Validar datos
        if (!isset($json->user_id) || !isset($json->pokemon_id)) {
            return $this->fail('Faltan datos (user_id o pokemon_id).');
        }

        $capturaModel = new CapturaModel();

        // Verificar si ya lo tiene atrapado
        $existe = $capturaModel->where('user_id', $json->user_id)
                               ->where('pokemon_id', $json->pokemon_id)
                               ->first();

        if ($existe) {
            // Si existe, lo "Soltamos" (Borrar)
            $capturaModel->delete($existe['id']);
            return $this->respond([
                'status' => 'released', 
                'mensaje' => 'Pokémon soltado'
            ]);
        } else {
            // Si no existe, lo "Atrapamos" (Insertar)
            $capturaModel->insert([
                'user_id' => $json->user_id,
                'pokemon_id' => $json->pokemon_id
            ]);
            return $this->respond([
                'status' => 'caught', 
                'mensaje' => 'Pokémon atrapado'
            ]);
        }
    }

    // 2. Obtener lista de IDs atrapados por el usuario
    public function getCapturas($userId = null)
    {
        if (!$userId) return $this->fail('Usuario no especificado');

        $capturaModel = new CapturaModel();
        // Obtenemos solo la columna pokemon_id
        $data = $capturaModel->select('pokemon_id')->where('user_id', $userId)->findAll();
        
        // Limpiamos el array para devolver solo números: [1, 4, 7, 25...]
        $ids = array_column($data, 'pokemon_id');

        return $this->respond($ids);
    }
}