'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Sparkles, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { PLATFORMS } from '@/lib/constants';
import type { PlatformType, GeneratedAdCopy } from '@/lib/types';

interface AICopyGeneratorProps {
  platform: PlatformType;
  onCopySelect?: (copy: GeneratedAdCopy) => void;
}

export default function AICopyGenerator({ platform, onCopySelect }: AICopyGeneratorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<GeneratedAdCopy | null>(null);
  const [productName, setProductName] = useState('');
  const [targetAudience, setTargetAudience] = useState('');

  const handleGenerate = async () => {
    if (!productName.trim()) {
      toast.error('Please enter a product name');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          productName,
          targetAudience,
          tone: 'professional',
        }),
      });

      const data = await response.json();

      if (data.success) {
        setGeneratedCopy(data.data);
        toast.success('Ad copy generated successfully!');
      } else {
        toast.error(data.error || 'Failed to generate copy');
      }
    } catch (error) {
      toast.error('Failed to generate copy');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2"
      >
        <Sparkles className="w-4 h-4" />
        Generate Copy
      </Button>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-500" />
              AI Ad Copy Generator
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Generate optimized copy for {PLATFORMS[platform].name}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </Button>
        </div>

        {!generatedCopy ? (
          <>
            {/* Input Fields */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Product/Service Name *</label>
                <Input
                  placeholder="e.g., Summer Collection Shoes"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Target Audience (Optional)</label>
                <Input
                  placeholder="e.g., Young professionals, Fashion enthusiasts"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Generate Button */}
            <Button
              className="w-full flex items-center justify-center gap-2"
              onClick={handleGenerate}
              disabled={isLoading || !productName.trim()}
            >
              <Sparkles className="w-4 h-4" />
              {isLoading ? 'Generating...' : 'Generate Copy'}
            </Button>
          </>
        ) : (
          <>
            {/* Generated Copy */}
            <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  HEADLINE
                </label>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-base font-semibold">{generatedCopy.headline}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(generatedCopy.headline)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  DESCRIPTION
                </label>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-slate-700">{generatedCopy.description}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(generatedCopy.description)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground mb-2">
                  CALL TO ACTION
                </label>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-medium text-blue-600">{generatedCopy.callToAction}</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(generatedCopy.callToAction)}
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Variations */}
            {generatedCopy.variations.length > 0 && (
              <div>
                <label className="block text-sm font-semibold mb-3">Headline Variations</label>
                <div className="space-y-2">
                  {generatedCopy.variations.map((variation, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between gap-2 p-3 bg-slate-50 rounded"
                    >
                      <p className="text-sm">{variation}</p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(variation)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
                onClick={handleGenerate}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </Button>
              {onCopySelect && (
                <Button
                  className="flex-1"
                  onClick={() => {
                    onCopySelect(generatedCopy);
                    setIsOpen(false);
                  }}
                >
                  Use This Copy
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
