<?php


namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    protected string $apiKey;
    protected string $textGenerationUrl;
    protected string $embeddingUrl;

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        // URL for generating text
        $this->textGenerationUrl = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={$this->apiKey}";
        // URL for generating embeddings
        $this->embeddingUrl = "https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key={$this->apiKey}";
    }

    /**
     * Generates a text response from a prompt.
     */
    public function generateContent(string $prompt): string
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API key is not set.');
            return 'عذرًا، خدمة الذكاء الاصطناعي غير مُكونة بشكل صحيح.';
        }

        try {
            $response = Http::post($this->textGenerationUrl, [
                'contents' => [['parts' => [['text' => $prompt]]]]
            ]);

            if ($response->successful()) {
                return $response->json('candidates.0.content.parts.0.text', 'عذرًا، لم أتمكن من إنشاء إجابة.');
            }

            Log::error('Gemini Text Gen API request failed', [
                'status' => $response->status(), 
                'response' => $response->body()
            ]);
            return 'عذرًا، حدث خطأ أثناء التواصل مع المساعد الذكي.';

        } catch (\Exception $e) {
            Log::error('Exception during Gemini Text Gen API call', ['message' => $e->getMessage()]);
            return 'عذرًا، حدث خطأ فني. يرجى المحاولة مرة أخرى.';
        }
    }

    /**
     * Generates a vector embedding from a text.
     *
     * @param string $text
     * @return array|null
     */
    public function generateEmbedding(string $text): ?array
    {
        if (empty($this->apiKey)) {
            Log::error('Gemini API key is not set.');
            return null;
        }

        try {
            $response = Http::post($this->embeddingUrl, [
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

?>