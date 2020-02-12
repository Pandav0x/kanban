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
        $project = new Project();
        $project->setName($request->get('name'));

        $this->em->persist($project);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf(
                    '%s created (id: %d)',
                    $request->get('name'),
                    $project->getId()
                )
            ]
        );
    }

    /**
     * @Route("/{id}", methods={"GET"})
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
     * @Route("/{id}", methods={"PUT"})
     * @param Project|null $project
     * @param Request $request
     * @return JsonResponse
     */
    public function update(?Project $project, Request $request): JsonResponse
    {
        if($project === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No status found.'
            ]);
        }

        $project->setName($request->get('name'));

        $this->em->flush();

        return new JsonResponse([
            'code' => 200,
            'message' => sprintf(
                'Project (id: %d) has been updated.',
                $project->getId()
            )
        ]);
    }

    /**
     * @Route("/{id}", methods={"DELETE"})
     * @param Project|null $project
     * @return JsonResponse
     */
    public function delete(?Project $project): JsonResponse
    {
        if($project === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No project found.'
            ]);
        }

        $id = $project->getId();
        $this->em->remove($project);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf('Project %d successfully deleted.', $id)
            ]
        );
    }
}