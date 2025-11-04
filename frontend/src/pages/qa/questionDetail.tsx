import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  MessageSquare,
  User,
  Clock,
  Tag,
  Send,
  Loader2,
  CheckCircle
} from "lucide-react";
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
}

interface Answer {
  _id: string;
  content: string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  isAccepted?: boolean;
}

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState<Question | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isLoggedIn = localStorage.getItem("token");

  const fetchQuestionAndAnswers = async () => {
    setIsLoading(true);
    setError("");

    try {
      // Fetch question details`/api/question?q=&id=${id}`
      const qsResponse = await api(`/api/question/${id}`, { method: "GET" });
      if (qsResponse.status) {
        setQuestion(qsResponse.question);
      }

      // Fetch answers
      const ansResponse = await api(`/api/answer/${id}`, { method: "GET" });
      if (ansResponse.status) {
        setAnswers(ansResponse.answer || []);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load question");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchQuestionAndAnswers();
    }
  }, [id]);

  const submitAnswer = async () => {
    if (!content.trim()) {
      alert("Please enter an answer");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await api("/api/answer", {
        method: "POST",
        body: JSON.stringify({ questionId: id, content }),
      });

      if (response.status) {
        // Refresh answers
        const ansResponse = await api(`/api/answer/${id}`, { method: "GET" });
        setAnswers(ansResponse.answer || []);
        setContent("");
      } else {
        alert(response.message || "Failed to post answer");
      }
    } catch (err: any) {
      alert(err.message || "Failed to post answer");
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

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-10 w-10 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !question) {
    return (
      <div className="max-w-4xl mx-auto py-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <p className="text-red-600 font-medium">
            {error || "Question not found"}
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 mt-4 text-indigo-600 hover:text-indigo-700 font-semibold"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Questions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="h-5 w-5" />
        <span className="font-medium">Back to Questions</span>
      </Link>

      {/* Question Card */}
      <div className="bg-white rounded-xl shadow-xl p-8 mb-8 border border-gray-100">
        {/* Question Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            {question.title}
          </h1>

          {/* Meta Info */}
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-linear-to-r from-indigo-600 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                {question.createdBy?.name?.charAt(0).toUpperCase() || "?"}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {question.createdBy?.name || "Anonymous"}
                </p>
                <div className="flex items-center gap-1 text-xs">
                  <Clock className="h-3 w-3" />
                  <span>{formatDate(question.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Question Description */}
        <div className="prose max-w-none mb-6">
          <p className="text-gray-700 text-lg leading-relaxed whitespace-pre-wrap">
            {question.description}
          </p>
        </div>

        {/* Tags */}
        {question.tags && question.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
            {question.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answers Section */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-6">
          <MessageSquare className="h-6 w-6 text-indigo-600" />
          <h2 className="text-2xl font-bold text-gray-900">
            {answers.length} {answers.length === 1 ? "Answer" : "Answers"}
          </h2>
        </div>

        {answers.length > 0 ? (
          <div className="space-y-4">
            {answers.map((answer) => (
              <div
                key={answer._id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all p-6 border border-gray-100"
              >
                {/* Answer Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-linear-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {answer.createdBy?.name?.charAt(0).toUpperCase() || "?"}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">
                        {answer.createdBy?.name || "Anonymous"}
                      </p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="h-3 w-3" />
                        <span>{formatDate(answer.createdAt)}</span>
                      </div>
                    </div>
                  </div>

                  {answer.isAccepted && (
                    <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      <span>Accepted</span>
                    </div>
                  )}
                </div>

                {/* Answer Content */}
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {answer.content}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">
              No answers yet. Be the first to answer!
            </p>
          </div>
        )}
      </div>

      {/* Answer Form */}
      {isLoggedIn ? (
        <div className="bg-white rounded-xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4">
            Your Answer
          </h3>

          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your answer here... Be clear and concise."
            rows={6}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
          />

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-gray-500">
              {content.length} characters
            </p>

            <button
              onClick={submitAnswer}
              disabled={isSubmitting || !content.trim()}
              className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Post Answer</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-linear-to-r from-indigo-50 to-purple-50 rounded-xl p-8 text-center border border-indigo-100">
          <p className="text-gray-700 mb-4">
            Please log in to post an answer
          </p>
          <Link
            to="/login"
            className="inline-flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all shadow-md hover:shadow-lg"
          >
            <User className="h-5 w-5" />
            <span>Login to Answer</span>
          </Link>
        </div>
      )}
    </div>
  );
}