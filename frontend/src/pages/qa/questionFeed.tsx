import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Search, Tag, MessageSquare, Clock, Loader2 } from "lucide-react";
import { api } from "../../api/client";

interface Question {
  _id: string;
  title: string;
  description: string;
  tags: string[];
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  answers?: any[];
}

export default function QuestionFeed() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchQuestions = async (searchQuery = q, searchTag = tag) => {
    setIsLoading(true);
    setError("");
    
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append("q", searchQuery);
      if (searchTag) params.append("tag", searchTag);
      
      const queryString = params.toString();
      const path = queryString ? `/api/question?${queryString}` : '/api/question';
      
      const data = await api(path, { method: "GET" });
      
      if (data.status) {
        setQuestions(data.questions);
      } else {
        setError(data.message || "Failed to fetch questions");
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchQuestions();
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-5xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">All Questions</h1>
        <p className="text-gray-600">Browse through community questions and find answers</p>
      </div>

      {/* Search Bar */}
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <div className="grid md:grid-cols-3 gap-4">
          {/* Search Input */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Search Questions
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by title..."
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Tag Input */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Filter by Tag
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                placeholder="e.g., javascript"
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>
          </div>
        </div>

        {/* Search Button */}
        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Search className="h-5 w-5" />
                <span>Search</span>
              </>
            )}
          </button>

          {(q || tag) && (
            <button
              type="button"
              onClick={() => {
                setQ("");
                setTag("");
                fetchQuestions("", "");
              }}
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Clear Filters
            </button>
          )}
        </div>
      </form>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      )}

      {/* Questions List */}
      {!isLoading && questions.length > 0 && (
        <div className="space-y-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
            >
              {/* Question Title */}
              <Link
                to={`/questions/${question._id}`}
                className="block group"
              >
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors mb-2">
                  {question.title}
                </h3>
              </Link>

              {/* Question Description */}
              <p className="text-gray-600 mb-4 line-clamp-2">
                {question.description}
              </p>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {question.tags.map((t) => (
                    <span
                      key={t}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-xs font-medium border border-indigo-100"
                    >
                      <Tag className="h-3 w-3" />
                      {t}
                    </span>
                  ))}
                </div>
              )}

              {/* Meta Information */}
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-4">
                  {/* Author */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {question.createdBy?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <span className="font-medium text-gray-700">
                      {question.createdBy?.name || "Anonymous"}
                    </span>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{formatDate(question.createdAt)}</span>
                  </div>

                  {/* Answers Count */}
                  {question.answers && (
                    <div className="flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" />
                      <span>
                        {question.answers.length}{" "}
                        {question.answers.length === 1 ? "answer" : "answers"}
                      </span>
                    </div>
                  )}
                </div>

                {/* View Link */}
                <Link
                  to={`/questions/${question._id}`}
                  className="flex items-center gap-1 text-indigo-600 hover:text-indigo-700 font-semibold transition-colors"
                >
                  View Details
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && questions.length === 0 && !error && (
        <div className="bg-white rounded-xl shadow-md p-12 text-center">
          <div className="w-16 h-16 bg-linear-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <MessageSquare className="h-8 w-8 text-indigo-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Questions Found
          </h3>
          <p className="text-gray-600 mb-6">
            {q || tag
              ? "Try adjusting your search filters"
              : "Be the first to ask a question!"}
          </p>
          <Link
            to="/ask"
            className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <MessageSquare className="h-5 w-5" />
            Ask a Question
          </Link>
        </div>
      )}
    </div>
  );
}