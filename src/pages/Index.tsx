
import React, { useState } from 'react';
import { Upload, Link as LinkIcon, Figma, FileImage, FileText, Code, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import FileUpload from '@/components/FileUpload';
import AnalysisResults from '@/components/AnalysisResults';
import AnnotationCanvas from '@/components/AnnotationCanvas';

const Index = () => {
  const [activeTab, setActiveTab] = useState('url');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysis = async () => {
    setIsAnalyzing(true);
    
    // Simulate analysis process
    setTimeout(() => {
      setAnalysisResults({
        score: 78,
        issues: [
          { type: 'accessibility', severity: 'high', description: 'Low color contrast in navigation' },
          { type: 'performance', severity: 'medium', description: 'Large image files affecting load time' },
          { type: 'ux', severity: 'low', description: 'Button spacing could be improved' }
        ],
        suggestions: [
          'Increase color contrast ratio to meet WCAG AA standards',
          'Optimize images using WebP format',
          'Add more whitespace between interactive elements'
        ]
      });
      setIsAnalyzing(false);
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  UX Ray
                </h1>
                <p className="text-sm text-gray-600">AI-Powered Design Analysis</p>
              </div>
            </div>
            <Button variant="outline" className="bg-white/50">
              Sign In
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Analyze & Improve Your Design
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload websites, images, PDFs, or Figma designs to get AI-powered feedback and actionable improvements
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
                <div className="flex space-x-4">
                  <Input
                    placeholder="Enter website URL (e.g., https://example.com)"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button 
                    onClick={handleAnalysis}
                    disabled={!websiteUrl || isAnalyzing}
                    className="bg-gradient-to-r from-purple-600 to-blue-600 text-white"
                  >
                    {isAnalyzing ? 'Analyzing...' : 'Analyze Website'}
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="upload">
                <FileUpload 
                  onFilesUploaded={setUploadedFiles}
                  onAnalyze={handleAnalysis}
                  isAnalyzing={isAnalyzing}
                />
              </TabsContent>

              <TabsContent value="figma" className="space-y-4">
                <div className="text-center py-8">
                  <Figma className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Connect Figma Account</h3>
                  <p className="text-gray-600 mb-4">Authorize access to analyze your Figma designs</p>
                  <Button className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
                    Connect Figma
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="project" className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <Code className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Upload Project Files</h3>
                  <p className="text-gray-600 mb-4">
                    Upload a ZIP file containing your project for code analysis
                  </p>
                  <input
                    type="file"
                    accept=".zip,.rar"
                    className="hidden"
                    id="project-upload"
                  />
                  <label htmlFor="project-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Select ZIP File
                    </Button>
                  </label>
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
                <p className="text-gray-600">Our AI is evaluating your design and generating feedback</p>
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
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">AI-Powered Analysis</h3>
                <p className="text-gray-600 text-sm">
                  Advanced algorithms analyze design patterns, accessibility, and user experience
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm border border-gray-200">
              <CardContent className="p-6 text-center">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 mx-auto mb-4 flex items-center justify-center">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Detailed Reports</h3>
                <p className="text-gray-600 text-sm">
                  Get comprehensive feedback with specific improvement suggestions
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
                  Receive actionable code suggestions to enhance performance and accessibility
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
