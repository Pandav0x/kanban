<?php


namespace App\Controller;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class CustomController extends AbstractController
{
    /**
     * @var Serializer
     */
    protected $serializer;

    public function __construct()
    {
        $this->serializer = new Serializer([new ObjectNormalizer()], [new JsonEncoder()]);
    }

    public function customCreate(Request $request): JsonResponse
    {
        return new JsonResponse();
    }

    public function customRead(ServiceEntityRepository $repository, ?string $id): JsonResponse
    {
        if($id !== null && is_numeric($id)){
            $payload = $this->serializer->serialize($repository->findOneById($id), 'json');
        }
        else{
            $payload = $this->serializer->serialize($repository->findAll(), 'json');
        }

        return new JsonResponse(['code' => 200, 'data' => json_decode($payload, true)]);
    }


    public function customUpdate(Request $request):JsonResponse
    {
        return new JsonResponse();
    }

    public function customDelete(Request $request):JsonResponse
    {
        return new JsonResponse();
    }
}