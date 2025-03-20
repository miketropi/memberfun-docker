import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

/**
 * A flexible popover component that can be triggered by click or hover.
 * 
 * @example
 * // Basic usage with click trigger
 * <Popover content={<div>Popover content</div>}>
 *   <button>Click me</button>
 * </Popover>
 * 
 * // Hover trigger with custom placement and offset
 * <Popover 
 *   content={<div>Tooltip content</div>}
 *   trigger="hover"
 *   placement="top"
 *   offset={12}
 *   width={200}
 * >
 *   <span>Hover me</span>
 * </Popover>
 * 
 * @param {ReactNode} children - The trigger element that will show the popover
 * @param {ReactNode} content - The content to show in the popover
 * @param {string} [placement="bottom"] - Placement of popover: "top", "bottom", "left", "right"
 * @param {number} [offset=8] - Space between trigger and popover in pixels
 * @param {string} [trigger="click"] - Trigger type: "click" or "hover"
 * @param {string} [className=""] - Additional CSS classes for the popover
 * @param {Function} [onOpen] - Callback fired when popover opens
 * @param {Function} [onClose] - Callback fired when popover closes
 * @param {number|string} [width=180] - Width of the popover in pixels or CSS units
 * @param {boolean} [isOpen] - Control popover open/closed state
 * @param {Function} [onOpenChange] - Callback when open state changes
 */

export default function Popover({ 
  children, 
  content, 
  placement = 'bottom',
  offset = 8,
  trigger = 'click', // click or hover
  className = '',
  onOpen,
  onClose,
  width = 200,
  isOpen: controlledIsOpen,
  onOpenChange
}) {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const [popoverStyles, setPopoverStyles] = useState({});
  const triggerRef = useRef(null);
  const popoverRef = useRef(null);
  const timeoutRef = useRef(null);

  const isOpen = controlledIsOpen ?? uncontrolledIsOpen;
  const setIsOpen = (nextOpen) => {
    setUncontrolledIsOpen(nextOpen);
    onOpenChange?.(nextOpen);
  };

  useEffect(() => {
    if (!isOpen) return;
    
    function updatePosition() {
      if (!triggerRef.current || !popoverRef.current) return;

      const triggerRect = triggerRef.current.getBoundingClientRect();
      const popoverRect = popoverRef.current.getBoundingClientRect();
      
      let top, left;

      switch (placement) {
        case 'top':
          top = triggerRect.top - popoverRect.height - offset;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'bottom':
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
          break;
        case 'left':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.left - popoverRect.width - offset;
          break;
        case 'right':
          top = triggerRect.top + (triggerRect.height - popoverRect.height) / 2;
          left = triggerRect.right + offset;
          break;
        default:
          top = triggerRect.bottom + offset;
          left = triggerRect.left + (triggerRect.width - popoverRect.width) / 2;
      }

      // Adjust for scroll
      top += window.scrollY;
      left += window.scrollX;

      setPopoverStyles({
        position: 'absolute',
        top: `${top}px`,
        left: `${left}px`,
        zIndex: 1000
      });
    }

    updatePosition();
    window.addEventListener('scroll', updatePosition);
    window.addEventListener('resize', updatePosition);

    return () => {
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, placement, offset]);

  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target) &&
        popoverRef.current &&
        !popoverRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleMouseEnter = () => {
    if (trigger === 'hover') {
      clearTimeout(timeoutRef.current);
      setIsOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (trigger === 'hover') {
      timeoutRef.current = setTimeout(() => setIsOpen(false), 200);
    }
  };

  const handleClick = () => {
    if (trigger === 'click') {
      setIsOpen(!isOpen);
    }
  };

  const triggerProps = {
    ref: triggerRef,
    ...(trigger === 'hover' 
      ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
      : { onClick: handleClick }
    )
  };

  return (
    <div className="relative inline-block">
      <div {...triggerProps}>
        {children}
      </div>
      {isOpen && createPortal(
        <div
          ref={popoverRef}
          style={{ ...popoverStyles, width: typeof width === 'number' ? `${width}px` : width }}
          className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700  ${className}`}
          {...(trigger === 'hover' 
            ? { onMouseEnter: handleMouseEnter, onMouseLeave: handleMouseLeave }
            : {}
          )}
        >
          {content}
        </div>,
        document.body
      )}
    </div>
  );
}
