<?php


namespace App\DataFixtures;


use App\Entity\Status;
use Doctrine\Persistence\ObjectManager;

class StatusFixture extends BaseFixture
{

    /**
     * @param ObjectManager $manager
     * @return mixed
     */
    protected function loadData(ObjectManager $manager)
    {
        $this->createMany($this->faker->numberBetween(3, 5), 'status', function(){
            $status = new Status();
            $status->setName($this->faker->word);

            return $status;
        });

        $manager->flush();
    }
}