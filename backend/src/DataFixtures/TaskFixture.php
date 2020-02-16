<?php


namespace App\DataFixtures;

use App\Entity\Task;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use \DateTimeImmutable;

class TaskFixture extends BaseFixture implements DependentFixtureInterface
{

    /**
     * @param ObjectManager $manager
     * @return mixed
     */
    protected function loadData(ObjectManager $manager)
    {
        $this->createMany($this->faker->numberBetween(50, 100), 'task', function(){
            $task = new Task();
            $task->setName($this->faker->sentence($this->faker->numberBetween(4, 8), false))
                ->setCreationDate(DateTimeImmutable::createFromMutable($this->faker->dateTime()))
                ->setDescription($this->faker->sentence($this->faker->numberBetween(50, 200), false))
                ->setStatus($this->getRandomReference('status'))
                ->setProject($this->getRandomReference('project'));

            return $task;
        });

        $manager->flush();
    }

    /**
     * This method must return an array of fixtures classes
     * on which the implementing class depends on
     *
     * @return array class-string[]
     */
    public function getDependencies(): array
    {
        return [
            ProjectFixture::class,
            StatusFixture::class
        ];
    }
}