<?php
namespace App\Models;
use CodeIgniter\Model;

class TeamMemberModel extends Model {
    protected $table = 'team_members';
    protected $primaryKey = 'id';
    protected $allowedFields = ['team_id', 'pokemon_id', 'slot_order', 'nickname'];
}