import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { 
  MessageSquare, 
  FileText, 
  Tag, 
  Send, 
  Loader2, 
  Info,
  ArrowLeft,
  Lightbulb
} from "lucide-react";
import { api } from "../../api/client";

interface AskQuestionFormData {
  title: string;
  description: string;
  tags: string;
}

export default function AskQuestion() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch,
  } = useForm<AskQuestionFormData>();

  const title = watch("title", "");
  const description = watch("description", "");
  const tags = watch("tags", "");

  const onSubmit = async (data: AskQuestionFormData) => {
    setIsSubmitting(true);

    try {
      // Convert comma-separated tags to array
      const tagsArr = data.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      if (tagsArr.length === 0) {
        setError("tags", {
          message: "Please add at least one tag",
        });
        setIsSubmitting(false);
        return;
      }

      const response = await api("/api/question", {
        method: "POST",
        body: JSON.stringify({
          title: data.title,
          description: data.description,
          tags: tagsArr,
        }),
      });

      if (response.status) {
        // Redirect to home page or the new question
        navigate("/");
      } else {
        setError("root", {
          message: response.message || "Failed to post question",
        });
      }
    } catch (err: any) {
      setError("root", {
        message: err.message || "Failed to post question",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

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

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-3 bg-linear-to-r from-indigo-600 to-purple-600 rounded-xl shadow-lg">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Ask a Question</h1>
        </div>
        <p className="text-gray-600">
          Share your question with the community and get help from experts
        </p>
      </div>

      {/* Tips Card */}
      <div className="bg-linear-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6 mb-8">
        <div className="flex items-start gap-3">
          <Lightbulb className="h-6 w-6 text-blue-600 shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">
              Tips for a great question:
            </h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Be specific and clear in your title</li>
              <li>• Provide detailed context in the description</li>
              <li>• Add relevant tags to help others find your question</li>
              <li>• Check for similar questions before posting</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="bg-white rounded-xl shadow-xl p-8 space-y-6 border border-gray-100">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <MessageSquare className="h-4 w-4 text-indigo-600" />
              Question Title
            </label>
            <input
              id="title"
              type="text"
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 10,
                  message: "Title must be at least 10 characters",
                },
                maxLength: {
                  value: 150,
                  message: "Title must not exceed 150 characters",
                },
              })}
              className={`block w-full px-4 py-3 border ${
                errors.title ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="e.g., How do I center a div in CSS?"
            />
            <div className="flex items-center justify-between mt-2">
              {errors.title ? (
                <p className="text-sm text-red-600">{errors.title.message}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  <Info className="h-3 w-3 inline mr-1" />
                  Be specific and imagine you're asking a question to another person
                </p>
              )}
              <span className="text-xs text-gray-400">
                {title.length}/150
              </span>
            </div>
          </div>

          {/* Description Field */}
          <div>
            <label
              htmlFor="description"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <FileText className="h-4 w-4 text-indigo-600" />
              Description
            </label>
            <textarea
              id="description"
              rows={8}
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 20,
                  message: "Description must be at least 20 characters",
                },
                maxLength: {
                  value: 2000,
                  message: "Description must not exceed 2000 characters",
                },
              })}
              className={`block w-full px-4 py-3 border ${
                errors.description ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none`}
              placeholder="Include all the information someone would need to answer your question..."
            />
            <div className="flex items-center justify-between mt-2">
              {errors.description ? (
                <p className="text-sm text-red-600">
                  {errors.description.message}
                </p>
              ) : (
                <p className="text-sm text-gray-500">
                  <Info className="h-3 w-3 inline mr-1" />
                  Provide context, what you've tried, and what's not working
                </p>
              )}
              <span className="text-xs text-gray-400">
                {description.length}/2000
              </span>
            </div>
          </div>

          {/* Tags Field */}
          <div>
            <label
              htmlFor="tags"
              className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2"
            >
              <Tag className="h-4 w-4 text-indigo-600" />
              Tags
            </label>
            <input
              id="tags"
              type="text"
              {...register("tags", {
                required: "At least one tag is required",
                validate: (value) => {
                  const tagsArr = value
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean);
                  if (tagsArr.length === 0) {
                    return "Please add at least one tag";
                  }
                  if (tagsArr.length > 5) {
                    return "Maximum 5 tags allowed";
                  }
                  return true;
                },
              })}
              className={`block w-full px-4 py-3 border ${
                errors.tags ? "border-red-500" : "border-gray-300"
              } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all`}
              placeholder="javascript, react, css"
            />
            <div className="mt-2">
              {errors.tags ? (
                <p className="text-sm text-red-600">{errors.tags.message}</p>
              ) : (
                <p className="text-sm text-gray-500">
                  <Info className="h-3 w-3 inline mr-1" />
                  Separate tags with commas (e.g., javascript, react, css)
                </p>
              )}
            </div>

            {/* Tag Preview */}
            {tags && (
              <div className="flex flex-wrap gap-2 mt-3">
                {tags
                  .split(",")
                  .map((t) => t.trim())
                  .filter(Boolean)
                  .slice(0, 5)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-linear-to-r from-indigo-50 to-purple-50 text-indigo-700 rounded-full text-sm font-medium border border-indigo-100"
                    >
                      <Tag className="h-3 w-3" />
                      {tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Root Error */}
          {errors.root && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-sm text-red-600">{errors.root.message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <Link
              to="/"
              className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-semibold hover:bg-gray-50 transition-all"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-linear-to-r from-indigo-600 to-purple-600 text-white font-semibold px-8 py-3 rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  <span>Posting...</span>
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  <span>Post Question</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Guidelines Section */}
      <div className="mt-8 bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h3 className="font-semibold text-gray-900 mb-4">
          Community Guidelines
        </h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Be respectful and courteous to others</p>
          <p>• Keep your question focused on a single problem</p>
          <p>• Search for existing answers before asking</p>
          <p>• Accept helpful answers to help others in the future</p>
          <p>• Follow up with additional context if needed</p>
        </div>
      </div>
    </div>
  );
}