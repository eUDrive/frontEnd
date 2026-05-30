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
  const [urlInput, setUrlInput] = useState('');

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

  const handleAddUrl = () => {
    if (!urlInput.trim()) {
      alert('Введите URL изображения');
      return;
    }

    try {
      new URL(urlInput); // Проверка валидности URL
      const newImages = [...images, { url: urlInput }];
      const newPreviews = [...previewUrls, urlInput];
      
      setPreviewUrls(newPreviews);
      onImagesChange(newImages);
      setUrlInput('');
    } catch {
      alert('❌ Некорректный URL');
    }
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
      
      <div style={{ marginBottom: '15px' }}>
        <h4>📤 Загрузить файл</h4>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          style={{ marginBottom: '10px', display: 'block' }}
        />
      </div>

      <div style={{ marginBottom: '15px', borderTop: '1px solid #ddd', paddingTop: '15px' }}>
        <h4>🔗 Или добавить по ссылке</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{ flex: 1, padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          />
          <button
            type="button"
            onClick={handleAddUrl}
            style={{
              padding: '8px 16px',
              background: '#ea6666',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Добавить
          </button>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div>
          <h4>📸 Предпросмотр ({previewUrls.length})</h4>
          <div className="image-preview-grid">
            {previewUrls.map((url, index) => (
              <div key={index} className="image-preview-item">
                <img src={url} alt={`Product preview ${index}`} style={{ maxHeight: '150px', objectFit: 'cover' }} />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="btn-remove-image"
                  style={{
                    position: 'absolute',
                    top: '5px',
                    right: '5px',
                    background: '#dc3545',
                    color: 'white',
                    border: 'none',
                    borderRadius: '50%',
                    width: '24px',
                    height: '24px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
