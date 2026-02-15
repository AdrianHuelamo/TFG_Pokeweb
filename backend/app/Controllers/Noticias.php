<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\NoticiaModel;

class Noticias extends ResourceController
{
    protected $modelName = 'App\Models\NoticiaModel';
    protected $format    = 'json';
    
    protected $helpers = ['jwt'];


    public function index()
    {
        $noticias = $this->model
                         ->orderBy('destacada', 'DESC')
                         ->orderBy('created_at', 'DESC')
                         ->findAll();
        
        return $this->respond([
            'status' => 200,
            'mensaje' => 'Noticias obtenidas',
            'data' => $noticias
        ]);
    }

    public function show($id = null)
    {
        $data = $this->model->find($id);
        if (!$data) return $this->failNotFound('Noticia no encontrada');

        return $this->respond([
            'status' => 200,
            'data' => $data
        ]);
    }


    private function getUserFromToken() {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        if (!$header) $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            if (function_exists('is_jwt_valid')) {
                $decoded = is_jwt_valid($token, $secret);
                return $decoded ? (object) $decoded : null;
            }
        }
        return null;
    }


    public function create() {
    $user = $this->getUserFromToken();
    if (!$user) return $this->failUnauthorized();

    $data = $this->request->getJSON(true);
    if (!$data) $data = $this->request->getPost();

    $data['autor_id'] = $user->uid;

    if ($user->role !== 'admin') {
        $data['destacada'] = 0;
    }

    try {
        if ($this->model->insert($data)) {
            return $this->respondCreated(['status' => 201, 'mensaje' => 'Noticia creada con éxito']);
        }
        return $this->fail($this->model->errors());
    } catch (\Exception $e) {
        return $this->failServerError($e->getMessage());
    }
}
    public function update($id = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $noticia = $this->model->find($id);
        if (!$noticia) return $this->failNotFound();

        if ($user->role !== 'admin' && $noticia['autor_id'] != $user->uid) {
            return $this->failForbidden();
        }

        $data = $this->request->getJSON(true);
        if (!$data) $data = $this->request->getRawInput();

        if ($user->role !== 'admin' && isset($data['destacada'])) {
            unset($data['destacada']);
        }

        try {
            if ($this->model->update($id, $data)) {
                return $this->respond(['status' => 200, 'mensaje' => 'Actualizada']);
            }
            return $this->fail($this->model->errors());
        } catch (\Exception $e) {
            return $this->failServerError($e->getMessage());
        }
    }

    public function delete($id = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $noticia = $this->model->find($id);
        if (!$noticia) return $this->failNotFound();

        if ($user->role !== 'admin' && $noticia['autor_id'] != $user->uid) {
            return $this->failForbidden();
        }

        if ($this->model->delete($id)) {
            return $this->respondDeleted(['status' => 200, 'mensaje' => 'Eliminada']);
        }
        return $this->failServerError('Error al borrar');
    }
}