<?php

namespace App\Tests\Functional;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApplicationAvailabilityTest extends WebTestCase
{
    //TODO - add fixture loading only for this test folder

    /** @dataProvider urlProvider */
    public function testPageIsSucessful($url)
    {
        $this->markTestIncomplete('Implements test is page successful');
    }

    public function urlProvider()
    {
        yield ['/'];
        yield ['/project/create'];
        yield ['/project/read'];
        yield ['/project/'];
        yield ['/project/'];
        yield ['/project/'];
    }
}