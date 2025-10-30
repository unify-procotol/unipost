"use client";

import React, { useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import mermaid from 'mermaid';
import ReactECharts from 'echarts-for-react';
import 'katex/dist/katex.min.css';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

// Helper function to check if JSON is complete
function isJsonComplete(str: string): boolean {
  if (!str || str.trim().length < 2) return false;
  
  const trimmed = str.trim();
  if (!trimmed.startsWith('{') || !trimmed.endsWith('}')) return false;
  
  let depth = 0;
  let inString = false;
  let escapeNext = false;
  
  for (let i = 0; i < trimmed.length; i++) {
    const char = trimmed[i];
    
    if (escapeNext) {
      escapeNext = false;
      continue;
    }
    
    if (char === '\\') {
      escapeNext = true;
      continue;
    }
    
    if (char === '"' && !escapeNext) {
      inString = !inString;
      continue;
    }
    
    if (!inString) {
      if (char === '{' || char === '[') {
        depth++;
      } else if (char === '}' || char === ']') {
        depth--;
        if (depth < 0) return false;
      }
    }
  }
  
  return depth === 0 && !inString;
}

// ECharts component
const EChartsChart: React.FC<{ config: string; isComplete?: boolean }> = React.memo(({ config, isComplete = true }) => {
  const [option, setOption] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isComplete) {
      setOption(null);
      setError(null);
      return;
    }

    try {
      let cleanConfig = config;
      cleanConfig = cleanConfig.replace(/\/\/.*$/gm, '');
      
      let chartOption;
      try {
        chartOption = JSON.parse(cleanConfig);
      } catch (e) {
        cleanConfig = cleanConfig.replace(/("formatter":\s*)function[^}]+}/g, '$1"{dynamic}"');
        cleanConfig = cleanConfig.replace(/function\s*\([^)]*\)\s*{[^}]*}/g, '""');
        cleanConfig = cleanConfig.replace(/,\s*}/g, '}');
        cleanConfig = cleanConfig.replace(/,\s*\]/g, ']');
        chartOption = JSON.parse(cleanConfig);
      }
      
      const themedOption = {
        backgroundColor: 'transparent',
        textStyle: {
          color: '#374151'
        },
        ...chartOption
      };
      
      setOption(themedOption);
      setError(null);
    } catch (err) {
      console.error('Error parsing ECharts configuration:', err);
      setError(`Error parsing chart configuration: ${err}`);
    }
  }, [config, isComplete]);

  if (!isComplete) {
    return (
      <div className="my-4 p-4 bg-gray-100 rounded-lg animate-pulse">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 text-sm">Generating ECharts visualization...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-4 p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600 text-sm">{error}</p>
      </div>
    );
  }

  if (!option) {
    return (
      <div className="my-4 p-4 bg-gray-100 rounded-lg">
        <p className="text-gray-600 text-sm">Loading chart...</p>
      </div>
    );
  }

  return (
    <div className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
      <ReactECharts 
        option={option}
        style={{ height: '400px', width: '100%' }}
      />
    </div>
  );
});

EChartsChart.displayName = 'EChartsChart';

// Mermaid component
const MermaidChart: React.FC<{ chart: string }> = React.memo(({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');

  useEffect(() => {
    const renderChart = async () => {
      if (containerRef.current) {
        try {
          mermaid.initialize({ 
            startOnLoad: true,
            theme: 'default',
            themeVariables: {
              primaryColor: '#e0e7ff',
              primaryTextColor: '#1e3a8a',
              primaryBorderColor: '#6366f1',
              lineColor: '#6366f1',
              secondaryColor: '#f3f4f6',
              tertiaryColor: '#fef3c7',
            }
          });
          
          const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
          const { svg } = await mermaid.render(id, chart);
          setSvg(svg);
        } catch (error) {
          console.error('Error rendering mermaid chart:', error);
          setSvg(`<div style="color: #dc2626;">Error rendering chart: ${error}</div>`);
        }
      }
    };

    renderChart();
  }, [chart]);

  return (
    <div 
      ref={containerRef}
      className="my-6 p-4 bg-gray-50 rounded-lg border border-gray-200 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
});

MermaidChart.displayName = 'MermaidChart';

// Image component with error handling
const ImageWithFallback: React.FC<{ src?: string | Blob; alt?: string }> = React.memo(({ src, alt }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>('');

  useEffect(() => {
    // Reset state when src changes
    setError(false);
    setLoaded(false);
    
    // Handle Blob type
    if (src instanceof Blob) {
      const url = URL.createObjectURL(src);
      setImgSrc(url);
      return () => URL.revokeObjectURL(url);
    } else if (typeof src === 'string') {
      setImgSrc(src);
    } else {
      setImgSrc('');
    }
  }, [src]);

  if (!imgSrc || error) {
    return (
      <div className="mx-auto max-w-full my-6 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8 text-center">
        <div className="flex flex-col items-center justify-center space-y-3">
          <svg
            className="w-16 h-16 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {alt && (
            <p className="text-gray-600 text-sm font-medium">{alt}</p>
          )}
          <p className="text-gray-400 text-xs">
            {error ? 'Failed to load image' : 'Invalid image URL'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto max-w-full my-6">
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg animate-pulse">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      <img
        src={imgSrc}
        alt={alt || ''}
        className={`mx-auto max-w-full h-auto rounded-lg shadow-md transition-opacity duration-300 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
        loading="lazy"
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
      />
    </div>
  );
});

ImageWithFallback.displayName = 'ImageWithFallback';

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = React.memo(({ content, className }) => {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeRaw, rehypeSanitize, rehypeKatex]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900 border-b border-gray-200 pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xl font-semibold mt-5 mb-2 text-gray-900">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-lg font-semibold mt-4 mb-2 text-gray-800">
              {children}
            </h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-base font-semibold mt-3 mb-1 text-gray-800">
              {children}
            </h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm font-semibold mt-3 mb-1 text-gray-800">
              {children}
            </h6>
          ),
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 leading-relaxed">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 list-disc list-outside text-gray-700 space-y-2">
              {children}
            </ul>
          ),
          ol: ({ children, start, ...props }) => (
            <ol
              className="mb-4 pl-6 list-decimal list-outside text-gray-700 space-y-2"
              start={start}
              {...props}
            >
              {children}
            </ol>
          ),
          li: ({ children, ...props }) => (
            <li className="leading-relaxed" {...props}>
              {children}
            </li>
          ),
          a: ({ href, children }) => (
            <a 
              href={href} 
              className="text-blue-600 hover:text-blue-800 underline decoration-blue-400 hover:decoration-blue-600 transition-colors" 
              target="_blank" 
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-blue-500 pl-4 py-2 my-4 bg-blue-50 text-gray-700 italic rounded-r">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="min-w-full divide-y divide-gray-300 border border-gray-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-gray-100">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-gray-200 bg-white">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-gray-50 transition-colors">
              {children}
            </tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900 border-r border-gray-200 last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm text-gray-700 border-r border-gray-200 last:border-r-0">
              {children}
            </td>
          ),
          code: ({ className, children, ...props }) => {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';
            
            if (language === 'mermaid') {
              return <MermaidChart chart={String(children).replace(/\n$/, '')} />;
            }
            
            if (language === 'echarts') {
              const configStr = String(children).replace(/\n$/, '');
              const isComplete = isJsonComplete(configStr);
              return <EChartsChart config={configStr} isComplete={isComplete} />;
            }
            
            const isCodeBlock = Boolean(language);
            
            if (!isCodeBlock) {
              return (
                <code 
                  className="px-2 py-0.5 rounded bg-gray-100 text-pink-600 text-sm font-mono border border-gray-200" 
                  {...props}
                >
                  {children}
                </code>
              );
            }
            
            return (
              <div className="my-4 rounded-lg overflow-hidden border border-gray-200">
                <SyntaxHighlighter
                  language={language || 'text'}
                  style={oneLight}
                  customStyle={{
                    margin: 0,
                    padding: '1rem',
                    fontSize: '0.875rem',
                    borderRadius: '0.5rem',
                  }}
                  showLineNumbers
                >
                  {String(children).replace(/\n$/, '')}
                </SyntaxHighlighter>
              </div>
            );
          },
          hr: () => (
            <hr className="my-8 border-gray-300" />
          ),
          strong: ({ children }) => (
            <strong className="font-bold text-gray-900">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="italic text-gray-800">
              {children}
            </em>
          ),
          del: ({ children }) => (
            <del className="line-through text-gray-500">
              {children}
            </del>
          ),
          img: ({ src, alt }) => (
            <ImageWithFallback src={src} alt={alt} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

