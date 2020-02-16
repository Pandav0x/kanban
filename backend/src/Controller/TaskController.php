<?php


namespace App\Controller;

use App\Entity\Project;
use App\Entity\Status;
use App\Entity\Task;
use DateTimeImmutable;
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
     * @throws \Exception
     */
    public function create(Request $request): JsonResponse
    {
        $task = new Task();
        $task->setName($request->get('name'));
        $task->setDescription($request->get('description'))
            ->setCreationDate(new DateTimeImmutable());

        $this->em->persist($task);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf(
                    '%s created (id: %d)',
                    $request->get('name'),
                    $task->getId()
                )
            ]
        );
    }

    /**
     * @Route("/{id}", methods={"GET"})
     * @param Task $task
     * @return JsonResponse
     */
    public function read(?Task $task): JsonResponse
    {
        return $this->json($task);
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
     * @Route("/{id}", methods={"PUT"})
     * @param Task|null $task
     * @param Request $request
     * @return JsonResponse
     */
    public function update(?Task $task, Request $request): JsonResponse
    {
        if($task === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No task found.'
            ]);
        }

        if(!empty($request->get('name'))){
            $task->setName($request->get('name'));
        }

        if(!empty($request->get('description'))){
            $task->setDescription($request->get('description'));
        }

        $this->em->flush();

        return new JsonResponse([
            'code' => 200,
            'message' => sprintf(
                'Task (id: %d) has been updated.',
                $task->getId()
            )
        ]);
    }

    /**
     * @Route("/{id}", methods={"DELETE"})
     * @param Task $task
     * @return JsonResponse
     */
    public function delete(?Task $task): JsonResponse
    {
        if($task === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No task found.'
            ]);
        }

        $id = $task->getId();
        $this->em->remove($task);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf('Task %d successfully deleted.', $id)
            ]
        );
    }

    /**
     * @Route("/{task}/set/status/{status}")
     * @param Task|null $task
     * @param Status|null $status
     * @return JsonResponse
     */
    public function setStatus(?Task $task, ?Status $status): JsonResponse
    {
        if($task === null || $status === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'Could not find the specified task nor status.'
            ]);
        }

        $task->setStatus($status);
        $this->em->flush();

        return new JsonResponse([
            'code' => 200,
            'message' => sprintf(
                '%d task has been set to status %s.',
                $task->getId(),
                $status->getName()
            )
        ]);
    }

    /**
     * @Route("/{task}/set/project/{project}")
     * @param Task|null $task
     * @param Project|null $project
     * @return JsonResponse
     */
    public function setProject(?Task $task, ?Project $project): JsonResponse
    {
        if($task === null || $project === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'Could not find the specified task nor project.'
            ]);
        }

        $task->setProject($project);
        $this->em->flush();

        return new JsonResponse([
            'code' => 200,
            'message' => sprintf(
                '%d task has been set to project %s.',
                $task->getId(),
                $project->getName()
            )]);
    }

    /**
     * @Route("/{id}/status")
     * @param Task $task
     * @return JsonResponse
     */
    public function getStatus(Task $task): JsonResponse
    {
        return $this->json($task->getStatus());
    }

    /**
     * @Route("/{id}/project")
     * @param Task $task
     * @return JsonResponse
     */
    public function getProject(Task $task): JsonResponse
    {
        return $this->json($task->getProject());
    }
}