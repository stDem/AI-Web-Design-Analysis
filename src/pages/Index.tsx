import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, BarChart3, Share2, Eye, Zap, Shield, Users, CheckCircle } from 'lucide-react';
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

  // Fish skeleton SVG component
  const FishSkeletonLogo = () => (
    <svg 
      width="32" 
      height="32" 
      viewBox="0 0 100 100" 
      className="text-current"
      style={{ 
        filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.2))',
        transform: 'rotate(-5deg)'
      }}
    >
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round">
        {/* Fish head/spine */}
        <path d="M20 50 Q30 45 45 50 Q60 55 80 50" strokeWidth="3" />
        
        {/* Fish bones */}
        <path d="M25 50 L22 45 M25 50 L22 55" />
        <path d="M32 49 L29 44 M32 49 L29 54" />
        <path d="M39 50 L36 45 M39 50 L36 55" />
        <path d="M46 51 L43 46 M46 51 L43 56" />
        <path d="M53 52 L50 47 M53 52 L50 57" />
        <path d="M60 52 L57 47 M60 52 L57 57" />
        <path d="M67 51 L64 46 M67 51 L64 56" />
        
        {/* Tail fin */}
        <path d="M75 50 L85 40 M75 50 L85 60 M82 45 L88 52 L82 55" strokeWidth="2" />
        
        {/* Head detail */}
        <circle cx="23" cy="47" r="1.5" fill="currentColor" />
      </g>
    </svg>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100" 
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f3f4f6' fill-opacity='0.3'%3E%3Cpath d='m36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           fontFamily: '"Comic Sans MS", "Marker Felt", "Brush Script MT", cursive'
         }}>
      {/* Header */}
      <div className="bg-white/90 backdrop-blur-sm border-b-2 border-gray-300 sticky top-0 z-40"
           style={{ 
             boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
             borderStyle: 'dashed'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-slate-600 to-gray-700 p-3 rounded-lg transform -rotate-2 shadow-lg"
                   style={{ 
                     border: '2px dashed #374151',
                     background: 'linear-gradient(45deg, #f8fafc 25%, transparent 25%), linear-gradient(-45deg, #f8fafc 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #f8fafc 75%), linear-gradient(-45deg, transparent 75%, #f8fafc 75%)',
                     backgroundSize: '4px 4px',
                     backgroundPosition: '0 0, 0 2px, 2px -2px, -2px 0px'
                   }}>
                <FishSkeletonLogo />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transform -rotate-1"
                    style={{ 
                      textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                      fontFamily: '"Marker Felt", "Comic Sans MS", cursive'
                    }}>
                  UX Ray
                </h1>
                <p className="text-sm text-gray-600 transform rotate-1" 
                   style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  AI-Powered Design Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {analysisResults && (
                <Button variant="outline" onClick={handleShare} 
                        className="bg-white/70 border-2 border-dashed border-gray-400 transform rotate-1 hover:rotate-0 transition-transform">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share Results
                </Button>
              )}
              <Button variant="outline" 
                      className="bg-white/70 border-2 border-dashed border-gray-400 transform -rotate-1 hover:rotate-0 transition-transform">
                Sign In
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 transform -rotate-1"
              style={{ 
                textShadow: '3px 3px 6px rgba(0,0,0,0.1)',
                fontFamily: '"Marker Felt", "Comic Sans MS", cursive'
              }}>
            Analyze & Improve Your Design with AI
          </h2>
          
          {/* Enhanced Visual Description */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-purple-300 hover:shadow-lg transition-all duration-200 transform hover:-rotate-1"
                    style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1)' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-purple-300">
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    WCAG Compliance
                  </h3>
                  <p className="text-sm text-gray-600">
                    Accessibility audits with automated contrast, keyboard navigation, and screen reader testing
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">AA/AAA Standards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-yellow-300 hover:shadow-lg transition-all duration-200 transform hover:rotate-1"
                    style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1)' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-yellow-300">
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Performance Boost
                  </h3>
                  <p className="text-sm text-gray-600">
                    Core Web Vitals optimization with image compression and code splitting recommendations
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">60% faster loading</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-blue-300 hover:shadow-lg transition-all duration-200 transform hover:-rotate-1"
                    style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1)' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-blue-300">
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    UX Patterns
                  </h3>
                  <p className="text-sm text-gray-600">
                    User journey analysis with conversion optimization and behavioral insights
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">+25% conversion</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-green-300 hover:shadow-lg transition-all duration-200 transform hover:rotate-1"
                    style={{ boxShadow: '4px 4px 8px rgba(0,0,0,0.1)' }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-green-300">
                    <Code className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Code Quality
                  </h3>
                  <p className="text-sm text-gray-600">
                    Before/after code examples with security audits and maintainability improvements
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500">Enterprise ready</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Models Showcase */}
            <div className="bg-gradient-to-r from-gray-600 to-slate-700 rounded-xl p-6 text-white mb-6 border-2 border-dashed border-gray-400 transform -rotate-1"
                 style={{ boxShadow: '6px 6px 12px rgba(0,0,0,0.15)' }}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Eye className="h-8 w-8" />
                <h3 className="text-xl font-semibold" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  Powered by Advanced AI
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 rounded-lg p-4 border border-dashed border-white/30">
                  <h4 className="font-semibold mb-2">GPT-4 Vision</h4>
                  <p className="text-sm text-gray-100">Visual design analysis and pattern recognition</p>
                </div>
                <div className="bg-white/20 rounded-lg p-4 border border-dashed border-white/30">
                  <h4 className="font-semibold mb-2">Claude 3.5</h4>
                  <p className="text-sm text-gray-100">Code quality assessment and security auditing</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                <strong>Get actionable insights</strong> with competitive comparisons and shareable reports
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Instant analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Export reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Team collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Methods */}
        <Card className="mb-8 bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 shadow-xl transform rotate-1"
              style={{ boxShadow: '6px 6px 12px rgba(0,0,0,0.1)' }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
              <Upload className="h-5 w-5" />
              <span>Choose Analysis Method</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 border-2 border-dashed border-gray-300">
                <TabsTrigger value="url" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-dashed data-[state=active]:border-gray-400">
                  <LinkIcon className="h-4 w-4" />
                  <span>Website URL</span>
                </TabsTrigger>
                <TabsTrigger value="upload" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-dashed data-[state=active]:border-gray-400">
                  <FileImage className="h-4 w-4" />
                  <span>Upload Files</span>
                </TabsTrigger>
                <TabsTrigger value="figma" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-dashed data-[state=active]:border-gray-400">
                  <Figma className="h-4 w-4" />
                  <span>Figma Design</span>
                </TabsTrigger>
                <TabsTrigger value="project" className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border data-[state=active]:border-dashed data-[state=active]:border-gray-400">
                  <Code className="h-4 w-4" />
                  <span>Full Project</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg mb-4 border-2 border-dashed border-blue-200">
                  <h4 className="font-medium text-blue-900 mb-1" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Website URL Analysis
                  </h4>
                  <p className="text-sm text-blue-700">
                    Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1 border-2 border-dashed border-gray-300"
                  />
                  <Button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing}
                    className="bg-gradient-to-r from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400 transform hover:-rotate-1 transition-transform"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                  </Button>
                </div>
                {websiteUrl && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border-2 border-dashed border-blue-200">
                    <p><strong>Sample Analysis:</strong> Click "Analyze Website" to see comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <div className="bg-green-50 p-4 rounded-lg mb-4 border-2 border-dashed border-green-200">
                  <h4 className="font-medium text-green-900 mb-1" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    File Upload Analysis
                  </h4>
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
                <div className="bg-purple-50 p-4 rounded-lg mb-4 border-2 border-dashed border-purple-200">
                  <h4 className="font-medium text-purple-900 mb-1" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Figma Design Analysis
                  </h4>
                  <p className="text-sm text-purple-700">
                    Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                  </p>
                </div>
                <div className="text-center py-8">
                  <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Connect Figma Account
                  </h3>
                  <p className="text-gray-600 mb-4">Authorize access to analyze your Figma designs</p>
                  <Button 
                    onClick={handleAnalysis}
                    className="bg-gradient-to-r from-gray-600 to-slate-700 text-white border-2 border-dashed border-gray-400"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Connect Figma & Analyze'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="bg-orange-50 p-4 rounded-lg mb-4 border-2 border-dashed border-orange-200">
                  <h4 className="font-medium text-orange-900 mb-1" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Full Project Analysis
                  </h4>
                  <p className="text-sm text-orange-700">
                    Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                  </p>
                </div>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                    Upload Project Files
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Upload a ZIP file containing your project for code analysis
                  </p>
                  <Button 
                    onClick={handleAnalysis}
                    variant="outline" 
                    className="cursor-pointer border-2 border-dashed border-gray-400"
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
            <AnnotationCanvas websiteUrl={websiteUrl} />
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <Card className="bg-white/80 backdrop-blur-sm border-2 border-dashed border-gray-300 transform -rotate-1">
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-600 mx-auto mb-4"></div>
                <h3 className="text-lg font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  Analyzing Design...
                </h3>
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
            <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 transform rotate-1">
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-purple-300">
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  AI-Powered Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 transform -rotate-1">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-blue-300">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  Competitive Analysis
                </h3>
                <p className="text-gray-600 text-sm">
                  Compare your design against industry leaders and get insights on how to outperform competitors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/70 backdrop-blur-sm border-2 border-dashed border-gray-300 transform rotate-1">
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-green-300">
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
                  Code Improvements
                </h3>
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
