
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, BarChart3, Share2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import AnnotationCanvas from '@/components/AnnotationCanvas';
import CodeSuggestions from '@/components/CodeSuggestions';

const Index = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process with comprehensive sample data
    setTimeout(() => {
      setAnalysisResults({
        score: 73,
        comparison: {
          competitors: [
            { name: 'Amazon AWS', score: 68, category: 'performance' },
            { name: 'Google Cloud', score: 71, category: 'accessibility' },
            { name: 'Microsoft Azure', score: 69, category: 'ux' }
          ],
          betterThan: 65,
          position: '23rd percentile'
        },
        issues: [
          { 
            type: 'accessibility', 
            severity: 'high', 
            description: 'Color contrast ratio of 3.2:1 in navigation links falls below WCAG AA standard (4.5:1 required)' 
          },
          { 
            type: 'accessibility', 
            severity: 'medium', 
            description: 'Missing alt attributes on 3 decorative images in the hero section' 
          },
          { 
            type: 'performance', 
            severity: 'high', 
            description: 'Large hero image (2.4MB) causing 3.2s delay in First Contentful Paint' 
          },
          { 
            type: 'performance', 
            severity: 'medium', 
            description: 'Unused CSS rules detected - 45% of stylesheet not utilized' 
          },
          { 
            type: 'ux', 
            severity: 'medium', 
            description: 'Call-to-action buttons lack sufficient spacing (current: 8px, recommended: 16px minimum)' 
          },
          { 
            type: 'ux', 
            severity: 'low', 
            description: 'Mobile navigation menu opens without animation, creating jarring user experience' 
          },
          { 
            type: 'code', 
            severity: 'medium', 
            description: 'Inline styles detected in 12 components - consider moving to CSS classes for maintainability' 
          },
          { 
            type: 'code', 
            severity: 'low', 
            description: 'Console warnings about deprecated React lifecycle methods in ContactForm component' 
          }
        ],
        suggestions: [
          'Update navigation link colors to #2563eb (blue-600) to achieve 4.7:1 contrast ratio',
          'Add descriptive alt text to hero images or mark as decorative with alt=""',
          'Implement WebP format and lazy loading for images to reduce load time by 60%',
          'Remove unused CSS classes and consider CSS purging in build process',
          'Increase button margins to 16px and add hover states for better accessibility',
          'Add smooth slide-down animation to mobile menu using CSS transitions',
          'Create a centralized theme system using CSS custom properties',
          'Update ContactForm to use React hooks instead of class components',
          'Implement semantic HTML5 landmarks (header, nav, main, footer) for screen readers',
          'Add focus indicators for keyboard navigation users',
          'Consider implementing a design system with consistent spacing tokens',
          'Add loading states for form submissions to improve perceived performance'
        ],
        codeSuggestions: [
          {
            file: 'src/components/Header.tsx',
            issue: 'Missing semantic HTML structure and accessibility attributes',
            type: 'accessibility',
            before: `<div className="header">
  <div className="logo">Logo</div>
  <div className="nav">
    <a href="#home">Home</a>
    <a href="#about">About</a>
  </div>
</div>`,
            after: `<header className="header" role="banner">
  <div className="logo">
    <img src="/logo.svg" alt="Company Logo" />
  </div>
  <nav className="nav" role="navigation" aria-label="Main navigation">
    <a href="#home" aria-current="page">Home</a>
    <a href="#about">About</a>
  </nav>
</header>`,
            explanation: 'Added semantic HTML elements (header, nav), ARIA labels, and proper alt text for better screen reader support and SEO.'
          },
          {
            file: 'src/styles/components.css',
            issue: 'Inefficient CSS with repeated styles and no CSS custom properties',
            type: 'maintainability',
            before: `.button-primary {
  background-color: #3b82f6;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}

.button-secondary {
  background-color: #6b7280;
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
}`,
            after: `:root {
  --color-primary: #3b82f6;
  --color-secondary: #6b7280;
  --button-padding: 12px 24px;
  --button-radius: 8px;
}

.button-base {
  color: white;
  padding: var(--button-padding);
  border-radius: var(--button-radius);
}

.button-primary {
  @extend .button-base;
  background-color: var(--color-primary);
}

.button-secondary {
  @extend .button-base;
  background-color: var(--color-secondary);
}`,
            explanation: 'Introduced CSS custom properties and base classes to reduce code duplication and improve maintainability.'
          },
          {
            file: 'src/utils/imageOptimizer.js',
            issue: 'Large images loaded without optimization causing performance issues',
            type: 'performance',
            before: `function loadImage(src) {
  const img = new Image();
  img.src = src;
  return img;
}`,
            after: `function loadImage(src, options = {}) {
  const { 
    lazy = true, 
    width, 
    height, 
    format = 'webp' 
  } = options;
  
  const img = new Image();
  
  if (lazy) {
    img.loading = 'lazy';
  }
  
  if (width) img.width = width;
  if (height) img.height = height;
  
  // Use WebP format if supported
  const supportsWebP = document.createElement('canvas')
    .toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  img.src = supportsWebP && format === 'webp' 
    ? src.replace(/\.(jpg|jpeg|png)$/i, '.webp')
    : src;
    
  return img;
}`,
            explanation: 'Added lazy loading, responsive sizing options, and WebP format detection to improve page load performance.'
          },
          {
            file: 'src/components/ContactForm.tsx',
            issue: 'Form inputs lack proper validation and security measures',
            type: 'security',
            before: `const handleSubmit = (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  fetch('/api/contact', {
    method: 'POST',
    body: formData
  });
};`,
            after: `const handleSubmit = async (e) => {
  e.preventDefault();
  const formData = new FormData(e.target);
  
  // Input validation
  const email = formData.get('email');
  const message = formData.get('message');
  
  if (!email || !isValidEmail(email)) {
    setError('Please enter a valid email address');
    return;
  }
  
  if (!message || message.length < 10) {
    setError('Message must be at least 10 characters long');
    return;
  }
  
  // Sanitize inputs
  const sanitizedData = {
    email: sanitizeInput(email),
    message: sanitizeInput(message)
  };
  
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': getCsrfToken()
      },
      body: JSON.stringify(sanitizedData)
    });
    
    if (!response.ok) throw new Error('Submission failed');
    
    setSuccess('Message sent successfully!');
  } catch (error) {
    setError('Failed to send message. Please try again.');
  }
};`,
            explanation: 'Added input validation, sanitization, CSRF protection, and proper error handling to prevent security vulnerabilities.'
          }
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'UX Ray Analysis Results',
        text: `My website scored ${analysisResults?.score}/100 in UX analysis!`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  UX Ray
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Design Analysis</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {analysisResults && (
                <Button variant="outline" onClick={handleShare} className="bg-white/50">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              )}
              <Button variant="outline" className="bg-white/50">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Analyze & Improve Your Design with AI
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto">
            Powered by advanced machine learning models including GPT-4 Vision and Claude 3.5, UX Ray provides comprehensive design analysis covering accessibility (WCAG compliance), performance optimization, user experience patterns, and code quality. Get actionable insights with before/after code examples, competitive comparisons, and shareable reports.
          </p>
        </div>

        {/* Input Methods */}
        <Card className="mb-8 bg-white/70 backdrop-blur-sm border border-gray-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Upload className="h-5 w-5" />
              <span>Choose Analysis Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="url" className="flex items-center space-x-2">
                  <LinkIcon className="h-4 w-4" />
                  <span>Website URL</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center space-x-2">
                  <FileImage className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
                <TabsTrigger value="figma" className="flex items-center space-x-2">
                  <Figma className="h-4 w-4" />
                  <span>Figma Design</span>
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center space-x-2">
                  <Code className="h-4 w-4" />
                  <span>Full Project</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-blue-900 mb-1">Website URL Analysis</h4>
                  <p className="text-sm text-blue-700">
                    Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                  </Button>
                </div>
                {websiteUrl && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p><strong>Sample Analysis:</strong> Click "Analyze Website" to see comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <div className="bg-green-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-green-900 mb-1">File Upload Analysis</h4>
                  <p className="text-sm text-green-700">
                    Upload images, PDFs, mockups, or wireframes for AI-powered design review. Generates detailed feedback on visual hierarchy, typography, color schemes, and layout optimization.
                  </p>
                </div>
                <FileUpload 
                  onFilesUploaded={setUploadedFiles}
                  onAnalyze={handleAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </TabsContent>

              <TabsContent value="figma" className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-purple-900 mb-1">Figma Design Analysis</h4>
                  <p className="text-sm text-purple-700">
                    Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                  </p>
                </div>
                <div className="text-center py-8">
                  <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect Figma Account</h3>
                  <p className="text-gray-600 mb-4">Authorize access to analyze your Figma designs</p>
                  <Button 
                    onClick={handleAnalysis}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Connect Figma & Analyze'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg mb-4">
                  <h4 className="font-medium text-orange-900 mb-1">Full Project Analysis</h4>
                  <p className="text-sm text-orange-700">
                    Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                  </p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Project Files</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a ZIP file containing your project for code analysis
                  </p>
                  <Button 
                    onClick={handleAnalysis}
                    variant="outline" 
                    className="cursor-pointer"
                    disabled={isAnalyzing}
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Select ZIP File & Analyze'}
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Analysis Results */}
        {analysisResults && (
          <div className="space-y-6">
            <AnalysisResults results={analysisResults} />
            <AnnotationCanvas imageUrl="/placeholder.svg" />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="bg-white/70 backdrop-blur-sm">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2">Analyzing Design...</h3>
                <p className="text-gray-600">Our AI models are evaluating your design and generating feedback</p>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p>🔍 Scanning design elements with GPT-4 Vision...</p>
                  <p>🎨 Checking accessibility standards (WCAG 2.1)...</p>
                  <p>⚡ Analyzing performance metrics and Core Web Vitals...</p>
                  <p>📱 Evaluating user experience patterns...</p>
                  <p>🏆 Comparing with industry benchmarks...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid */}
        {!analysisResults && !isAnalyzing && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Competitive Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Compare your design against industry leaders and get insights on how to outperform competitors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Code Improvements</h3>
                <p className="text-gray-600 text-sm">
                  Receive actionable code suggestions with before/after examples to enhance performance and accessibility
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
