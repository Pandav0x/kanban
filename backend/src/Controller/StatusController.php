<?php


namespace App\Controller;


use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Class StatusController
 * @Route("/status")
 * @package App\Controller
 */
class StatusController extends AbstractController
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
     * @Route("/", methods={"GET"})
     * @param Request $request
     * @return JsonResponse
     */
    public function read(Request $request):JsonResponse
    {
        return new JsonResponse(['code' => 200]);
    }

    /**
     * @Route("/", methods={"PUT"})
     * @param Request $request
     * @return JsonResponse
     */
    public function update(Request $request):JsonResponse
    {
        return new JsonResponse();
    }

    /**
     * @Route("/", methods={"DELETE"})
     * @param Request $request
     * @return JsonResponse
     */
    public function delete(Request $request):JsonResponse
    {
        return new JsonResponse();
    }
}