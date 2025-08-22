import React from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  constructor(props: React.PropsWithChildren) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: unknown, info: unknown) {
    // eslint-disable-next-line no-console
    console.error('UI ErrorBoundary caught an error', { error, info });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-6">
          <div className="rounded-md border border-destructive/20 bg-destructive/5 p-4 text-sm">
            یک خطا در بارگذاری صفحه رخ داد. لطفاً صفحه را رفرش کنید.
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;


