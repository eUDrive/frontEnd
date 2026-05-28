import { useState } from 'react';

interface ImageData {
  url: string;
}

interface ImageUploaderProps {
  images: ImageData[];
  onImagesChange: (images: ImageData[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const [previewUrls, setPreviewUrls] = useState<string[]>(
    images.map(img => img.url)
  );

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (!files) return;

    const MAX_FILE_SIZE = 500 * 1024; // 500KB

    Array.from(files).forEach((file) => {
      // Проверка размера
      if (file.size > MAX_FILE_SIZE) {
        alert(`❌ Файл "${file.name}" слишком большой! Макс 500KB. Сожми картинку онлайн: tinypng.com`);
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        const newImages = [...images, { url: dataUrl }];
        const newPreviews = [...previewUrls, dataUrl];
        
        setPreviewUrls(newPreviews);
        onImagesChange(newImages);
      };

      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    setPreviewUrls(newPreviews);
    onImagesChange(newImages);
  };

  return (
    <div className="image-uploader">
      <label>🖼️ Картинки продукта (макс 500KB за файл)</label>
      
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        style={{ marginBottom: '10px', display: 'block' }}
      />

      <div className="image-preview-grid">
        {previewUrls.map((url, index) => (
          <div key={index} className="image-preview-item">
            <img src={url} alt={`Product preview ${index}`} />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="btn-remove-image"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}