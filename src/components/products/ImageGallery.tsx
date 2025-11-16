import { useState } from "react";
import type { Product } from "@/pages/Products";

interface ImageGalleryProps {
  product: Product;
}

export const ImageGallery = ({ product }: ImageGalleryProps) => {
  // For MVP, we'll use a single image or placeholder
  // In production, you'd have multiple images
  const images = product.image_url 
    ? [product.image_url]
    : ['/placeholder.svg'];
  
  const [selectedImage, setSelectedImage] = useState(0);

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="aspect-square bg-muted rounded-lg overflow-hidden border">
        <img
          src={images[selectedImage]}
          alt={product.product_name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square rounded-md overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? 'border-primary'
                  : 'border-transparent hover:border-muted-foreground'
              }`}
            >
              <img
                src={image}
                alt={`${product.product_name} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {/* Placeholder for future images */}
      {images.length === 1 && (
        <div className="text-center text-sm text-muted-foreground">
          Multiple product images coming soon
        </div>
      )}
    </div>
  );
};
