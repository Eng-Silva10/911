<?php


namespace App\Console\Commands;

use App\Models\News;
use App\Services\GeminiService;
use Illuminate\Console\Command;

class GenerateNewsEmbeddings extends Command
{
    protected $signature = 'app:generate-news-embeddings';
    protected $description = 'Generate vector embeddings for existing news articles';

    public function handle(GeminiService $geminiService)
    {
        $this->info('Starting to generate embeddings for news articles...');
        
        $newsToProcess = News::whereNull('embedding')->get();
        
        if ($newsToProcess->isEmpty()) {
            $this->info('No new articles to process. All embeddings are up to date.');
            return;
        }

        $bar = $this->output->createProgressBar($newsToProcess->count());
        $bar->start();

        foreach ($newsToProcess as $news) {
            $textToEmbed = $news->title . ' ' . $news->description;
            $embedding = $geminiService->generateEmbedding($textToEmbed);

            if ($embedding) {
                $news->embedding = json_encode($embedding);
                $news->saveQuietly(); // لحفظ النموذج دون إطلاق الأحداث مرة أخرى
            }
            $bar->advance();
        }

        $bar->finish();
        $this->info("\nEmbeddings generated successfully for " . $newsToProcess->count() . " articles.");
    }
}

?>