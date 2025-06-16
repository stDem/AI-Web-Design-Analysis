import React, { useState, useEffect } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, BarChart3, Share2, Eye, Zap, Shield, Users, CheckCircle, Menu, X } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import AnnotationCanvas from '@/components/AnnotationCanvas';
import { useWebsiteAnalysis } from '@/hooks/useWebsiteAnalysis';
import { usePDFGeneration } from '@/hooks/usePDFGeneration';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';

const Index = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { analyzeWebsite, isAnalyzing, analysisResults, error } = useWebsiteAnalysis();
  const { generatePDF } = usePDFGeneration();
  const { toast } = useToast();
  const isMobile = useIsMobile();

  const getCurrentYear = () => new Date().getFullYear();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down and past 100px
        setIsHeaderVisible(false);
      } else {
        // Scrolling up or at top
        setIsHeaderVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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

  const handleShare = async () => {
    if (!analysisResults) {
      toast({
        title: "No Analysis Results",
        description: "Please run an analysis first before sharing results.",
        variant: "destructive"
      });
      return;
    }

    console.log('Sharing analysis results...');
    
    try {
      // Generate and download the PDF report
      const success = await generatePDF(analysisResults, websiteUrl || 'Unknown Website');
      
      if (success) {
        toast({
          title: "Report Generated!",
          description: "Your analysis report has been downloaded successfully.",
        });
        
        // Try to copy the current URL to clipboard as a bonus
        try {
          await navigator.clipboard.writeText(window.location.href);
          console.log('URL copied to clipboard');
        } catch (clipboardError) {
          console.log('Could not copy URL to clipboard:', clipboardError);
        }
      } else {
        throw new Error('Failed to generate report');
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: "Share Failed",
        description: "Could not generate the analysis report. Please try again.",
        variant: "destructive"
      });
    }
  };

  const scrollToAnalysisMethod = () => {
    const analysisSection = document.getElementById('analysis-method-section');
    if (analysisSection) {
      analysisSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  return (
    <div className="min-h-screen paper-texture" style={{ fontFamily: '"Comic Sans MS", cursive' }}>
      
      {/* Header with scroll hide effect - Mobile responsive */}
      <div className={`sketch-header fixed top-0 z-40 py-2 md:py-4 w-full transition-transform duration-300 ${
        isHeaderVisible ? 'translate-y-0' : '-translate-y-full'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <div className="sketch-border bg-white p-1 md:p-2 doodle-decoration">
                <img 
                  src="/lovable-uploads/0a0e0bd1-96e1-4c3d-89a5-6f2379d8ddff.png" 
                  alt="Fish Skeleton Logo" 
                  className="w-12 h-12 md:w-20 md:h-20 object-contain sketchy-shadow"
                />
              </div>
              <div>
                <h1 className="text-lg md:text-2xl font-bold text-gray-800 hand-drawn-line">
                  UX RAY
                </h1>
                <p className="text-xs md:text-sm text-gray-600">
                  AI-Powered Design Analysis
                </p>
              </div>
            </div>
            
            {/* Mobile Menu Button */}
            {isMobile ? (
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="sketch-button p-2"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            ) : (
              <div className="flex items-center space-x-3">
                {analysisResults && (
                  <button 
                    onClick={handleShare} 
                    className="sketch-button flex items-center space-x-2 text-xs md:text-sm px-2 md:px-4 py-1 md:py-2"
                  >
                    <Share2 className="h-3 w-3 md:h-4 md:w-4" />
                    <span className="hidden sm:inline">DOWNLOAD RESULTS</span>
                    <span className="sm:hidden">DOWNLOAD</span>
                  </button>
                )}
                <button onClick={scrollToAnalysisMethod} className="sketch-button text-xs md:text-sm px-2 md:px-4 py-1 md:py-2">
                  GET STARTED
                </button>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Dropdown */}
          {isMobile && isMobileMenuOpen && (
            <div className="mt-4 p-4 bg-white sketch-border">
              <div className="flex flex-col space-y-3">
                {analysisResults && (
                  <button 
                    onClick={() => {
                      handleShare();
                      setIsMobileMenuOpen(false);
                    }}
                    className="sketch-button flex items-center justify-center space-x-2 w-full"
                  >
                    <Share2 className="h-4 w-4" />
                    <span>DOWNLOAD RESULTS</span>
                  </button>
                )}
                <button 
                  onClick={() => {
                    scrollToAnalysisMethod();
                    setIsMobileMenuOpen(false);
                  }}
                  className="sketch-button w-full"
                >
                  GET STARTED
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main content container with top padding to account for fixed header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8 pt-24 md:pt-32">
        {/* Hero Section with sketchy cards - Mobile responsive */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4 md:mb-6 mt-6 md:mt-10 hand-drawn-line">
            ANALYZE & IMPROVE YOUR DESIGN WITH AI
          </h2>
          
          {/* Visual Description with hand-drawn style - Mobile responsive grid */}
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
              <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
                <div className="sketch-border bg-purple-100 p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <Shield className="h-6 w-6 md:h-8 md:w-8 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  WCAG COMPLIANCE
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Accessibility audits with automated contrast, keyboard navigation, and screen reader testing
                </p>
                <div className="mt-2 md:mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span className="text-xs text-gray-500">AA/AAA Standards</span>
                </div>
              </div>

              <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
                <div className="sketch-border bg-yellow-100 p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <Zap className="h-6 w-6 md:h-8 md:w-8 text-yellow-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  PERFORMANCE BOOST
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Core Web Vitals optimization with image compression and code splitting recommendations
                </p>
                <div className="mt-2 md:mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span className="text-xs text-gray-500">60% faster loading</span>
                </div>
              </div>

              <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
                <div className="sketch-border bg-blue-100 p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <Users className="h-6 w-6 md:h-8 md:w-8 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  UX PATTERNS
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  User journey analysis with conversion optimization and behavioral insights
                </p>
                <div className="mt-2 md:mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span className="text-xs text-gray-500">+25% conversion</span>
                </div>
              </div>

              <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
                <div className="sketch-border bg-green-100 p-2 md:p-3 w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                  <Code className="h-6 w-6 md:h-8 md:w-8 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-sm md:text-base">
                  CODE QUALITY
                </h3>
                <p className="text-xs md:text-sm text-gray-600">
                  Before/after code examples with security audits and maintainability improvements
                </p>
                <div className="mt-2 md:mt-3 flex items-center justify-center space-x-1">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span className="text-xs text-gray-500">Enterprise ready</span>
                </div>
              </div>
            </div>

            {/* AI Models Showcase - Mobile responsive */}
            <div className="sketch-border bg-gray-800 p-4 md:p-6 text-white mb-4 md:mb-6">
              <div className="flex items-center justify-center space-x-2 md:space-x-3 mb-3 md:mb-4">
                <Eye className="h-6 w-6 md:h-8 md:w-8" />
                <h3 className="text-lg md:text-xl font-bold">
                  POWERED BY ADVANCED AI
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-center">
                <div className="sketch-border bg-white/20 p-3 md:p-4">
                  <h4 className="font-bold mb-2 text-sm md:text-base">GPT-4 VISION</h4>
                  <p className="text-xs md:text-sm text-gray-100">Visual design analysis and pattern recognition</p>
                </div>
                <div className="sketch-border bg-white/20 p-3 md:p-4" style={{ transform: 'rotate(-0.8deg)' }}>
                  <h4 className="font-bold mb-2 text-sm md:text-base">CLAUDE 3.5</h4>
                  <p className="text-xs md:text-sm text-gray-100">Code quality assessment and security auditing</p>
                </div>
              </div>
            </div>

            {/* Call to Action - Mobile responsive */}
            <div className="text-center">
              <p className="text-base md:text-lg text-gray-700 mb-3 md:mb-4">
                <strong>GET ACTIONABLE INSIGHTS</strong> with competitive comparisons and shareable reports
              </p>
              <div className="grid grid-cols-1 md:flex md:items-center md:justify-center md:space-x-6 gap-2 md:gap-0 text-xs md:text-sm text-gray-600">
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span>Instant analysis</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span>Export reports</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <CheckCircle className="h-3 w-3 md:h-4 md:w-4 text-green-500" />
                  <span>Team collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Methods with hand-drawn style - Mobile responsive tabs */}
        <div className="mb-6 md:mb-8" id="analysis-method-section">
          <div className="sketch-card p-4 md:p-6">
            <div className="mb-4 md:mb-6">
              <h2 className="flex items-center space-x-2 text-lg md:text-xl font-bold">
                <Upload className="h-4 w-4 md:h-5 md:w-5" />
                <span>CHOOSE ANALYSIS METHOD</span>
              </h2>
            </div>
            <div className="sketch-tabs p-2 md:p-4">
              {/* Mobile-friendly tab navigation */}
              <div className={`${isMobile ? 'grid grid-cols-2 gap-2' : 'flex space-x-2'} mb-4 md:mb-6`}>
                <button 
                  onClick={() => setActiveTab('url')}
                  className={`sketch-tab px-2 md:px-4 py-2 text-xs md:text-sm ${activeTab === 'url' ? 'active' : ''}`}
                >
                  <LinkIcon className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 inline" />
                  <span className="hidden sm:inline">WEBSITE URL</span>
                  <span className="sm:hidden">URL</span>
                </button>
                <button 
                  onClick={() => setActiveTab('upload')}
                  className={`sketch-tab px-2 md:px-4 py-2 text-xs md:text-sm ${activeTab === 'upload' ? 'active' : ''}`}
                >
                  <FileImage className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 inline" />
                  <span className="hidden sm:inline">UPLOAD FILES</span>
                  <span className="sm:hidden">UPLOAD</span>
                </button>
                <button 
                  onClick={() => setActiveTab('figma')}
                  className={`sketch-tab px-2 md:px-4 py-2 text-xs md:text-sm ${activeTab === 'figma' ? 'active' : ''}`}
                >
                  <Figma className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 inline" />
                  <span className="hidden sm:inline">FIGMA DESIGN</span>
                  <span className="sm:hidden">FIGMA</span>
                </button>
                <button 
                  onClick={() => setActiveTab('project')}
                  className={`sketch-tab px-2 md:px-4 py-2 text-xs md:text-sm ${activeTab === 'project' ? 'active' : ''}`}
                >
                  <Code className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2 inline" />
                  <span className="hidden sm:inline">FULL PROJECT</span>
                  <span className="sm:hidden">PROJECT</span>
                </button>
              </div>

              {activeTab === 'url' && (
                <div className="space-y-4">
                  <div className="sketch-border bg-blue-50 p-3 md:p-4 mb-4">
                    <h4 className="font-bold text-blue-900 mb-1 text-sm md:text-base">
                      WEBSITE URL ANALYSIS
                    </h4>
                    <p className="text-xs md:text-sm text-blue-700">
                      Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-4">
                    <input
                      placeholder="Enter website URL (e.g., https://example.com)"
                      value={websiteUrl}
                      onChange={(e) => setWebsiteUrl(e.target.value)}
                      className="sketch-input flex-1 text-sm"
                    />
                    <button 
                      onClick={handleAnalysis}
                      disabled={isAnalyzing || !websiteUrl}
                      className="sketch-button bg-gray-800 text-white text-sm px-4 py-2 whitespace-nowrap"
                    >
                      {isAnalyzing ? 'ANALYZING...' : 'ANALYZE WEBSITE'}
                    </button>
                  </div>
                  {error && (
                    <div className="sketch-border bg-red-50 p-3 border-red-400">
                      <p className="text-red-600 text-sm"><strong>ERROR:</strong> {error}</p>
                    </div>
                  )}
                  {websiteUrl && !analysisResults && !isAnalyzing && (
                    <div className="sketch-border bg-blue-50 p-3">
                      <p className="text-blue-600 text-sm"><strong>READY TO ANALYZE:</strong> Click "Analyze Website" to get comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'upload' && (
                <div>
                  <div className="sketch-border bg-green-50 p-3 md:p-4 mb-4">
                    <h4 className="font-bold text-green-900 mb-1 text-sm md:text-base">
                      FILE UPLOAD ANALYSIS
                    </h4>
                    <p className="text-xs md:text-sm text-green-700">
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
                  <div className="sketch-border bg-purple-50 p-3 md:p-4 mb-4">
                    <h4 className="font-bold text-purple-900 mb-1 text-sm md:text-base">
                      FIGMA DESIGN ANALYSIS
                    </h4>
                    <p className="text-xs md:text-sm text-purple-700">
                      Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                    </p>
                  </div>
                  <div className="text-center py-6 md:py-8">
                    <Figma className="h-12 w-12 md:h-16 md:w-16 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base md:text-lg font-bold mb-2">
                      CONNECT FIGMA ACCOUNT
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">Authorize access to analyze your Figma designs</p>
                    <button 
                      onClick={handleAnalysis}
                      className="sketch-button bg-gray-800 text-white text-sm px-4 py-2"
                    >
                      {isAnalyzing ? 'ANALYZING...' : 'CONNECT FIGMA & ANALYZE'}
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'project' && (
                <div className="space-y-4">
                  <div className="sketch-border bg-orange-50 p-3 md:p-4 mb-4">
                    <h4 className="font-bold text-orange-900 mb-1 text-sm md:text-base">
                      FULL PROJECT ANALYSIS
                    </h4>
                    <p className="text-xs md:text-sm text-orange-700">
                      Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                    </p>
                  </div>
                  <div className="sketch-border p-6 md:p-8 text-center">
                    <Code className="h-10 w-10 md:h-12 md:w-12 mx-auto text-gray-400 mb-4" />
                    <h3 className="text-base md:text-lg font-bold mb-2">
                      UPLOAD PROJECT FILES
                    </h3>
                    <p className="text-gray-600 mb-4 text-sm md:text-base">
                      Upload a ZIP file containing your project for code analysis
                    </p>
                    <button 
                      onClick={handleAnalysis}
                      className="sketch-button text-sm px-4 py-2"
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

        {/* Analysis Results - Mobile responsive */}
        {analysisResults && (
          <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
            <div className="sketch-results-card p-4 md:p-6">
              <AnalysisResults results={analysisResults} />
            </div>
          </div>
        )}

        {/* Design Annotations - Mobile responsive */}
        {analysisResults && (
          <div className="mb-6 md:mb-8">
            <div className="sketch-results-card p-4 md:p-6">
              <AnnotationCanvas websiteUrl={websiteUrl} annotations={analysisResults.annotations} />
            </div>
          </div>
        )}

        {/* Loading State - Mobile responsive */}
        {isAnalyzing && (
          <div className="sketch-card p-8 md:p-12 text-center mb-6 md:mb-8">
            <div className="sketchy-shadow rounded-full h-10 w-10 md:h-12 md:w-12 border-4 border-gray-800 border-t-transparent mx-auto mb-4 animate-spin"></div>
            <h3 className="text-base md:text-lg font-bold mb-2">
              ANALYZING DESIGN...
            </h3>
            <p className="text-gray-600 text-sm md:text-base">Our AI models are evaluating your design and generating feedback</p>
            <div className="mt-4 space-y-2 text-xs md:text-sm text-gray-500">
              <p>🔍 Scanning design elements with GPT-4 Vision...</p>
              <p>🎨 Checking accessibility standards (WCAG 2.1)...</p>
              <p>⚡ Analyzing performance metrics and Core Web Vitals...</p>
              <p>📱 Evaluating user experience patterns...</p>
              <p>🏆 Comparing with industry benchmarks...</p>
            </div>
          </div>
        )}

        {/* Features Grid - Mobile responsive */}
        {!analysisResults && !isAnalyzing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-8 md:mt-12">
            <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
              <div className="sketch-border bg-purple-100 p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <BarChart3 className="h-5 w-5 md:h-6 md:w-6 text-purple-600" />
              </div>
              <h3 className="font-bold mb-2 text-sm md:text-base">
                AI-POWERED ANALYSIS
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
              </p>
            </div>

            <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
              <div className="sketch-border bg-blue-100 p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <FileText className="h-5 w-5 md:h-6 md:w-6 text-blue-600" />
              </div>
              <h3 className="font-bold mb-2 text-sm md:text-base">
                COMPETITIVE ANALYSIS
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Compare your design against industry leaders and get insights on how to outperform competitors
              </p>
            </div>

            <div className="sketch-card p-4 md:p-6 text-center doodle-decoration">
              <div className="sketch-border bg-green-100 p-2 md:p-3 w-10 h-10 md:w-12 md:h-12 mx-auto mb-3 md:mb-4 flex items-center justify-center">
                <Code className="h-5 w-5 md:h-6 md:w-6 text-green-600" />
              </div>
              <h3 className="font-bold mb-2 text-sm md:text-base">
                CODE IMPROVEMENTS
              </h3>
              <p className="text-gray-600 text-xs md:text-sm">
                Receive actionable code suggestions with before/after examples to enhance performance and accessibility
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-4 md:py-6 mt-8 md:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs md:text-sm text-gray-600">
            © {getCurrentYear()} Anastasiia Demidova | 
            <a 
              href="https://github.com/stDem" 
              target="_blank" 
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:text-blue-800 underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
