<?php


namespace App\Controller;

use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\Encoder\JsonEncoder;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;


class CustomController extends AbstractController
{
    /**
     * @var Serializer
     */
    protected $serializer;

    /**
     * @var EntityManagerInterface
     */
    protected $em;

    protected $repository;

    public function __construct()
    {
        $encoder = new JsonEncoder();
        $defaultContext = [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => static function ($object, $format, $context) {
                return $object->getName();
            },
        ];
        $normalizer = new ObjectNormalizer(null, null, null, null, null, null, $defaultContext);

        $this->serializer = new Serializer([$normalizer], [$encoder]);
    }

    /**
     * @required
     * @param EntityManagerInterface $em
     */
    public function setEntityManager(EntityManagerInterface $em): void
    {
        $this->em = $em;
    }

    /**
     * @param Request $request
     * @param ServiceEntityRepository $repository
     * @return JsonResponse
     */
    public function createEntry(Request $request, ServiceEntityRepository $repository): JsonResponse
    {
        return new JsonResponse();
    }

    /**
     * @param ServiceEntityRepository $repository
     * @param int|null $id
     * @return JsonResponse
     */
    public function getAll(ServiceEntityRepository $repository, ?int $id): JsonResponse
    {
        if($id !== null){
            $payload = $this->serializer->serialize($repository->findOneById($id), 'json');
        } else {
            $payload = $this->serializer->serialize($repository->findAll(), 'json');
        }

        return new JsonResponse(['code' => 200, 'data' => json_decode($payload, true)]);
    }

    /**
     * @param Request $request
     * @param ServiceEntityRepository $repository
     * @param string|null $id
     * @return JsonResponse
     */
    public function updateEntry(Request $request, ServiceEntityRepository $repository, ?string $id): JsonResponse
    {
        if($id !== null && is_numeric($id)){
            $payload = $this->serializer->serialize($repository->findOneById($id), 'json');
        } else {
            $payload = $this->serializer->serialize($repository->findAll(), 'json');
        }

        return new JsonResponse();
    }

    /**
     * @param ServiceEntityRepository $repository
     * @param string|null $id
     * @return JsonResponse
     */
    public function deleteEntry(ServiceEntityRepository $repository, ?string $id): JsonResponse
    {
        return new JsonResponse();
    }
}