import { useRef, useState } from 'react';

// Represents one image entry — either a picked File or an existing URL from the server
export interface ImageEntry {
  id?: number;
  file?: File;       // present for newly picked files
  preview: string;  // object URL (new files) or server URL (existing)
  isExisting?: boolean; // true when loaded from DB, no upload needed
}

interface ImageUploaderProps {
  images: ImageEntry[];
  onImagesChange: (images: ImageEntry[]) => void;
}

export function ImageUploader({ images, onImagesChange }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [urlInput, setUrlInput] = useState('');

  // ── File picker ──────────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.currentTarget.files || []);
    if (!files.length) return;

    const newEntries: ImageEntry[] = files.map((file) => ({
      file,
      preview: URL.createObjectURL(file), // only for display; File is the real payload
    }));

    onImagesChange([...images, ...newEntries]);
    e.currentTarget.value = ''; // reset so the same file can be re-selected
  };

  // ── URL input ─────────────────────────────────────────────────────────────────
  const handleAddUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) {
      alert('Введите URL изображения');
      return;
    }
    try {
      new URL(trimmed);
    } catch {
      alert('❌ Некорректный URL');
      return;
    }

    const newEntry: ImageEntry = {
      preview: trimmed,
      isExisting: true, // URL-based entries are treated as already on the server
    };

    onImagesChange([...images, newEntry]);
    setUrlInput('');
  };

  // ── Remove ────────────────────────────────────────────────────────────────────
  const handleRemove = (index: number) => {
    const entry = images[index];
    // Release object URL memory for file-based previews
    if (entry.file) URL.revokeObjectURL(entry.preview);
    onImagesChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="image-uploader">
      <label>🖼️ Картинки продукта</label>

      {/* ── File upload ── */}
      <div style={{ marginBottom: '15px' }}>
        <h4>📤 Загрузить файл</h4>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            padding: '8px 16px',
            background: '#ea6666',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Выбрать файл(ы)
        </button>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleFileSelect}
        />
      </div>

      {/* ── URL input ── */}
      <div
        style={{
          marginBottom: '15px',
          borderTop: '1px solid #ddd',
          paddingTop: '15px',
        }}
      >
        <h4>🔗 Или добавить по ссылке</h4>
        <div style={{ display: 'flex', gap: '10px' }}>
          <input
            type="text"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/image.jpg"
            style={{
              flex: 1,
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
            }}
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

      {/* ── Previews ── */}
      {images.length > 0 && (
        <div>
          <h4>📸 Предпросмотр ({images.length})</h4>
          <div className="image-preview-grid">
            {images.map((entry, index) => (
              <div key={index} className="image-preview-item" style={{ position: 'relative' }}>
                <img
                  src={entry.preview}
                  alt={`preview-${index}`}
                  style={{ maxHeight: '150px', objectFit: 'cover' }}
                />
                {/* Badge so the admin can see which are new vs existing */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '5px',
                    left: '5px',
                    background: entry.file ? '#28a745' : '#6c757d',
                    color: 'white',
                    fontSize: '10px',
                    padding: '2px 5px',
                    borderRadius: '3px',
                  }}
                >
                  {entry.file ? 'новый' : 'ссылка'}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
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
