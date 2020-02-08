<?php


namespace App\Controller;


use App\Repository\StatusRepository;
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
     * @var StatusRepository
     */
    protected $statusRepository;

    /**
     * StatusController constructor.
     * @param StatusRepository $statusRepository
     */
    public function __construct(StatusRepository $statusRepository)
    {
        parent::__construct();
        $this->statusRepository = $statusRepository;
    }

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
     * @param Request $request
     * @param string $id
     * @return JsonResponse
     */
    public function read(Request $request, ?string $id):JsonResponse
    {
        return $this->customRead($this->statusRepository, $id);
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