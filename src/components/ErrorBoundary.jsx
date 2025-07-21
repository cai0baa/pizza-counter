import { Component } from 'react';
import { Pizza, RefreshCw, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for development
    console.error('Pizza Counter Error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 p-4 flex items-center justify-center">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="relative">
                <Pizza className="w-16 h-16 text-gray-300" />
                <AlertTriangle className="w-6 h-6 text-red-500 absolute -top-1 -right-1" />
              </div>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Ops! Algo deu errado 🍕💥
            </h1>
            
            <p className="text-gray-600 mb-6">
              Não se preocupe, seus dados estão seguros! Clique em reiniciar para continuar a competição.
            </p>
            
            <button
              onClick={this.handleReset}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-full flex items-center gap-2 mx-auto transform transition hover:scale-105 shadow-lg"
            >
              <RefreshCw className="w-5 h-5" />
              Reiniciar App
            </button>
            
            {/* Development error details */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left bg-gray-50 p-4 rounded-lg">
                <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                  Detalhes do erro (desenvolvimento)
                </summary>
                <pre className="text-xs text-gray-600 mt-2 whitespace-pre-wrap">
                  {this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
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

export default ErrorBoundary;