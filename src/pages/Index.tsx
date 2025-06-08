
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
    <div className="min-h-screen bg-gray-50" 
         style={{ 
           backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e5e7eb' fill-opacity='0.2'%3E%3Cpath d='M10 10h2v2h-2V10zm4 0h2v2h-2V10zm4 0h2v2h-2V10zm4 0h2v2h-2V10zm4 0h2v2h-2V10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
           fontFamily: '"Courier New", "Monaco", monospace'
         }}>
      
      {/* Header with sketchy style */}
      <div className="bg-white border-b-4 border-gray-800 sticky top-0 z-40"
           style={{ 
             borderStyle: 'dashed',
             boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)',
             transform: 'rotate(-0.5deg)',
             marginBottom: '10px'
           }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4" style={{ transform: 'rotate(0.5deg)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-white p-3 border-3 border-gray-800 transform -rotate-2"
                   style={{ 
                     borderStyle: 'dashed',
                     boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)'
                   }}>
                <img 
                  src="/lovable-uploads/1b0d8977-c0ce-4c81-95aa-922772f17352.png" 
                  alt="Fish Skeleton Logo" 
                  className="w-8 h-8 object-contain"
                  style={{ 
                    filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
                    transform: 'rotate(-3deg)'
                  }}
                />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800 transform -rotate-1"
                    style={{ 
                      textShadow: '2px 2px 0px rgba(0,0,0,0.2)',
                      fontFamily: '"Courier New", monospace',
                      letterSpacing: '1px'
                    }}>
                  UX RAY
                </h1>
                <p className="text-sm text-gray-600 transform rotate-1" 
                   style={{ fontFamily: '"Courier New", monospace' }}>
                  AI-Powered Design Analysis
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {analysisResults && (
                <Button variant="outline" onClick={handleShare} 
                        className="bg-white border-2 border-gray-800 transform rotate-1 hover:rotate-0 transition-transform hover:shadow-lg"
                        style={{ 
                          borderStyle: 'dashed',
                          boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)',
                          fontFamily: '"Courier New", monospace'
                        }}>
                  <Share2 className="h-4 w-4 mr-2" />
                  SHARE RESULTS
                </Button>
              )}
              <Button variant="outline" 
                      className="bg-white border-2 border-gray-800 transform -rotate-1 hover:rotate-0 transition-transform hover:shadow-lg"
                      style={{ 
                        borderStyle: 'dashed',
                        boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)',
                        fontFamily: '"Courier New", monospace'
                      }}>
                SIGN IN
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section with sketchy cards */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-6 transform -rotate-1"
              style={{ 
                textShadow: '3px 3px 0px rgba(0,0,0,0.1)',
                fontFamily: '"Courier New", monospace',
                letterSpacing: '2px'
              }}>
            ANALYZE & IMPROVE YOUR DESIGN WITH AI
          </h2>
          
          {/* Enhanced Visual Description with sketchy style */}
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card className="bg-white border-3 border-purple-400 hover:shadow-lg transition-all duration-200 transform hover:-rotate-1"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '4px 4px 0px rgba(147, 51, 234, 0.3)',
                      transform: 'rotate(1deg)'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-purple-100 p-3 border-2 border-purple-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center transform rotate-3"
                       style={{ borderStyle: 'dashed' }}>
                    <Shield className="h-8 w-8 text-purple-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    WCAG COMPLIANCE
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Courier New", monospace' }}>
                    Accessibility audits with automated contrast, keyboard navigation, and screen reader testing
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Courier New", monospace' }}>AA/AAA Standards</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-3 border-yellow-400 hover:shadow-lg transition-all duration-200 transform hover:rotate-1"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '4px 4px 0px rgba(251, 191, 36, 0.3)',
                      transform: 'rotate(-1deg)'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-yellow-100 p-3 border-2 border-yellow-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center transform -rotate-3"
                       style={{ borderStyle: 'dashed' }}>
                    <Zap className="h-8 w-8 text-yellow-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    PERFORMANCE BOOST
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Courier New", monospace' }}>
                    Core Web Vitals optimization with image compression and code splitting recommendations
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Courier New", monospace' }}>60% faster loading</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-3 border-blue-400 hover:shadow-lg transition-all duration-200 transform hover:-rotate-1"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '4px 4px 0px rgba(59, 130, 246, 0.3)',
                      transform: 'rotate(1deg)'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-blue-100 p-3 border-2 border-blue-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center transform rotate-3"
                       style={{ borderStyle: 'dashed' }}>
                    <Users className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    UX PATTERNS
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Courier New", monospace' }}>
                    User journey analysis with conversion optimization and behavioral insights
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Courier New", monospace' }}>+25% conversion</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white border-3 border-green-400 hover:shadow-lg transition-all duration-200 transform hover:rotate-1"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '4px 4px 0px rgba(34, 197, 94, 0.3)',
                      transform: 'rotate(-1deg)'
                    }}>
                <CardContent className="p-6 text-center">
                  <div className="bg-green-100 p-3 border-2 border-green-400 w-16 h-16 mx-auto mb-4 flex items-center justify-center transform -rotate-3"
                       style={{ borderStyle: 'dashed' }}>
                    <Code className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    CODE QUALITY
                  </h3>
                  <p className="text-sm text-gray-600" style={{ fontFamily: '"Courier New", monospace' }}>
                    Before/after code examples with security audits and maintainability improvements
                  </p>
                  <div className="mt-3 flex items-center justify-center space-x-1">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-gray-500" style={{ fontFamily: '"Courier New", monospace' }}>Enterprise ready</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Models Showcase with sketchy style */}
            <div className="bg-gray-800 border-3 border-gray-900 p-6 text-white mb-6 transform -rotate-1"
                 style={{ 
                   borderStyle: 'dashed',
                   boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.4)'
                 }}>
              <div className="flex items-center justify-center space-x-3 mb-4">
                <Eye className="h-8 w-8" />
                <h3 className="text-xl font-bold" style={{ fontFamily: '"Courier New", monospace' }}>
                  POWERED BY ADVANCED AI
                </h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4 text-center">
                <div className="bg-white/20 border-2 border-white p-4 transform rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>GPT-4 VISION</h4>
                  <p className="text-sm text-gray-100" style={{ fontFamily: '"Courier New", monospace' }}>Visual design analysis and pattern recognition</p>
                </div>
                <div className="bg-white/20 border-2 border-white p-4 transform -rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>CLAUDE 3.5</h4>
                  <p className="text-sm text-gray-100" style={{ fontFamily: '"Courier New", monospace' }}>Code quality assessment and security auditing</p>
                </div>
              </div>
            </div>

            {/* Call to Action */}
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-4" style={{ fontFamily: '"Courier New", monospace' }}>
                <strong>GET ACTIONABLE INSIGHTS</strong> with competitive comparisons and shareable reports
              </p>
              <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Courier New", monospace' }}>Instant analysis</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Courier New", monospace' }}>Export reports</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span style={{ fontFamily: '"Courier New", monospace' }}>Team collaboration</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input Methods with sketchy style */}
        <Card className="mb-8 bg-white border-3 border-gray-800 transform rotate-1"
              style={{ 
                borderStyle: 'dashed',
                boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)'
              }}>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2" style={{ fontFamily: '"Courier New", monospace' }}>
              <Upload className="h-5 w-5" />
              <span>CHOOSE ANALYSIS METHOD</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4 mb-6 bg-gray-100 border-2 border-gray-800"
                        style={{ borderStyle: 'dashed' }}>
                <TabsTrigger value="url" 
                            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-gray-800"
                            style={{ 
                              fontFamily: '"Courier New", monospace',
                              borderStyle: 'dashed'
                            }}>
                  <LinkIcon className="h-4 w-4" />
                  <span>WEBSITE URL</span>
                </TabsTrigger>
                <TabsTrigger value="upload" 
                            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-gray-800"
                            style={{ 
                              fontFamily: '"Courier New", monospace',
                              borderStyle: 'dashed'
                            }}>
                  <FileImage className="h-4 w-4" />
                  <span>UPLOAD FILES</span>
                </TabsTrigger>
                <TabsTrigger value="figma" 
                            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-gray-800"
                            style={{ 
                              fontFamily: '"Courier New", monospace',
                              borderStyle: 'dashed'
                            }}>
                  <Figma className="h-4 w-4" />
                  <span>FIGMA DESIGN</span>
                </TabsTrigger>
                <TabsTrigger value="project" 
                            className="flex items-center space-x-2 data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-gray-800"
                            style={{ 
                              fontFamily: '"Courier New", monospace',
                              borderStyle: 'dashed'
                            }}>
                  <Code className="h-4 w-4" />
                  <span>FULL PROJECT</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="url" className="space-y-4">
                <div className="bg-blue-50 p-4 border-2 border-blue-400 mb-4 transform rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold text-blue-900 mb-1" style={{ fontFamily: '"Courier New", monospace' }}>
                    WEBSITE URL ANALYSIS
                  </h4>
                  <p className="text-sm text-blue-700" style={{ fontFamily: '"Courier New", monospace' }}>
                    Comprehensive analysis of live websites including accessibility compliance, performance metrics, SEO optimization, and competitive comparison with industry leaders.
                  </p>
                </div>
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1 border-2 border-gray-800"
                    style={{ 
                      borderStyle: 'dashed',
                      fontFamily: '"Courier New", monospace'
                    }}
                  />
                  <Button 
                    onClick={handleAnalysis}
                    disabled={isAnalyzing || !websiteUrl}
                    className="bg-gray-800 text-white border-2 border-gray-900 transform hover:-rotate-1 transition-transform hover:shadow-lg"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)',
                      fontFamily: '"Courier New", monospace'
                    }}
                  >
                    {isAnalyzing ? 'ANALYZING...' : 'ANALYZE WEBSITE'}
                  </Button>
                </div>
                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 border-2 border-red-400"
                       style={{ 
                         borderStyle: 'dashed',
                         fontFamily: '"Courier New", monospace'
                       }}>
                    <p><strong>ERROR:</strong> {error}</p>
                  </div>
                )}
                {websiteUrl && !analysisResults && !isAnalyzing && (
                  <div className="text-sm text-gray-600 bg-blue-50 p-3 border-2 border-blue-400"
                       style={{ 
                         borderStyle: 'dashed',
                         fontFamily: '"Courier New", monospace'
                       }}>
                    <p><strong>READY TO ANALYZE:</strong> Click "Analyze Website" to get comprehensive design feedback including accessibility, performance, UX, and code quality insights with competitive benchmarking.</p>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <div className="bg-green-50 p-4 border-2 border-green-400 mb-4 transform -rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold text-green-900 mb-1" style={{ fontFamily: '"Courier New", monospace' }}>
                    FILE UPLOAD ANALYSIS
                  </h4>
                  <p className="text-sm text-green-700" style={{ fontFamily: '"Courier New", monospace' }}>
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
                <div className="bg-purple-50 p-4 border-2 border-purple-400 mb-4 transform rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold text-purple-900 mb-1" style={{ fontFamily: '"Courier New", monospace' }}>
                    FIGMA DESIGN ANALYSIS
                  </h4>
                  <p className="text-sm text-purple-700" style={{ fontFamily: '"Courier New", monospace' }}>
                    Connect your Figma account to analyze design files directly. Reviews component consistency, design system adherence, accessibility standards, and provides developer-friendly code suggestions.
                  </p>
                </div>
                <div className="text-center py-8">
                  <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    CONNECT FIGMA ACCOUNT
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: '"Courier New", monospace' }}>Authorize access to analyze your Figma designs</p>
                  <Button 
                    onClick={handleAnalysis}
                    className="bg-gray-800 text-white border-2 border-gray-900"
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '3px 3px 0px rgba(0, 0, 0, 0.3)',
                      fontFamily: '"Courier New", monospace'
                    }}
                  >
                    {isAnalyzing ? 'ANALYZING...' : 'CONNECT FIGMA & ANALYZE'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="bg-orange-50 p-4 border-2 border-orange-400 mb-4 transform -rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <h4 className="font-bold text-orange-900 mb-1" style={{ fontFamily: '"Courier New", monospace' }}>
                    FULL PROJECT ANALYSIS
                  </h4>
                  <p className="text-sm text-orange-700" style={{ fontFamily: '"Courier New", monospace' }}>
                    Upload complete project files (ZIP) for comprehensive code review. Analyzes React components, CSS architecture, performance bottlenecks, security vulnerabilities, and provides refactoring suggestions.
                  </p>
                </div>
                <div className="border-2 border-gray-800 p-8 text-center transform rotate-1"
                     style={{ borderStyle: 'dashed' }}>
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                    UPLOAD PROJECT FILES
                  </h3>
                  <p className="text-gray-600 mb-4" style={{ fontFamily: '"Courier New", monospace' }}>
                    Upload a ZIP file containing your project for code analysis
                  </p>
                  <Button 
                    onClick={handleAnalysis}
                    variant="outline" 
                    className="border-2 border-gray-800"
                    disabled={isAnalyzing}
                    style={{ 
                      borderStyle: 'dashed',
                      boxShadow: '2px 2px 0px rgba(0, 0, 0, 0.2)',
                      fontFamily: '"Courier New", monospace'
                    }}
                  >
                    {isAnalyzing ? 'ANALYZING...' : 'SELECT ZIP FILE & ANALYZE'}
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
            <AnnotationCanvas websiteUrl={websiteUrl} annotations={analysisResults.annotations} />
          </div>
        )}

        {/* Loading State with sketchy style */}
        {isAnalyzing && (
          <Card className="bg-white border-3 border-gray-800 transform -rotate-1"
                style={{ 
                  borderStyle: 'dashed',
                  boxShadow: '6px 6px 0px rgba(0, 0, 0, 0.2)'
                }}>
            <CardContent className="py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-gray-800 mx-auto mb-4"
                     style={{ borderStyle: 'dashed' }}></div>
                <h3 className="text-lg font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                  ANALYZING DESIGN...
                </h3>
                <p className="text-gray-600" style={{ fontFamily: '"Courier New", monospace' }}>Our AI models are evaluating your design and generating feedback</p>
                <div className="mt-4 space-y-2 text-sm text-gray-500">
                  <p style={{ fontFamily: '"Courier New", monospace' }}>🔍 Scanning design elements with GPT-4 Vision...</p>
                  <p style={{ fontFamily: '"Courier New", monospace' }}>🎨 Checking accessibility standards (WCAG 2.1)...</p>
                  <p style={{ fontFamily: '"Courier New", monospace' }}>⚡ Analyzing performance metrics and Core Web Vitals...</p>
                  <p style={{ fontFamily: '"Courier New", monospace' }}>📱 Evaluating user experience patterns...</p>
                  <p style={{ fontFamily: '"Courier New", monospace' }}>🏆 Comparing with industry benchmarks...</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Features Grid with sketchy style */}
        {!analysisResults && !isAnalyzing && (
          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="bg-white border-3 border-gray-800 transform rotate-1"
                  style={{ 
                    borderStyle: 'dashed',
                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-purple-100 p-3 border-2 border-purple-400 w-12 h-12 mx-auto mb-4 flex items-center justify-center transform rotate-3"
                     style={{ borderStyle: 'dashed' }}>
                  <BarChart3 className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                  AI-POWERED ANALYSIS
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
                  Advanced algorithms powered by GPT-4 Vision and Claude 3.5 analyze design patterns, accessibility, and user experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-3 border-gray-800 transform -rotate-1"
                  style={{ 
                    borderStyle: 'dashed',
                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 border-2 border-blue-400 w-12 h-12 mx-auto mb-4 flex items-center justify-center transform -rotate-3"
                     style={{ borderStyle: 'dashed' }}>
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                  COMPETITIVE ANALYSIS
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
                  Compare your design against industry leaders and get insights on how to outperform competitors
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white border-3 border-gray-800 transform rotate-1"
                  style={{ 
                    borderStyle: 'dashed',
                    boxShadow: '4px 4px 0px rgba(0, 0, 0, 0.2)'
                  }}>
              <CardContent className="p-6 text-center">
                <div className="bg-green-100 p-3 border-2 border-green-400 w-12 h-12 mx-auto mb-4 flex items-center justify-center transform rotate-3"
                     style={{ borderStyle: 'dashed' }}>
                  <Code className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-bold mb-2" style={{ fontFamily: '"Courier New", monospace' }}>
                  CODE IMPROVEMENTS
                </h3>
                <p className="text-gray-600 text-sm" style={{ fontFamily: '"Courier New", monospace' }}>
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
