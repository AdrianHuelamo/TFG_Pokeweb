<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;

class AuthFilter implements FilterInterface
{
    public function before(RequestInterface $request, $arguments = null)
    {
        helper('jwt');

        $header = $request->getServer('HTTP_AUTHORIZATION');
        
        if(!$header) {
            $header = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'] ?? null;
        }

        $token = null;

        if(!empty($header)) {
            if (preg_match('/Bearer\s(\S+)/', $header, $matches)) {
                $token = $matches[1];
            }
        }

        if(is_null($token) || empty($token)) {
            return \Config\Services::response()
                        ->setJSON(['error' => 'Acceso denegado. Token requerido.'])
                        ->setStatusCode(401);
        }

        $secret = getenv('JWT_SECRET');
        $userData = is_jwt_valid($token, $secret);

        if (!$userData) {
            return \Config\Services::response()
                        ->setJSON(['error' => 'Token inválido o expirado.'])
                        ->setStatusCode(401);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        
    }
}