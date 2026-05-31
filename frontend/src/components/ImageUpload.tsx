import { useRef, useState } from 'react';

interface Props {
  value: string;
  onChange: (url: string) => void;
}

export default function ImageUpload({ value, onChange }: Props) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onChange(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div
      className={`image-upload ${dragging ? 'image-upload--drag' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleChange}
      />
      {value ? (
        <div className="image-upload__preview">
          <img src={value} alt="preview" />
          <button
            type="button"
            className="image-upload__remove"
            onClick={(e) => { e.stopPropagation(); onChange(''); }}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className="image-upload__placeholder">
          <span className="image-upload__icon">🖼</span>
          <span className="image-upload__text">
            Перетягніть зображення або <u>оберіть файл</u>
          </span>
          <span className="image-upload__hint">PNG, JPG, WEBP</span>
        </div>
      )}
    </div>
  );
}
