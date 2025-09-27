<?php

namespace App\Http\Controllers;

use App\Models\News;
use App\Models\SearchLog;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;

class SearchController extends Controller
{
    // ملاحظة: لكي يعمل هذا الكود بشكل كامل، يجب أن يكون لديك خدمة GeminiService
    // وعمود embedding في جدول news من نوع JSON أو TEXT.
    protected GeminiService $geminiService;

    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * @OA\Get(
     * path="/api/search",
     * summary="Search for news articles using a hybrid keyword and semantic search.",
     * @OA\Parameter(name="q", in="query", required=true, @OA\Schema(type="string")),
     * @OA\Response(response=200, description="Successful operation"),
     * @OA\Response(response=400, description="Invalid query")
     * )
     */
    public function search(Request $request)
    {
        $request->validate(['q' => 'required|string|max:255']);
        $query = $request->input('q');
        Log::info('New AI search initiated', ['query' => $query]);

        $this->logSearchQuery($query);

        // 1. Generate embedding for the user's query
        $queryVector = $this->geminiService->generateEmbedding($query);

        if (!$queryVector) {
            Log::error('Failed to generate embedding for the query.', ['query' => $query]);
            return response()->json([
                'answer' => 'عذرًا، لم نتمكن من فهم سؤالك.',
                'source' => 'error',
                'references' => []
            ]);
        }
        
        // 2. Perform Hybrid Search (Keyword + Semantic)
        $keywordResults = $this->keywordSearch($query);
        $semanticResults = $this->semanticSearch($queryVector);

        // 3. Combine and rank results using Reciprocal Rank Fusion (RRF)
        $combinedResults = $this->combineAndRankResults($keywordResults, $semanticResults);

        Log::info('Combined and ranked search results', ['results' => $combinedResults->toArray()]);

        // 4. Decide if the results are relevant enough
        if ($combinedResults->isNotEmpty()) { 
            Log::info('Relevant results found. Generating answer from context.');
            return $this->generateAnswerFromDatabase($query, $combinedResults);
        } else {
            Log::info('No relevant results found. Generating answer from general knowledge.');
            return $this->generateAnswerFromGeneralKnowledge($query);
        }
    }

    /**
     * Performs a keyword-based full-text search.
     * يتطلب وجود فهرس FULLTEXT على عمودي title و description
     */
    private function keywordSearch(string $query): Collection
    {
        return News::select(['id', 'title', 'description', 'url'])
            ->whereFullText(['title', 'description'], $query)
            ->limit(10)
            ->get();
    }

    /**
     * Performs a semantic vector-based search.
     * ملاحظة: هذه الدالة تتطلب وجود دالة cosine_similarity في قاعدة البيانات
     * أو استخدام قاعدة بيانات متخصصة في البحث عن المتجهات (vector database)
     */
    private function semanticSearch(array $queryVector): Collection
    {
        $queryVectorJson = json_encode($queryVector);
        
        return News::select('id', 'title', 'description', 'url', DB::raw("cosine_similarity(embedding, '{$queryVectorJson}') AS similarity"))
            ->whereNotNull('embedding')
            ->orderBy('similarity', 'desc')
            ->limit(10)
            ->get();
    }

    /**
     * Combines results from keyword and semantic searches using Reciprocal Rank Fusion (RRF).
     */
    private function combineAndRankResults(Collection $keyword, Collection $semantic): Collection
    {
        $scores = [];
        $k = 60; // RRF ranking constant

        // Process keyword results
        foreach ($keyword as $rank => $item) {
            $scores[$item->id]['item'] = $item;
            $scores[$item->id]['score'] = ($scores[$item->id]['score'] ?? 0) + (1 / ($k + $rank + 1));
        }

        // Process semantic results
        foreach ($semantic as $rank => $item) {
            // Only consider results with a minimum similarity score
            if (isset($item->similarity) && $item->similarity > 0.7) {
                $scores[$item->id]['item'] = $item;
                $scores[$item->id]['score'] = ($scores[$item->id]['score'] ?? 0) + (1 / ($k + $rank + 1));
            }
        }

        // Sort by the combined RRF score in descending order
        uasort($scores, function ($a, $b) {
            return $b['score'] <=> $a['score'];
        });

        // Extract the items and return the top 5
        return collect(array_column($scores, 'item'))->take(5);
    }

    /**
     * Generates a context-aware answer from database results.
     */
    private function generateAnswerFromDatabase(string $query, Collection $results): \Illuminate\Http\JsonResponse
    {
        $context = "بناءً على المعلومات التالية فقط من قاعدة بياناتنا المتعلقة بمصر، قم بصياغة إجابة واضحة وموجزة باللغة العربية على سؤال المستخدم. اذكر أهم النقاط أولاً.\n\n--- السياق ---\n";
        foreach ($results as $result) {
            $context .= "العنوان: " . $result->title . "\n";
            $context .= "الوصف: " . $result->description . "\n---\n";
        }
        $answer = $this->geminiService->generateContent($context . "\nسؤال المستخدم: " . $query);
        // ملاحظة: هذا هو كود وهمي. يجب استدعاء API لـ GeminiService
        // $answer = "إجابة محاكى من قاعدة البيانات لسؤال: " . $query;

        return response()->json([
            'answer' => $answer,
            'source' => 'database',
            'references' => $results->pluck('title', 'url')
        ]);
    }

    /**
     * Generates a general knowledge answer when no database results are found.
     */
    private function generateAnswerFromGeneralKnowledge(string $query): \Illuminate\Http\JsonResponse
    {
        // ملاحظة: هذا هو كود وهمي. يجب استدعاء API لـ GeminiService
        // $answer = 'هذه المعلومة من الذكاء الاصطناعي وقد تحتمل الخطأ.' . ' إجابة محاكى من المعرفة العامة لسؤال: ' . $query;
        $prompt = "المعلومات المطلوبة غير متوفرة في قاعدة بياناتنا. أجب على سؤال المستخدم التالي من معرفتك العامة مع التركيز على المعلومات المتعلقة بمصر. يجب أن تبدأ إجابتك بهذا التنبيه الواضح: 'هذه المعلومة من الذكاء الاصطناعي وقد تحتمل الخطأ.'.\n\nسؤال المستخدم: " . $query;
        $answer = $this->geminiService->generateContent($prompt);

        return response()->json([
            'answer' => $answer,
            'source' => 'ai',
            'references' => []
        ]);
    }

    /**
     * Logs the search query for tracking and analysis.
     */
    private function logSearchQuery(string $keyword): void
    {
        // استخدام firstOrNew لضمان عدم حدوث خطأ عند الإدخال أو التحديث
        $log = SearchLog::firstOrNew(['keyword' => $keyword]);
        $log->count = $log->exists ? $log->count + 1 : 1;
        $log->last_search = now();
        $log->save();
    }
}
