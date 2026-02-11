<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     *
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default = [
        // CAMBIO AQUÍ: Quita el '*' y pon tu URL de Angular
        'allowedOrigins' => ['http://localhost:4200'], 
        
        'allowedOriginsPatterns' => [],
        'supportsCredentials' => true, // Esto es lo que obligaba a quitar el *
        'allowedHeaders' => ['*'],
        'exposedHeaders' => [],
        'allowedMethods' => ['GET', 'POST', 'OPTIONS', 'PUT', 'DELETE'],
        'maxAge' => 7200,
    ];
}
