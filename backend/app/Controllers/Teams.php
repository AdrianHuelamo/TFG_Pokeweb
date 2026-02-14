<?php

namespace App\Controllers;

use CodeIgniter\RESTful\ResourceController;
use App\Models\TeamModel;
use App\Models\TeamMemberModel;

class Teams extends ResourceController
{
    protected $format = 'json';
    // Cargamos el helper de JWT explícitamente
    protected $helpers = ['jwt']; 

    // --- SOLUCIÓN ERROR UNDEFINED PROPERTY ---
    // Hemos eliminado el 'if (isset($this->request->user))' que causaba el fallo.
    // Ahora decodificamos el token directamente.
    private function getUserFromToken()
    {
        $header = $this->request->getServer('HTTP_AUTHORIZATION');
        
        // Soporte para Apache/XAMPP
        if (!$header) {
            $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        if ($header && preg_match('/Bearer\s(\S+)/', $header, $matches)) {
            $token = $matches[1];
            $secret = getenv('JWT_SECRET');
            
            // Usamos la función del helper
            $decoded = is_jwt_valid($token, $secret);
            
            // Devolvemos el objeto decodificado (con ->uid)
            return $decoded ? (object) $decoded : null;
        }
        return null;
    }

    // 1. VER MIS EQUIPOS
    public function index() {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $teamModel = new TeamModel();
        $memberModel = new TeamMemberModel();

        // Accedemos a ->uid de forma segura
        $userId = $user->uid ?? null;

        $teams = $teamModel->where('user_id', $userId)->findAll();

        // Rellenar con los pokémon
        foreach ($teams as &$team) {
            $team['members'] = $memberModel->where('team_id', $team['id'])
                                           ->orderBy('slot_order', 'ASC')
                                           ->findAll();
        }

        return $this->respond($teams);
    }

    // 2. CREAR EQUIPO
    public function create() {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $json = $this->request->getJSON();
        $name = $json->name ?? 'Nuevo Equipo';

        $teamModel = new TeamModel();
        $teamModel->insert([
            'user_id' => $user->uid,
            'name' => $name
        ]);

        return $this->respondCreated(['mensaje' => 'Equipo creado']);
    }

    // 3. BORRAR EQUIPO
    public function delete($id = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $teamModel = new TeamModel();
        $team = $teamModel->find($id);

        if ($team && $team['user_id'] == $user->uid) {
            $teamModel->delete($id);
            return $this->respondDeleted(['mensaje' => 'Equipo eliminado']);
        }
        return $this->failForbidden('No es tu equipo');
    }

    // 4. AÑADIR POKÉMON
    public function addMember() {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $json = $this->request->getJSON();
        $teamId = $json->team_id;
        $pokemonId = $json->pokemon_id;

        $teamModel = new TeamModel();
        $memberModel = new TeamMemberModel();

        $team = $teamModel->find($teamId);
        if (!$team || $team['user_id'] != $user->uid) return $this->failForbidden();

        $count = $memberModel->where('team_id', $teamId)->countAllResults();
        if ($count >= 6) return $this->fail('Equipo lleno (Máx 6)');

        $memberModel->insert([
            'team_id' => $teamId,
            'pokemon_id' => $pokemonId,
            'slot_order' => $count + 1
        ]);

        return $this->respond(['mensaje' => 'Pokémon añadido']);
    }

    public function update($id = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $json = $this->request->getJSON();
        $newName = $json->name ?? null;

        if (!$newName) return $this->fail('El nombre es obligatorio');

        $teamModel = new TeamModel();
        $team = $teamModel->find($id);

        // Seguridad: ¿Es mi equipo?
        if (!$team || $team['user_id'] != $user->uid) {
            return $this->failForbidden('No tienes permiso para editar este equipo');
        }

        $teamModel->update($id, ['name' => $newName]);

        return $this->respond(['mensaje' => 'Nombre actualizado']);
    }

    // 5. QUITAR POKÉMON
    public function removeMember($memberId = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $memberModel = new TeamMemberModel();
        $teamModel = new TeamModel();

        $member = $memberModel->find($memberId);
        if (!$member) return $this->failNotFound();

        $team = $teamModel->find($member['team_id']);
        if ($team['user_id'] != $user->uid) return $this->failForbidden();

        $memberModel->delete($memberId);
        return $this->respondDeleted(['mensaje' => 'Pokémon liberado']);
    }

    public function setFavorite($id = null) {
        $user = $this->getUserFromToken();
        if (!$user) return $this->failUnauthorized();

        $teamModel = new TeamModel();
        $team = $teamModel->find($id);

        // Seguridad: ¿Es mi equipo?
        if (!$team || $team['user_id'] != $user->uid) {
            return $this->failForbidden('No es tu equipo');
        }

        // 1. Poner TODOS los equipos de este usuario a is_favorite = 0
        $teamModel->where('user_id', $user->uid)->set(['is_favorite' => 0])->update();

        // 2. Poner ESTE equipo a is_favorite = 1
        $teamModel->update($id, ['is_favorite' => 1]);

        return $this->respond(['mensaje' => 'Equipo marcado como favorito']);
    }
}