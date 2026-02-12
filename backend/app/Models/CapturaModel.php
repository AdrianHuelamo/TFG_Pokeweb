<?php

namespace App\Models;

use CodeIgniter\Model;

class CapturaModel extends Model
{
    protected $table = 'user_capturas';
    protected $primaryKey = 'id';
    protected $allowedFields = ['user_id', 'pokemon_id', 'fecha_captura'];
}