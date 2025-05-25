import React, { Component, ErrorInfo, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // You can also log the error to an error reporting service
    console.error("Uncaught error:", error, errorInfo);
    // Attempt to store the error message for potential retrieval later
    // Note: This might not be directly accessible if console view fails,
    // but it's good practice.
    localStorage.setItem("last_react_error", JSON.stringify({ 
        message: error.message, 
        stack: error.stack, 
        componentStack: errorInfo.componentStack 
    }));
  }

  public render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return this.props.fallback || (
        <div className="p-4 text-center text-red-500 bg-red-100 border border-red-400 rounded">
          <h2>Something went wrong.</h2>
          <p>An unexpected error occurred in this section.</p>
          {this.state.error && (
            <pre className="mt-2 text-xs text-left whitespace-pre-wrap">{
              this.state.error.message
            }</pre>
          )}
          <button 
            onClick={() => this.setState({ hasError: false, error: null })} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

