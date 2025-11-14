import { useNavigate, useRouteError } from "react-router";
import { useUser } from "@clerk/clerk-react";
import { Home, ArrowLeft, AlertTriangle, FileQuestion } from "lucide-react";

const ErrorPage = () => {
  const navigate = useNavigate();
  const { isSignedIn, isLoaded } = useUser();

  let error = null;
  let isErrorBoundary = false;

  try {
    error = useRouteError();
    isErrorBoundary = true; // we're in error boundary
  } catch (e) {
    // this is a regular 404 from catch-all route
    isErrorBoundary = false;
  }

  let is404 = false;
  let errorTitle = "Something Went Wrong";
  let errorMessage =
    "An unexpected error occurred. Don't worry, our team has been notified and we're working on it.";
  let errorDetails = null;

  if (isErrorBoundary && error) {
    // error thrown and caught by error boundary
    console.error("Error boundary caught:", error);

    // check if it's a Response object (thrown by our validation code)
    if (error instanceof Response) {
      is404 = error.status === 404;
      errorTitle = is404 ? "Page Not Found" : `Error ${error.status}`;
      errorMessage = error.statusText || errorMessage;
    }
    // check if error has status property (route error)
    else if (error?.status === 404) {
      is404 = true;
      errorTitle = "Page Not Found";
      errorMessage =
        error.statusText || "The page you're looking for doesn't exist.";
    }
    // regular JS rrror
    else if (error instanceof Error) {
      errorTitle = "Something Went Wrong";
      errorMessage = "An unexpected error occurred while loading this page.";
      errorDetails = error.message;
    }
    // unknown error type
    else {
      errorDetails = error?.message || String(error);
    }
  } else {
    // no error object - this is a catch-all 404 route
    is404 = true;
    errorTitle = "Page Not Found";
    errorMessage =
      "The page you're looking for doesn't exist. It might have been moved or deleted.";
  }

  const handleGoHome = () => {
    navigate(isSignedIn ? "/dashboard" : "/");
  };

  const handleGoBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      handleGoHome();
    }
  };

  return (
    <main className="min-h-screen bg-base-300 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Error card */}
        <div className="card bg-base-100 shadow-2xl">
          <section className="card-body items-center text-center p-6 sm:p-8 md:p-12 space-y-6">
            {/* Error icon */}
            <div className="size-20 sm:size-24 bg-error/10 rounded-2xl flex items-center justify-center">
              {is404 ? (
                <FileQuestion className="size-10 sm:size-12 text-error" />
              ) : (
                <AlertTriangle className="size-10 sm:size-12 text-error" />
              )}
            </div>

            {/* Error code badge */}
            <div className="badge badge-error badge-lg gap-2">
              <span className="font-mono font-bold">
                {is404 ? "404" : "ERROR"}
              </span>
            </div>

            {/* Error title */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold">
              {errorTitle}
            </h1>

            {/* Error message */}
            <p className="text-base-content/70 text-sm sm:text-base md:text-lg max-w-md">
              {errorMessage}
            </p>

            {/* Technical error details (only for non-404 errors) */}
            {errorDetails && !is404 && (
              <div className="w-full max-w-lg">
                <div className="collapse collapse-arrow bg-base-200">
                  <input type="checkbox" />

                  <div className="collapse-title text-sm font-medium">
                    Technical Details
                  </div>

                  <div className="collapse-content">
                    <code className="text-xs text-error break-all">
                      {errorDetails}
                    </code>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto pt-4">
              <button
                type="button"
                onClick={handleGoBack}
                className="btn btn-outline btn-sm sm:btn-md gap-2"
              >
                <ArrowLeft className="size-4" />
                <span className="capitalize">Go Back</span>
              </button>

              {isLoaded && (
                <button
                  type="button"
                  onClick={handleGoHome}
                  className="btn btn-primary btn-sm sm:btn-md gap-2"
                >
                  <Home className="size-4" />
                  <span className="capitalize">
                    {isSignedIn ? "Go to Dashboard" : "Go to Home"}
                  </span>
                </button>
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default ErrorPage;
