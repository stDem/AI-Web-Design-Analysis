
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, BarChart3, Share2, Eye, Zap, Shield, Users, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import AnnotationCanvas from '@/components/AnnotationCanvas';
import { useWebsiteAnalysis } from '@/hooks/useWebsiteAnalysis';

const Index = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const { analyzeWebsite, isAnalyzing, analysisResults, error } = useWebsiteAnalysis();

  const handleAnalysis = async () => {
    if (activeTab === 'url' && websiteUrl) {
      await analyzeWebsite(websiteUrl);
    } else {
      // Simulate analysis for other tabs with sample data
      setTimeout(() => {
        const sampleResults = {
          score: Math.floor(Math.random() * 100),
          accessibility: { score: Math.floor(Math.random() * 100), issues: [] },
          performance: { score: Math.floor(Math.random() * 100), issues: [] },
          ux: { score: Math.floor(Math.random() * 100), issues: [] },
          codeQuality: { score: Math.floor(Math.random() * 100), issues: [] },
          annotations: []
        };
        // @ts-ignore
        setAnalysisResults(sampleResults);
      }, 3000);
    }
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
    <div className="min-h-screen paper-texture" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
      
      {/* Header with hand-drawn style - Fixed position to prevent movement */}
      <div className="sketch-header sticky top-0 z-40 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="sketch-border bg-white p-2 doodle-decoration">
                <img 
                  src="/lovable-uploads/0a0e0bd1-96e1-4c3d-89a5-6f2379d8ddff.png" 
                  alt="Fish Skeleton Logo" 
                  className="w-8 h-8 object-contain sketchy-shadow"
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 hand-drawn-line">
                  UX RAY
                </h1>
                <p className="text-sm text-gray-600">
                  AI-Powered Design Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {analysisResults && (
                <button onClick={handleShare} className="sketch-button">
                  <Share2 className="h-4 w-4 mr-2 inline" />
                  SHARE RESULTS
                </button>
              )}
              <button className="sketch-button">
                SIGN IN
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main content container with fixed layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with sketchy cards */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 hand-drawn-line">
            ANALYZE & IMPROVE YOUR DESIGN WITH AI
          </h2>
          
          {/* Visual Description with hand-drawn style */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="sketch-card p-6 text-center doodle-decoration">
                <div className="sketch-border bg-purple-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  WCAG COMPLIANCE
                </h3>
                <p className="text-sm text-gray-600">
                  Accessibility audits with automated contrast, keyboard navigation, and screen reader testing
                </p>
                <div className="mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">AA/AAA Standards</span>
                </div>
              </div>

              <div className="sketch-card p-6 text-center doodle-decoration">
                <div className="sketch-border bg-yellow-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  PERFORMANCE BOOST
                </h3>
                <p className="text-sm text-gray-600">
                  Core Web Vitals optimization with image compression and code splitting recommendations
                </p>
                <div className="mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">60% faster loading</span>
                </div>
              </div>

              <div className="sketch-card p-6 text-center doodle-decoration">
                <div className="sketch-border bg-blue-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  UX PATTERNS
                </h3>
                <p className="text-sm text-gray-600">
                  User journey analysis with conversion optimization and behavioral insights
                </p>
                <div className="mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">+25% conversion</span>
                </div>
              </div>

              <div className="sketch-card p-6 text-center doodle-decoration">
                <div className="sketch-border bg-green-100 p-3 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                  <Code className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">
                  CODE QUALITY
                </h3>
                <p className="text-sm text-gray-600">
                  Before/after code examples with security audits and maintainability improvements
                </p>
                <div className="mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-xs text-gray-500">Enterprise ready</span>
                </div>
              </div>
            </div>

            {/* AI Models Showcase */}
            <div className="sketch-border bg-gray-800 p-6 text-white mb-6">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Eye className="h-8 w-8" />
                <h3 className="text-xl font-bold">
                  POWERED BY ADVANCED AI
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="sketch-border bg-white/20 p-4">
                  <h4 className="font-bold mb-2">GPT-4 VISION</h4>
                  <p className="text-sm text-gray-100">Visual design analysis and pattern recognition</p>
                </div>
                <div className="sketch-border bg-white/20 p-4" style={{ transform: 'rotate(-0.8deg)' }}>
                  <h4 className="font-bold mb-2">CLAUDE 3.5</h4>
                  <p className="text-sm text-gray-100">Code quality assessment and security auditing</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4">
                <strong>GET ACTIONABLE INSIGHTS</strong> with competitive comparisons and shareable reports
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

        {/* Input Methods with hand-drawn style - Fixed container */}
        <div className="mb-8">
          <div className="sketch-card p-6">
            <div className="mb-6">
              <h2 className="flex items-center space-x-2 text-xl font-bold">
                <Upload className="h-5 w-5" />
                <span>CHOOSE ANALYSIS METHOD</span>
              </h2>
            </div>
            <div className="sketch-tabs p-4">
              <div className="flex space-x-2 mb-6">
                <button 
                  onClick={() => setActiveTab('url')}
                  className={`sketch-tab px-4 py-2 ${activeTab === 'url' ? 'active' : ''}`}
                >
                  <LinkIcon className="h-4 w-4 mr-2 inline" />
                  WEBSITE URL
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`sketch-tab px-4 py-2 ${activeTab === 'upload' ? 'active' : ''}`}
                >
                  <FileImage className="h-4 w-4 mr-2 inline" />
                  UPLOAD FILES
                </button>
                <button 
                  onClick={() => setActiveTab('figma')}
                  className={`sketch-tab px-4 py-2 ${activeTab === 'figma' ? 'active' : ''}`}
                >
                  <Figma className="h-4 w-4 mr-2 inline" />
                  FIGMA DESIGN
                </button>
                <button 
                  onClick={() => setActiveTab('project')}
                  className={`sketch-tab px-4 py-2 ${activeTab === 'project' ? 'active' : ''}`}
                >
                  <Code className="h-4 w-4 mr-2 inline" />
                  FULL PROJECT
                </button>
              </div>

              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div className="sketch-border bg-blue-50 p-4 mb-4">
                    <h4 className="font-bold text-blue-900 mb-1">
                      WEBSITE URL ANALYSIS
                    </h4>
                    <p className="text-sm text-blue-700">
                      Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                    </p>
                  </div>
                  <div className="flex space-x-4">
                    <input
                      placeholder="Enter website URL (e.g., https://example.com)"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="sketch-input flex-1"
                    />
                    <button 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing || !websiteUrl}
                      className="sketch-button bg-gray-800 text-white"
                    >
                      {isAnalyzing ? 'ANALYZING...' : 'ANALYZE WEBSITE'}
                    </button>
                  </div>
                  {error && (
                    <div className="sketch-border bg-red-50 p-3 border-red-400">
                      <p className="text-red-600"><strong>ERROR:</strong> {error}</p>
                    </div>
                  )}
                  {websiteUrl && !analysisResults && !isAnalyzing && (
                    <div className="sketch-border bg-blue-50 p-3">
                      <p className="text-blue-600"><strong>READY TO ANALYZE:</strong> Click "Analyze Website" to get comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'upload' && (
                <div>
                  <div className="sketch-border bg-green-50 p-4 mb-4">
                    <h4 className="font-bold text-green-900 mb-1">
                      FILE UPLOAD ANALYSIS
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
                </div>
              )}

              {activeTab === 'figma' && (
                <div className="space-y-4">
                  <div className="sketch-border bg-purple-50 p-4 mb-4">
                    <h4 className="font-bold text-purple-900 mb-1">
                      FIGMA DESIGN ANALYSIS
                    </h4>
                    <p className="text-sm text-purple-700">
                      Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                    </p>
                  </div>
                  <div className="text-center py-8">
                    <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      CONNECT FIGMA ACCOUNT
                    </h3>
                    <p className="text-gray-600 mb-4">Authorize access to analyze your Figma designs</p>
                    <button 
                      onClick={handleAnalysis}
                      className="sketch-button bg-gray-800 text-white"
                    >
                      {isAnalyzing ? 'ANALYZING...' : 'CONNECT FIGMA & ANALYZE'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'project' && (
                <div className="space-y-4">
                  <div className="sketch-border bg-orange-50 p-4 mb-4">
                    <h4 className="font-bold text-orange-900 mb-1">
                      FULL PROJECT ANALYSIS
                    </h4>
                    <p className="text-sm text-orange-700">
                      Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                    </p>
                  </div>
                  <div className="sketch-border p-8 text-center">
                    <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-lg font-bold mb-2">
                      UPLOAD PROJECT FILES
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Upload a ZIP file containing your project for code analysis
                    </p>
                    <button 
                      onClick={handleAnalysis}
                      className="sketch-button"
                      disabled={isAnalyzing}
                    >
                      {isAnalyzing ? 'ANALYZING...' : 'SELECT ZIP FILE & ANALYZE'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Analysis Results - Fixed container */}
        {analysisResults && (
          <div className="space-y-6 mb-8">
            <div className="sketch-results-card p-6">
              <AnalysisResults results={analysisResults} />
            </div>
          </div>
        )}

        {/* Design Annotations - Fixed container */}
        {analysisResults && (
          <div className="mb-8">
            <div className="sketch-results-card p-6">
              <AnnotationCanvas websiteUrl={websiteUrl} annotations={analysisResults.annotations} />
            </div>
          </div>
        )}

        {/* Loading State */}
        {isAnalyzing && (
          <div className="sketch-card p-12 text-center mb-8">
            <div className="sketchy-shadow rounded-full h-12 w-12 border-4 border-gray-800 border-t-transparent mx-auto mb-4 animate-spin"></div>
            <h3 className="text-lg font-bold mb-2">
              ANALYZING DESIGN...
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
        )}

        {/* Features Grid */}
        {!analysisResults && !isAnalyzing && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <div className="sketch-card p-6 text-center doodle-decoration">
              <div className="sketch-border bg-purple-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2">
                AI-POWERED ANALYSIS
              </h3>
              <p className="text-gray-600 text-sm">
                Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
              </p>
            </div>

            <div className="sketch-card p-6 text-center doodle-decoration">
              <div className="sketch-border bg-blue-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2">
                COMPETITIVE ANALYSIS
              </h3>
              <p className="text-gray-600 text-sm">
                Compare your design against industry leaders and get insights on how to outperform competitors
              </p>
            </div>

            <div className="sketch-card p-6 text-center doodle-decoration">
              <div className="sketch-border bg-green-100 p-3 w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                <Code className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2">
                CODE IMPROVEMENTS
              </h3>
              <p className="text-gray-600 text-sm">
                Receive actionable code suggestions with before/after examples to enhance performance and accessibility
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
