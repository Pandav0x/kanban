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
    //TODO - cleanup a bit

    /**
     * @Route("/", methods={"POST"})
     * @param Request $request
     * @return JsonResponse
     */
    public function create(Request $request): JsonResponse
    {
        $status = new Status();
        $status->setName($request->get('name'));

        $this->em->persist($status);
        $this->em->flush();

        return new JsonResponse(
            [
                'code' => 200,
                'message' => sprintf(
                    '%s created (id: %d)',
                    $request->get('name'),
                    $status->getId()
                )
            ]
        );
    }

    /**
     * @Route("/{id}", methods={"GET"})
     * @param Status $status
     * @return JsonResponse
     */
    public function read(?Status $status): JsonResponse
    {
        if($status === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No status found.'
            ]);
        }
        return $this->json($status);
    }

    /**
     * @Route("/", methods={"GET"})
     * @return JsonResponse
     */
    public function readAll(): JsonResponse
    {
        return (new JsonResponse())->setContent($this->serializer->serialize(
            $this->em->getRepository(Status::class)->findAll(),
            'json',
            ['groups' => ['jsonable']]
        ));
    }

    /**
     * @Route("/{id}", methods={"PUT"})
     * @param Status $status
     * @param Request $request
     * @return JsonResponse
     */
    public function update(?Status $status, Request $request): JsonResponse
    {
        if($status === null){
            return new JsonResponse([
                'code' => 404,
                'message' => 'No status found.'
            ]);
        }

        $status->setName($request->get('name'));

        $this->em->flush();

        return new JsonResponse([
            'code' => 200,
            'message' => sprintf(
                'Status (id: %d) has been updated.',
                $status->getId()
            )
        ]);
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
                'message' => sprintf('Status %d successfully deleted.', $id)
            ]
        );
    }

    /**
     * @Route("/{id}/task", methods={"GET"})
     * @param Status $status
     * @return JsonResponse
     */
    public function getTask(Status $status): JsonResponse
    {
        return new JsonResponse(json_decode($this->serializer->serialize($status->getTasks(), 'json'), true));
    }
}