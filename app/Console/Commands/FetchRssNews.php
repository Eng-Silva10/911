<?php

/**
 * php artisan make:command FetchRssNews
 
 */

namespace App\Console\Commands;

use App\Models\News;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use SimpleXMLElement;

class FetchRssNews extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:fetch-rss-news';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Fetches news from RSS feeds, generates embeddings, and saves them to the database.';

    /**
     * A list of RSS feed URLs to process.
     *
     * @var array
     */
    protected array $rss_feeds = [
        "https://www.youm7.com/rss/SectionRss?SectionID=65", // أخبار عاجلة
        "https://www.youm7.com/rss/SectionRss?SectionID=97", // سياسة
        "https://www.youm7.com/rss/SectionRss?SectionID=203", // اقتصاد
        "https://www.youm7.com/rss/SectionRss?SectionID=298", // حوادث
        "https://www.youm7.com/rss/SectionRss?SectionID=89", // رياضة
        "https://www.youm7.com/rss/SectionRss?SectionID=94"  // فن
    ];

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting to fetch news from RSS feeds...');
        $totalAdded = 0;

        foreach ($this->rss_feeds as $feedUrl) {
            try {
                $response = Http::get($feedUrl);
                if (!$response->successful()) {
                    $this->error("Failed to fetch RSS feed: {$feedUrl}");
                    continue;
                }

                $xml = new SimpleXMLElement($response->body());
                $items = $xml->channel->item ?? [];
                
                if (empty($items)) {
                    $this->warn("No items found in feed: {$feedUrl}");
                    continue;
                }

                $this->info("Processing feed: {$feedUrl}");
                $bar = $this->output->createProgressBar(count($items));
                $bar->start();

                foreach ($items as $item) {
                    $link = (string)$item->link;

                    // تحقق من وجود الخبر بالفعل لتجنب التكرار واستهلاك الـ API
                    if (News::where('url', $link)->exists()) {
                        $bar->advance();
                        continue;
                    }

                    $title = (string)$item->title;
                    $description = strip_tags((string)$item->description);
                    $pubDate = date('Y-m-d H:i:s', strtotime((string)$item->pubDate));

                    // توليد المتجه (Embedding)
                    $embedding = $this->generateEmbedding("{$title} {$description}");

                    if ($embedding) {
                        News::create([
                            'title' => $title,
                            'description' => $description,
                            'url' => $link,
                            'pubDate' => $pubDate,
                            'embedding' => json_encode($embedding),
                            'status' => true,
                        ]);
                        $totalAdded++;
                    }
                    $bar->advance();
                }
                $bar->finish();
                $this->newLine(2);

            } catch (\Exception $e) {
                $this->error("An error occurred with feed {$feedUrl}: " . $e->getMessage());
                Log::error("RSS Fetch Error: " . $e->getMessage());
            }
        }

        $this->info("✅ Fetching complete. Added {$totalAdded} new articles.");
        return 0;
    }

    /**
     * Generates a vector embedding for a given text using Gemini API.
     *
     * @param string $text
     * @return array|null
     */
    private function generateEmbedding(string $text): ?array
    {
        $apiKey = config('services.gemini.api_key');
        if (empty($apiKey)) {
            Log::error('Gemini API key is not set in config/services.php or .env file.');
            $this->error('Gemini API key is not configured.');
            return null;
        }

        $apiUrl = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={$apiKey}";

        try {
            $response = Http::post($apiUrl, [
                'model' => 'models/text-embedding-004',
                'content' => [
                    'parts' => [['text' => $text]]
                ]
            ]);

            if ($response->successful()) {
                return $response->json('embedding.values');
            }

            Log::error('Gemini Embedding API request failed', [
                'status' => $response->status(),
                'response' => $response->body()
            ]);
            return null;

        } catch (\Exception $e) {
            Log::error('Exception during Gemini Embedding API call', ['message' => $e->getMessage()]);
            return null;
        }
    }
}
