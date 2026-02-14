<?php

if (!function_exists('generate_jwt')) {
    function generate_jwt($headers, $payload, $secret = 'secret') {
        $headers_encoded = base64url_encode(json_encode($headers));
        $payload_encoded = base64url_encode(json_encode($payload));
        
        $signature = hash_hmac('SHA256', "$headers_encoded.$payload_encoded", $secret, true);
        $signature_encoded = base64url_encode($signature);
        
        return "$headers_encoded.$payload_encoded.$signature_encoded";
    }
}

if (!function_exists('is_jwt_valid')) {
    function is_jwt_valid($token, $secret = 'secret') {
        $tokenParts = explode('.', $token);
        if (count($tokenParts) != 3) return false;

        $header = base64_decode($tokenParts[0]);
        $payload = base64_decode($tokenParts[1]);
        $signature_provided = $tokenParts[2];

        $expiration = json_decode($payload)->exp;
        $isTokenExpired = ($expiration - time()) < 0;

        $base64_url_header = base64url_encode($header);
        $base64_url_payload = base64url_encode($payload);
        $signature = hash_hmac('SHA256', $base64_url_header . "." . $base64_url_payload, $secret, true);
        $base64_url_signature = base64url_encode($signature);

        $isSignatureValid = ($base64_url_signature === $signature_provided);
        
        if ($isTokenExpired || !$isSignatureValid) {
            return false;
        } else {
            return json_decode($payload, true);
        }
    }
}

if (!function_exists('base64url_encode')) {
    function base64url_encode($data) {
        return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    }
}

if (!function_exists('getSignedJWTForUser')) {
    function getSignedJWTForUser($uid, $email, $role) {
        $secret = getenv('JWT_SECRET');
        
        $issuedAtTime = time();
        $tokenTimeToLive = 7200; 
        $tokenExpiration = $issuedAtTime + $tokenTimeToLive;
        
        $payload = [
            'uid' => $uid,
            'email' => $email,
            'role' => $role,
            'iat' => $issuedAtTime,
            'exp' => $tokenExpiration,
        ];
        $headers = ['typ' => 'JWT', 'alg' => 'HS256'];
        return generate_jwt($headers, $payload, $secret);
    }
}