import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, AlertCircle, CheckCircle2, RefreshCw } from 'lucide-react';

export default function ImageUploader({ selectedImage, onImageSelect, onClearImage, imageQuality }) {
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = (files) => {
    if (files && files[0]) {
      const file = files[0];
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid JPG, PNG, or WEBP image file.');
        return;
      }
      onImageSelect(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleClear = () => {
    setPreviewUrl(null);
    onClearImage();
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-200">
          Upload Crop Leaf Image <span className="text-emerald-400">*</span>
        </label>
        <span className="text-xs text-slate-400">JPG, PNG, WEBP (Max 10MB)</span>
      </div>

      {!previewUrl && !selectedImage ? (
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
            dragActive
              ? 'border-emerald-400 bg-emerald-500/10 scale-[1.01]'
              : 'border-slate-700/80 bg-slate-900/40 hover:border-emerald-500/50 hover:bg-slate-900/60'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="hidden"
          />

          <div className="flex flex-col items-center justify-center space-y-3">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <UploadCloud className="w-7 h-7" />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-200">
                Drag and drop your crop leaf photo here
              </p>
              <p className="text-xs text-slate-400 mt-1">or click to browse from device</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative glass-card rounded-2xl p-4 border border-emerald-500/30">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
              <img
                src={previewUrl || (typeof selectedImage === 'string' ? selectedImage : '')}
                alt="Uploaded leaf preview"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="flex-1 space-y-2 text-left">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Image Upload Preview
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {imageQuality ? (
                <div className="space-y-1 text-xs">
                  <div className="flex items-center space-x-2 text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>
                      Quality Score: <strong>{Math.round(imageQuality.score * 100)}%</strong> ({imageQuality.status})
                    </span>
                  </div>
                  <p className="text-slate-400 text-[11px]">
                    Resolution: {imageQuality.resolution} | Brightness: {imageQuality.brightness}
                  </p>
                </div>
              ) : (
                <p className="text-xs text-slate-300">
                  Ready for computer vision feature extraction and Grad-CAM explainability map generation.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
