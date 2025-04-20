// ExplanationProcessor.jsx - Math-focused version for fraction explanations

/**
 * Processes math explanation text to fix common formatting issues
 * @param {string} text - The explanation text to process
 * @return {string} - The processed text with proper spacing and formatting
 */
const processExplanationText = (text) => {
    if (!text) return '';
    
    // First identify and temporarily protect LaTeX expressions
    const latexExpressions = [];
    let protectedText = text;
    
    // Find and protect LaTeX expressions with frac, text, etc.
    const latexRegex = /\\[a-zA-Z]+(\{[^{}]*\})+/g;
    protectedText = protectedText.replace(latexRegex, (match) => {
      const placeholder = `__LATEX_${latexExpressions.length}__`;
      latexExpressions.push(match);
      return placeholder;
    });
    
    // Known math words that might appear in explanations
    const mathWords = [
      "multiply", "divide", "add", "subtract", "fraction", "decimal", 
      "numerator", "denominator", "reciprocal", "equation", "proportion",
      "cross", "simplify", "factor", "expand", "solve", "calculate",
      "form", "simplified", "the", "by", "of", "to", "in", "is", "are",
      "for", "with", "from", "and", "or", "set", "up", "both", "sides"
    ];
    
    // Sort by length (longest first) to avoid partial matches
    mathWords.sort((a, b) => b.length - a.length);
    
    // Create a regex pattern from math words
    const mathWordPattern = new RegExp(mathWords.join("|"), "gi");
    
    // Function to find and separate math words in a string
    const separateMathWords = (str) => {
      // Start with the input string
      let result = str;
      let lastResult = "";
      
      // Keep processing until no more changes are made
      while (result !== lastResult) {
        lastResult = result;
        
        // Find math words and add spaces around them
        result = result.replace(mathWordPattern, (match) => ` ${match} `);
        
        // Find and separate number+variable patterns (like 5x)
        result = result.replace(/(\d+)([a-zA-Z])/g, '$1 $2');
        
        // Find and separate variable+number patterns (like x5)
        result = result.replace(/([a-zA-Z])(\d+)/g, '$1 $2');
      }
      
      return result;
    };
    
    // Process the text with LaTeX parts protected
    let processed = separateMathWords(protectedText);
    
    // Fix missing spaces after punctuation
    processed = processed.replace(/([.:,;])([a-zA-Z0-9])/g, '$1 $2');
    
    // Fix missing spaces in math operations (but not in decimal numbers)
    processed = processed.replace(/([0-9])([=+\-×÷])/g, '$1 $2');
    processed = processed.replace(/([=+\-×÷])([0-9])/g, '$1 $2');
    
    // Fix missing spaces in fraction notation
    processed = processed.replace(/(\d+)\/(\d+)/g, '$1 / $2');
    
    // Fix decimal numbers that got spaces inserted (like "0. 75" → "0.75")
    processed = processed.replace(/(\d+)\s+\.\s+(\d+)/g, '$1.$2');
    
    // Fix currency symbols that got separated
    processed = processed.replace(/\$\s+(\d+)/g, '$$$1');
    
    // Fix multiple spaces (created by our replacements)
    processed = processed.replace(/\s+/g, ' ');
    
    // Trim extra spaces
    processed = processed.trim();
    
    // Now restore the LaTeX expressions
    latexExpressions.forEach((latex, index) => {
      processed = processed.replace(`__LATEX_${index}__`, latex);
    });
    
    return processed;
  };
  
  // Export the function to use in quiz components
  export default processExplanationText;