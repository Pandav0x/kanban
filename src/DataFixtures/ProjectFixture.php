<?php


namespace App\DataFixtures;


use App\Entity\Project;
use Doctrine\Persistence\ObjectManager;

class ProjectFixture extends BaseFixture
{

    /**
     * @param ObjectManager $manager
     * @return mixed
     */
    protected function loadData(ObjectManager $manager)
    {
        $this->createMany($this->faker->numberBetween(5, 7), 'project', function(){
            $project = new Project();
            $project->setName($this->faker->sentence($this->faker->numberBetween(2, 4), false))
                ->setGitUrl($this->faker->url);

            return $project;
        });

        $manager->flush();
    }
}