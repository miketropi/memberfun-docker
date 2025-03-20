import { forwardRef, useImperativeHandle, useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { createPortal } from 'react-dom';

/**
 * Toast notification types with their corresponding styles
 * @type {Object}
 */
const TOAST_TYPES = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200',
    iconClass: 'text-green-500 dark:text-green-400'
  },
  error: {
    icon: XCircle, 
    className: 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200',
    iconClass: 'text-red-500 dark:text-red-400'
  },
  warning: {
    icon: AlertTriangle,
    className: 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200', 
    iconClass: 'text-yellow-500 dark:text-yellow-400'
  },
  info: {
    icon: Info,
    className: 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200',
    iconClass: 'text-blue-500 dark:text-blue-400'
  }
};

/**
 * Available toast position configurations
 * @type {Object}
 */
const POSITIONS = {
  'top-left': 'top-4 left-4',
  'top-center': 'top-4 left-1/2 -translate-x-1/2',
  'top-right': 'top-4 right-4',
  'bottom-left': 'bottom-4 left-4',
  'bottom-center': 'bottom-4 left-1/2 -translate-x-1/2',
  'bottom-right': 'bottom-4 right-4'
};

/**
 * Toast Component
 * 
 * @component
 * @example
 * // Basic usage
 * const toastRef = useRef();
 * 
 * // Show a success toast
 * toastRef.current.show('Operation successful!', {
 *   type: 'success',
 *   duration: 3000,
 *   position: 'top-right'
 * });
 * 
 * // Show a custom JSX toast
 * toastRef.current.show(
 *   <div className="flex items-center">
 *     <img src="icon.png" className="w-6 h-6 mr-2" />
 *     <span>Custom content</span>
 *   </div>,
 *   { type: 'info' }
 * );
 * 
 * return <Toast ref={toastRef} />;
 * 
 * @property {Object} options - Toast configuration options
 * @property {string} options.type - Toast type ('success' | 'error' | 'warning' | 'info')
 * @property {number} options.duration - Duration in milliseconds (default: 5000, use Infinity for persistent)
 * @property {string} options.position - Toast position ('top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right')
 * @property {ReactNode} message - Toast message content (string or JSX)
 */
const Toast = forwardRef((props, ref) => {
  const [toasts, setToasts] = useState([]);

  useImperativeHandle(ref, () => ({
    /**
     * Shows a new toast notification
     * @param {string|ReactNode} message - Toast message content
     * @param {Object} options - Toast configuration options
     */
    show: (message, options = {}) => {
      const id = Date.now();
      const newToast = {
        id,
        message,
        type: options.type || 'info',
        duration: options.duration || 5000,
        position: options.position || 'top-right',
        progress: 100,
        ...options
      };

      setToasts(prev => [...prev, newToast]);

      // Handle auto-close and progress
      if (newToast.duration !== Infinity) {
        const timer = setInterval(() => {
          setToasts(prev => 
            prev.map(t => 
              t.id === id 
                ? { ...t, progress: Math.max(0, t.progress - (100 / (newToast.duration / 100))) }
                : t
            )
          );
        }, 100);

        setTimeout(() => {
          clearInterval(timer);
          setToasts(prev => prev.filter(t => t.id !== id));
        }, newToast.duration);
      }
    }
  }));

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Group toasts by position
  const groupedToasts = toasts.reduce((acc, toast) => {
    if (!acc[toast.position]) {
      acc[toast.position] = [];
    }
    acc[toast.position].push(toast);
    return acc;
  }, {});

  return createPortal(
    <>
      {Object.entries(groupedToasts).map(([position, positionToasts]) => (
        <div
          key={position}
          className={`fixed z-50 flex flex-col gap-2 min-w-[320px] max-w-[420px] ${POSITIONS[position]}`}
        >
          {positionToasts.map(toast => {
            const TypeIcon = TOAST_TYPES[toast.type]?.icon;
            return (
              <div
                key={toast.id}
                className={`relative flex items-center p-4 rounded-lg border shadow-lg animate-fade-in ${TOAST_TYPES[toast.type]?.className}`}
              >
                {TypeIcon && (
                  <TypeIcon className={`w-5 h-5 mr-3 ${TOAST_TYPES[toast.type]?.iconClass}`} />
                )}
                
                <div className="flex-1 mr-2">
                  {typeof toast.message === 'string' ? (
                    <p className="text-sm font-medium">{toast.message}</p>
                  ) : (
                    toast.message
                  )}
                </div>

                <button
                  onClick={() => removeToast(toast.id)}
                  className="p-1 rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>

                {toast.duration !== Infinity && (
                  <div className="absolute bottom-0 left-0 h-1 bg-current opacity-20 rounded-full transition-all duration-100" 
                       style={{ width: `${toast.progress}%` }} />
                )}
              </div>
            );
          })}
        </div>
      ))}
    </>,
    document.body
  );
});

Toast.displayName = 'Toast';

export default Toast;

