import React from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { logger } from '../lib/logger';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    logger.error('ErrorBoundary', 'Global uncaught error caught by boundary', error, {
      componentStack: errorInfo?.componentStack,
    });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  handleReload = () => {
    window.location.hash = '#home';
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen bg-cream flex items-center justify-center p-4 sm:p-6 selection:bg-blush selection:text-burgundy-deep">
          <div className="max-w-lg w-full bg-paper rounded-3xl p-6 sm:p-10 border border-burgundy/15 shadow-craft-modal text-center space-y-6">
            {/* Visual Icon */}
            <div className="w-16 h-16 rounded-full bg-blush flex items-center justify-center text-burgundy mx-auto shadow-sm">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-rose-deep uppercase tracking-wider block">
                Something Went Unexpectedly Wrong
              </span>
              <h1 className="font-serif text-2xl sm:text-3xl font-medium text-burgundy-deep">
                We're fixing this memory
              </h1>
              <p className="text-xs sm:text-sm text-ink-soft leading-relaxed max-w-sm mx-auto">
                An unexpected error occurred while rendering this page. Your orders and saved items are safe.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReset}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-burgundy hover:bg-burgundy-deep text-cream px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-craft-soft transition-all cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Try Again</span>
              </button>

              <button
                type="button"
                onClick={this.handleReload}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-cream hover:bg-paper text-burgundy-deep border border-burgundy/20 px-6 py-3 rounded-full font-bold text-xs sm:text-sm shadow-xs transition-all cursor-pointer"
              >
                <Home className="w-4 h-4 text-burgundy" />
                <span>Return to Home</span>
              </button>
            </div>

            {/* Collapsible Details in Dev Mode */}
            {import.meta.env.DEV && this.state.error && (
              <details className="mt-4 text-left bg-cream-deep/60 p-3 rounded-xl border border-burgundy/10 text-xs">
                <summary className="font-bold text-burgundy cursor-pointer select-none">
                  Debug Error Details
                </summary>
                <pre className="mt-2 text-[10px] text-ink overflow-x-auto whitespace-pre-wrap">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
