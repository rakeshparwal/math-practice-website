// Enhanced MixedContentRenderer with proper error handling and performance optimizations

import React, { useMemo } from 'react';
// import MathDisplay from './MathDisplay';
import MathJaxDisplay from './MathJaxDisplay';


const MixedContentRenderer = ({ content }) => {
    // Pre-process the content before parsing or rendering
    const preprocessContent = (text) => {
      if (!text) return '';
      
      try {
        // Limit content length for safety (prevent browser hanging)
        const maxLength = 1000; // MathJax can handle longer content than KaTeX
        let processed = typeof text === 'string' ? 
                        (text.length > maxLength ? text.substring(0, maxLength) + '...' : text) : 
                        String(text);
        
        // Fix spaces in numbers
        processed = processed.replace(/(\d)\s+(\d)/g, '$1$2');
        
        // Fix decimal numbers with spaces
        processed = processed.replace(/(\d+)\s+\.\s+(\d+)/g, '$1.$2');
        
        // Fix currency symbols that got separated
        processed = processed.replace(/\$\s+(\d+)/g, '\\$$1');
        
        // The $ character is a special delimiter in MathJax, so escape it when it's used as currency
        // This safely handles currency symbols so they don't trigger math mode
        if (!/[\\{}^_]/.test(processed)) { // Only do this for non-LaTeX content
          processed = processed.replace(/\$/g, '\\$');
        }
        
        return processed;
      } catch (err) {
        console.error("Error preprocessing content:", err);
        return typeof text === 'string' ? text : String(text);
      }
    };
  
    // Detect if content is likely to be a math expression
    const isMathContent = (text) => {
      if (!text) return false;
      
      try {
        return text.includes('\\') || 
               text.includes('^') || 
               text.includes('_') ||
               text.includes('/') ||
               /\d+\s*[×÷\+\-=]\s*\d+/.test(text) ||
               /\\frac/.test(text);
      } catch (err) {
        console.error("Error detecting math content:", err);
        return false;
      }
    };
    
    // Use useMemo to avoid re-processing on every render
    const processedContent = useMemo(() => {
      try {
        if (!content) return [{ type: 'text', content: '' }];
        
        const processedText = preprocessContent(content);
        
        // Handle simple case: entire content is math or text
        if (isMathContent(processedText)) {
          return [{ type: 'math', content: processedText }];
        }
        
        return [{ type: 'text', content: processedText }];
      } catch (err) {
        console.error("Error in MixedContentRenderer:", err);
        // Return safe fallback
        return [{ type: 'text', content: String(content).substring(0, 100) + '...' }];
      }
    }, [content]);
    
    // Render with proper error handling
    return (
      <div className="mixed-content">
        {processedContent.map((segment, index) => (
          <React.Fragment key={index}>
            {segment.type === 'math' ? (
              <MathJaxDisplay expression={segment.content} display={false} />
            ) : (
              <span className="text-content">{segment.content}</span>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };
  
  export default React.memo(MixedContentRenderer);