<?php


namespace App\Command;


use App\Entity\Status;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Process\Process;

class InstallationCommand extends Command
{
    /**
     * @var string
     */
    protected static $defaultName = 'application:install';

    /**
     * InstallationCommand constructor.
     * @param null $name
     */
    public function __construct($name = null)
    {
        parent::__construct($name);
    }

    public function configure(): void
    {
        $this->setDescription('Install project with default data.');
    }

    /**
     * @param InputInterface $input
     * @param OutputInterface $output
     * @return int
     */
    public function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Installing project for [' . $_ENV['APP_ENV'] . ']');

        preg_match('/(\d{1,3}\.){3}\d{1,3}/', $_ENV['DATABASE_URL'], $matches);
        $dbIP = array_shift($matches);
        preg_match('/(?<=\:)\d{1,4}/', $_ENV['DATABASE_URL'], $matches);
        $dbPort = array_shift($matches);

        $isDatabaseOn = is_resource(@fsockopen($dbIP, $dbPort));

        if($isDatabaseOn)
        {
            $io->write(str_pad('doctrine:database:drop --force', 40));
            Process::fromShellCommandline('php bin/console doctrine:database:drop --force')->run();
            $io->writeln('<fg=green>[OK]</>');

            $io->write(str_pad('doctrine:database:create', 40));
            Process::fromShellCommandline('php bin/console doctrine:database:create')->run();
            $io->writeln('<fg=green>[OK]</>');

            $io->write(str_pad('doctrine:migration:migrate -q', 40));
            Process::fromShellCommandline('php bin/console doctrine:migration:migrate -q')->run();
            $io->writeln('<fg=green>[OK]</>');

            if($_ENV['APP_ENV'] === 'dev') {
                $io->write(str_pad('doctrine:fixtures:load -q', 40));
                Process::fromShellCommandline('php bin/console doctrine:fixtures:load -q')->run();
                $io->writeln('<fg=green>[OK]</>');
            }
        }
        $io->success('Installation complete.');

        return 0;
    }
}