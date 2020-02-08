<?php


namespace App\Controller;

use App\Repository\ProjectRepository;
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
     * @var ProjectRepository
     */
    private $projectRepository;

    /**
     * ProjectController constructor.
     * @param ProjectRepository $projectRepository
     */
    public function __construct(ProjectRepository $projectRepository)
    {
        parent::__construct();
        $this->projectRepository = $projectRepository;
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
     * @param string|null $id
     * @return JsonResponse
     */
    public function read(Request $request, ?string $id):JsonResponse
    {
        return $this->customRead($this->projectRepository, $id);
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