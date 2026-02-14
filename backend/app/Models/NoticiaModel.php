<?php

namespace App\Models;

use CodeIgniter\Model;

class NoticiaModel extends Model
{
    protected $table            = 'noticias';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $allowedFields = ['titulo', 'resumen', 'contenido', 'imagen', 'created_at', 'destacada', 'autor_id'];    
    protected $useTimestamps = false; 
}