import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import {
  Shield,
  TrendingUp,
  FileText,
  Clock,
  Plus,
  Loader2,
  AlertCircle,
  CheckCircle,
  ExternalLink,
} from "lucide-react";
import { api } from "../api/client";

interface Insight {
  _id: string;
  questionId: string;
  summary: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface InsightFormData {
  questionId: string;
  summary: string;
}

export default function ManagerDashboard() {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [questions, setQuestions] = useState<{ _id: string; title: string }[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<{ _id: string; title: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setError: setFormError,
  } = useForm<InsightFormData>();

  const fetchInsights = async () => {
    setIsLoading(true);
    setError("");

    try {
      const data = await api("/api/insight", { method: "GET" });

      if (data.status) {
        setInsights(data.inSights || []);
      } else {
        setError(data.message || "Failed to fetch insights");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch insights");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchQuestions = async () => {
    try {
      const res = await api("/api/question", { method: "GET" });
      if (res.status) setQuestions(res.questions || []);
    } catch (err) {
      console.error("Failed to fetch questions", err);
    }
  };

  useEffect(() => {
    fetchQuestions()
    fetchInsights();
  }, []);

  const onSubmit = async (data: InsightFormData) => {
    setIsSubmitting(true);
    setSuccessMessage("");

    try {
      const response = await api("/api/insight", {
        method: "POST",
        body: JSON.stringify({
          questionId: data.questionId,
          summary: data.summary,
        }),
      });

      if (response.status) {
        setSuccessMessage("Insight created successfully!");
        reset();
        await fetchInsights();

        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setFormError("root", {
          message: response.message || "Failed to create insight",
        });
      }
    } catch (err: any) {
      setFormError("root", {
        message: err.message || "Failed to create insight",
      });
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="max-w-6xl mx-auto py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <Shield className="h-7 w-7 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Manager Dashboard
            </h1>
            <p className="text-gray-600">
              Create and manage insights for community questions
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">
                Total Insights
              </p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {insights.length}
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-blue-100 to-blue-200 rounded-lg">
              <TrendingUp className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">This Week</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">
                {
                  insights.filter((i) => {
                    const date = new Date(i.createdAt);
                    const now = new Date();
                    const diffInDays = Math.floor(
                      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return diffInDays <= 7;
                  }).length
                }
              </p>
            </div>
            <div className="p-3 bg-linear-to-r from-green-100 to-green-200 rounded-lg">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">Your Role</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">Manager</p>
            </div>
            <div className="p-3 bg-linear-to-r from-purple-100 to-purple-200 rounded-lg">
              <Shield className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Create Insight Form */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <Plus className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            Create New Insight
          </h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

          {/* Question Select Field */}
          <div>
            <label
              htmlFor="questionId"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Select Question
            </label>
            <select
              id="questionId"
              {...register("questionId", { required: "Please select a question" })}
              value={selectedQuestion?._id || ""}
              onChange={(e) => {
                const q = questions.find((q) => q._id === e.target.value) || null;
                setSelectedQuestion(q);
              }}
              className={`block w-full px-4 py-3 border ${errors.questionId ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
            >
              <option value="">-- Select a question --</option>
              {questions.map((q) => (
                <option key={q._id} value={q._id}>
                  {q.title.length > 60 ? q.title.slice(0, 60) + "..." : q.title}
                </option>
              ))}
            </select>
            {errors.questionId && (
              <p className="mt-2 text-sm text-red-600">{errors.questionId.message}</p>
            )}

            {/* Selected Question Preview */}
            {selectedQuestion && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200 text-sm text-gray-800 flex items-start justify-between">
                <p className="truncate flex-1">{selectedQuestion.title}</p>
                {selectedQuestion.title.length > 80 && (
                  <Link
                    to={`/questions/${selectedQuestion._id}`}
                    className="text-indigo-600 text-xs font-medium ml-3 hover:underline shrink-0"
                  >
                    View Details
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Summary Field */}
          <div>
            <label
              htmlFor="summary"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Insight Summary
            </label>
            <textarea
              id="summary"
              rows={4}
              {...register("summary", {
                required: "Summary is required",
                minLength: {
                  value: 20,
                  message: "Summary must be at least 20 characters",
                },
                maxLength: {
                  value: 500,
                  message: "Summary must not exceed 500 characters",
                },
              })}
              className={`block w-full px-4 py-3 border ${errors.summary ? "border-red-500" : "border-gray-300"
                } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
              placeholder="Provide a detailed summary or insight about this question..."
            />
            {errors.summary && (
              <p className="mt-2 text-sm text-red-600">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 shrink-0" />
              <p className="text-sm text-green-700 font-medium">
                {successMessage}
              </p>
            </div>
          )}

          {/* Form Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                <span>Creating Insight...</span>
              </>
            ) : (
              <>
                <Plus className="h-5 w-5" />
                <span>Create Insight</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Insights List */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">All Insights</h2>
          <button
            onClick={fetchInsights}
            disabled={isLoading}
            className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            <Loader2
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 shrink-0" />
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
          </div>
        )}

        {/* Insights Grid */}
        {!isLoading && insights.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {insights.map((insight) => (
              <div
                key={insight._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all p-6 border border-gray-100"
              >
                {/* Insight Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                        Question ID
                      </span>
                      <Link
                        to={`/questions/${insight.questionId}`}
                        className="text-xs text-gray-600 hover:text-indigo-600 transition-colors font-mono flex items-center gap-1"
                      >
                        {insight.questionId.slice(0, 8)}...
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>

                {/* Insight Summary */}
                <p className="text-gray-700 leading-relaxed mb-4">
                  {insight.summary}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-xs">
                      {insight.createdBy?.name?.charAt(0).toUpperCase() || "M"}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">
                        {insight.createdBy?.name || "Manager"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(insight.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!isLoading && insights.length === 0 && !error && (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-linear-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Insights Yet
            </h3>
            <p className="text-gray-600">
              Create your first insight to get started
            </p>
          </div>
        )}
      </div>
    </div>
  );
}