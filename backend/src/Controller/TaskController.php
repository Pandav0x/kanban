<?php


namespace App\Controller;

use App\Entity\Task;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TaskController
 * @Route("/task")
 * @package App\Controller
 */
class TaskController extends CustomController
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
     * @param Task $project
     * @return JsonResponse
     */
    public function read(?Task $project): JsonResponse
    {
        return $this->json($project);
    }

    /**
     * @Route("/", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return $this->json($this->em->getRepository(Task::class)->findAll());
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
     * @param Task $status
     * @return JsonResponse
     */
    public function delete(Task $status): JsonResponse
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