<?php


namespace App\Controller;


use App\Entity\Status;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class StatusController
 * @Route("/status")
 * @package App\Controller
 */
class StatusController extends CustomController
{
    /**
     * @Route("/", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        return new JsonResponse();
    }

    /**
     * @Route("/{id}", defaults={"id"=null}, methods={"GET"})
     * @param Status $status
     * @return JsonResponse
     */
    public function read(?Status $status): JsonResponse
    {
        return $this->json($status);
    }

    /**
     * @Route("/", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return $this->json($this->em->getRepository(Status::class)->findAll());
    }

    /**
     * @Route("/", methods={"PUT"})
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request): JsonResponse
    {
        return new JsonResponse();
    }

    /**
     * @Route("/{id}", methods={"DELETE"})
     * @param Status $status
     * @return JsonResponse
     */
    public function delete(Status $status): JsonResponse
    {
        $id = $status->getId();
        $this->em->remove($status);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf('%d successfully deleted.', $id)
            ]
        );
    }
}