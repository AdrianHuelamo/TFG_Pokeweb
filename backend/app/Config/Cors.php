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
    public $default = [
        'allowedOrigins'         => ['http://localhost:4200'], // Tu Angular
        'allowedOriginsPatterns' => [],
        'supportsCredentials'    => true,
        'allowedHeaders'         => ['*'], // Permitir todas las cabeceras
        'allowedMethods'         => ['*'], // Permitir todos los métodos (GET, POST, etc)
        'exposedHeaders'         => [],
        'maxAge'                 => 7200,
    ];
}
