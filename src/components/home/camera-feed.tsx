import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Camera } from 'lucide-react';

export function CameraFeed() {
  const cameraFeedImage = PlaceHolderImages.find(
    (p) => p.id === 'camera-feed-person'
  );

  return (
    <Card>
      <CardContent className="relative aspect-[3/4] p-0 overflow-hidden">
        {cameraFeedImage ? (
          <Image
            src={cameraFeedImage.imageUrl}
            alt={cameraFeedImage.description}
            data-ai-hint={cameraFeedImage.imageHint}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
            <Camera className="w-16 h-16 text-muted-foreground" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-white">
          <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          <span>REC</span>
        </div>
      </CardContent>
    </Card>
  );
}
