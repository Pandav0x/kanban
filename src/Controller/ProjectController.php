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
    //TODO - cleanup a bit

    /**
     * @Route("/create/", name="project_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $project = new Project();
        $project->setName($request->get('name'));

        $this->em->persist($project);
        $this->em->flush();

       return $this
           ->json(sprintf('%s created (id: %d)', $request->get('name'), $project->getId()));
    }

    /**
     * @Route("/read/{id}/", name="project_read", methods={"GET"})
     * @param Project $project
     * @return JsonResponse
     */
    public function read(?Project $project): JsonResponse
    {
        return new JsonResponse(json_decode($this->serializer->serialize($project, 'json'), true));
    }

    /**
     * @Route("/read/", name="project_read_all", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return (new JsonResponse())->setContent($this->serializer->serialize(
            $this->em->getRepository(Project::class)->findAll(),
            'json',
            ['groups' => ['jsonable']]
        ));
    }

    /**
     * @Route("/update/{id}/", name="project_update", methods={"PUT"})
     * @param Project|null $project
     * @param Request $request
     * @return JsonResponse
     */
    public function update(?Project $project, Request $request): JsonResponse
    {
        if($project === null){
            return $this->json('No status found.');
        }

        $project->setName($request->get('name'));

        $this->em->flush();

        return $this->json(sprintf('Project (id: %d) has been updated.', $project->getId()));
    }

    /**
     * @Route("/delete/{id}/", name="project_delete", methods={"DELETE"})
     * @param Project|null $project
     * @return JsonResponse
     */
    public function delete(?Project $project): JsonResponse
    {
        if($project === null){
            return $this->json('No project found.');
        }

        $id = $project->getId();
        $this->em->remove($project);
        $this->em->flush();

        return $this->json(sprintf('Project %d successfully deleted.', $id));
    }
}