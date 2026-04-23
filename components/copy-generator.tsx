'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface CopyGeneratorProps {
  onGenerated?: (copy: string) => void;
}

export function CopyGenerator({ onGenerated }: CopyGeneratorProps) {
  const [topic, setTopic] = useState('');
  const [tone, setTone] = useState('professional');
  const [generatedCopy, setGeneratedCopy] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-copy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, tone }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedCopy(data.copy);
        onGenerated?.(data.copy);
        toast.success('Copy generated successfully');
      } else {
        toast.error('Failed to generate copy');
      }
    } catch (error) {
      toast.error('Error generating copy');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Copy Generator</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="text-sm font-medium">Topic</label>
          <Textarea
            placeholder="Describe your product or service..."
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            disabled={isLoading}
            className="mt-2"
          />
        </div>

        <div>
          <label className="text-sm font-medium">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            disabled={isLoading}
            className="w-full mt-2 px-3 py-2 border rounded-md"
          >
            <option value="professional">Professional</option>
            <option value="casual">Casual</option>
            <option value="funny">Funny</option>
            <option value="urgent">Urgent</option>
          </select>
        </div>

        <Button onClick={handleGenerate} disabled={isLoading} className="w-full">
          {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
          {isLoading ? 'Generating...' : 'Generate Copy'}
        </Button>

        {generatedCopy && (
          <div className="p-4 bg-muted rounded-md">
            <h4 className="font-semibold mb-2">Generated Copy:</h4>
            <p className="whitespace-pre-wrap">{generatedCopy}</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={() => {
                navigator.clipboard.writeText(generatedCopy);
                toast.success('Copied to clipboard');
              }}
            >
              Copy to Clipboard
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
