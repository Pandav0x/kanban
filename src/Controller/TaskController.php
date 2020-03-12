<?php


namespace App\Controller;

use App\Entity\Project;
use App\Entity\Status;
use App\Entity\Task;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class TaskController
 * @Route("/task")
 * @package App\Controller
 */
class TaskController extends AbstractController
{
    //TODO - cleanup a bit

    /**
     * @Route("/create/", name="task_create", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     * @throws \Exception
     */
    public function create(Request $request): JsonResponse
    {
        //TODO - Add guard
        $task = new Task();
        $task->setName($request->get('name'))
            ->setDescription($request->get('description') ?? '');

        $taskProject = $this->em->getRepository(Project::class)->findOneById($request->get('project_id'));
        $taskStatus = $this->em->getRepository(Status::class)->findOneById($request->get('status_id'));

        $task->setProject($taskProject)
            ->setStatus($taskStatus);

        $this->em->persist($task);
        $this->em->flush();

        return $this
            ->json(sprintf('%s created (id: %d)', $request->get('name'), $task->getId()));
    }

    /**
     * @Route("/read/{id}/", name="task_read", methods={"GET"})
     * @param Task $task
     * @return JsonResponse
     */
    public function read(?Task $task): JsonResponse
    {
        return $this->json($task);
    }

    /**
     * @Route("/read/", name="task_read_all", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return (new JsonResponse())->setContent($this->serializer->serialize(
            $this->em->getRepository(Task::class)->findAll(),
            'json',
            ['groups' => ['jsonable']]
        ));
    }


    /**
     * @Route("/update/{id}/", name="task_update", methods={"PUT"})
     * @param Task|null $task
     * @param Request $request
     * @return JsonResponse
     */
    public function update(?Task $task, Request $request): JsonResponse
    {
        if($task === null){
            return $this->json('No task found.');
        }

        if(!empty($request->get('name'))){
            $task->setName($request->get('name'));
        }

        if(!empty($request->get('description'))){
            $task->setDescription($request->get('description'));
        }

        $this->em->flush();

        return $this->json(sprintf('Task (id: %d) has been updated.', $task->getId()));
    }

    /**
     * @Route("/delete/{id}/", name="task_delete", methods={"DELETE"})
     * @param Task $task
     * @return JsonResponse
     */
    public function delete(?Task $task): JsonResponse
    {
        if($task === null){
            return $this->json('No task found.');
        }

        $id = $task->getId();
        $this->em->remove($task);
        $this->em->flush();

        return $this->json(sprintf('Task %d successfully deleted.', $id));
    }

    /**
     * @Route("/{task}/set/status/{status}/", name="task_set_status", methods={"GET"})
     * @param Task|null $task
     * @param Status|null $status
     * @return JsonResponse
     */
    public function setStatus(?Task $task, ?Status $status): JsonResponse
    {
        if($task === null || $status === null){
            return $this->json('', 501);
        }

        $task->setStatus($status);
        $this->em->flush();

        return $this->json('');
    }

    /**
     * @Route("/{task}/set/project/{project}/", name="task_set_project", methods={"GET"})
     * @param Task|null $task
     * @param Project|null $project
     * @return JsonResponse
     */
    public function setProject(?Task $task, ?Project $project): JsonResponse
    {
        if($task === null || $project === null){
            return $this->json('Could not find the specified task nor project.');
        }

        $task->setProject($project);
        $this->em->flush();

        return $this->json(sprintf('%d task has been set to project %s.', $task->getId(), $project->getName()));
    }

    /**
     * @Route("/{id}/status/", name="task_get_status", methods={"GET"})
     * @param Task $task
     * @return JsonResponse
     */
    public function getStatus(Task $task): JsonResponse
    {
        return $this->json($task->getStatus());
    }

    /**
     * @Route("/{id}/project/", name="task_get_project", methods={"GET"})
     * @param Task $task
     * @return JsonResponse
     */
    public function getProject(Task $task): JsonResponse
    {
        return $this->json($task->getProject());
    }
}