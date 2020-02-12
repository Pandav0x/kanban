<?php


namespace App\Controller;

use App\Entity\Project;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class ProjectController
 * @Route("/project")
 * @package App\Controller
 */
class ProjectController extends CustomController
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
     * @param Project $project
     * @return JsonResponse
     */
    public function read(?Project $project): JsonResponse
    {
        return $this->json($project);
    }

    /**
     * @Route("/", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return $this->json($this->em->getRepository(Project::class)->findAll());
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
     * @param Project $status
     * @return JsonResponse
     */
    public function delete(Project $status): JsonResponse
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