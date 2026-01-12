# PWA Icons Generation Guide

This directory should contain PWA icons in the following sizes:
- icon-72x72.png
- icon-96x96.png
- icon-128x128.png
- icon-144x144.png
- icon-152x152.png
- icon-192x192.png
- icon-384x384.png
- icon-512x512.png

## Quick Generation Methods

### Option 1: Online Tool (Easiest)
1. Visit https://www.pwabuilder.com/imageGenerator
2. Upload a 512x512 or larger square PNG/SVG
3. Download the generated icon pack
4. Extract all icons to this directory

### Option 2: Using ImageMagick (Command Line)
```bash
# Install ImageMagick if needed
# macOS: brew install imagemagick
# Ubuntu: sudo apt-get install imagemagick

# Generate all sizes from source.png (must be 512x512 or larger)
convert source.png -resize 72x72 icon-72x72.png
convert source.png -resize 96x96 icon-96x96.png
convert source.png -resize 128x128 icon-128x128.png
convert source.png -resize 144x144 icon-144x144.png
convert source.png -resize 152x152 icon-152x152.png
convert source.png -resize 192x192 icon-192x192.png
convert source.png -resize 384x384 icon-384x384.png
convert source.png -resize 512x512 icon-512x512.png
```

### Option 3: Automated Script
Save this as `generate-icons.sh` in the project root:

```bash
#!/bin/bash
SOURCE="$1"
SIZES=(72 96 128 144 152 192 384 512)

if [ -z "$SOURCE" ]; then
  echo "Usage: ./generate-icons.sh source-image.png"
  exit 1
fi

if ! command -v convert &> /dev/null; then
  echo "ImageMagick not found. Install with: brew install imagemagick"
  exit 1
fi

for size in "${SIZES[@]}"; do
  convert "$SOURCE" -resize ${size}x${size} "public/icons/icon-${size}x${size}.png"
  echo "Generated icon-${size}x${size}.png"
done

echo "All icons generated successfully!"
```

## Design Recommendations
- Use a square image (1:1 aspect ratio)
- Minimum source resolution: 512x512 pixels (1024x1024 recommended)
- Simple, recognizable design that works at small sizes
- Ensure good contrast with both light and dark backgrounds
- Consider "maskable" icon requirements (safe zone in center)
- File format: PNG with transparency support

## Maskable Icons
Icons marked as "maskable" in manifest.json (192x192 and 512x512) should have:
- Important content within the central 80% circle
- Safe zone to accommodate different device shapes
- Test at https://maskable.app/

## Temporary Placeholder
If you need to test PWA functionality before creating final icons, you can use a simple colored square:

```bash
# Create simple placeholder (requires ImageMagick)
convert -size 512x512 xc:#3b82f6 -gravity center -pointsize 200 -fill white -annotate +0+0 "PM" icon-512x512.png
```

Then resize to other sizes as shown above.
