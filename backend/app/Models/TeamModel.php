<?php
namespace App\Models;
use CodeIgniter\Model;

class TeamModel extends Model {
    protected $table = 'teams';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'name', 'created_at', 'is_favorite'];
}