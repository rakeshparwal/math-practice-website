// MathJaxDisplay.jsx - A component for rendering math expressions with MathJax

import React, { useEffect, useRef, useState } from 'react';

const MathJaxDisplay = ({ expression, display = false }) => {
    const containerRef = useRef(null);
    const [renderError, setRenderError] = useState(null);
    const [isRendered, setIsRendered] = useState(false);

    useEffect(() => {
        // Clear previous error state
        setRenderError(null);
        setIsRendered(false);
        
        if (!containerRef.current || !expression) return;
        
        // Function to render math with MathJax
        const renderMath = async () => {
            try {
                // Prepare the expression
                let mathExpression = expression.trim();
                
                // If it's display mode, wrap in display math delimiters if not already wrapped
                if (display && !mathExpression.startsWith('$$') && !mathExpression.startsWith('\\[')) {
                    mathExpression = `$$${mathExpression}$$`;
                } 
                // If it's inline mode, wrap in inline math delimiters if not already wrapped
                else if (!display && !mathExpression.startsWith('$') && !mathExpression.startsWith('\\(')) {
                    // Check if this appears to be a math expression
                    const containsMath = /[\\{}^_]/.test(mathExpression) || 
                                        /\\frac/.test(mathExpression) ||
                                        /[+\-=<>]/.test(mathExpression);
                    
                    if (containsMath) {
                        mathExpression = `$${mathExpression}$`;
                    }
                }
                
                // Set the content to the container
                containerRef.current.textContent = mathExpression;
                
                // Process the math with MathJax if it's available
                if (window.MathJax) {
                    // Set a timeout to prevent hanging
                    const renderTimeout = setTimeout(() => {
                        setRenderError('Math rendering timed out');
                    }, 1000);
                    
                    try {
                        await window.MathJax.typesetPromise([containerRef.current]);
                        clearTimeout(renderTimeout);
                        setIsRendered(true);
                    } catch (err) {
                        clearTimeout(renderTimeout);
                        console.error('MathJax rendering error:', err);
                        setRenderError('Failed to render math expression');
                        
                        // Fallback to plain text
                        containerRef.current.textContent = expression;
                    }
                } else {
                    // If MathJax is not available, just display as text
                    console.warn('MathJax not available for rendering');
                }
            } catch (err) {
                console.error('Error in math rendering:', err);
                setRenderError('Error processing math expression');
                
                // Fallback to plain text
                if (containerRef.current) {
                    containerRef.current.textContent = expression;
                }
            }
        };
        
        // Execute the rendering
        renderMath();
        
        // Cleanup function
        return () => {
            // Any cleanup needed for MathJax rendering
        };
    }, [expression, display]);

    return (
        <span className="math-container">
            <span ref={containerRef} className={`mathjax-display ${display ? 'display-mode' : 'inline-mode'}`} />
            {renderError && (
                <span className="math-error" style={{ color: '#999', fontSize: '0.8em', marginLeft: '5px' }}>
                    (Error rendering math)
                </span>
            )}
        </span>
    );
};

export default MathJaxDisplay;