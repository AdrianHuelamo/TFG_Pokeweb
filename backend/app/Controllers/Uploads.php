<?php namespace App\Controllers;
use CodeIgniter\RESTful\ResourceController;

class Uploads extends ResourceController {
    protected $helpers = ['jwt']; 

    public function noticia() {
        $rules = [
            'image' => 'uploaded[image]|is_image[image]|max_size[image,5120]'
        ];
        if (!$this->validate($rules)) {
            return $this->failValidationErrors($this->validator->getErrors());
        }

        $file = $this->request->getFile('image');
        $path = FCPATH . 'uploads/noticias/';
        if (!is_dir($path)) mkdir($path, 0777, true);

        try {
            $newName = $file->getRandomName();
            $file->move($path, $newName);
            return $this->respond(['url' => 'uploads/noticias/' . $newName]);
        } catch (\Throwable $e) {
            return $this->failServerError($e->getMessage());
        }
    }
}