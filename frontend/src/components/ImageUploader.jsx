import React, { useState, useRef } from 'react';
import { UploadCloud, Link as LinkIcon, Image as ImageIcon, X, AlertCircle, CheckCircle2, Globe, Sparkles, Loader2 } from 'lucide-react';

const SAMPLE_URLS = [
  {
    name: 'Potato Leaf (Late Blight)',
    crop: 'Potato',
    url: 'https://upload.wikimedia.org/wikipedia/commons/a/aa/Late_blight_on_potato_leaf_2.jpg',
  },
  {
    name: 'Tomato Leaf (Foliage)',
    crop: 'Tomato',
    url: 'https://upload.wikimedia.org/wikipedia/commons/8/89/Tomato_je.jpg',
  },
  {
    name: 'Corn Foliage (Rust Leaf)',
    crop: 'Corn',
    url: 'https://raw.githubusercontent.com/spMohanty/PlantVillage-Dataset/master/raw/color/Corn_(maize)___Common_rust_/RS_Rust%201563.JPG',
  },
];

export default function ImageUploader({ selectedImage, onImageSelect, onClearImage, imageQuality }) {
  const [activeTab, setActiveTab] = useState('file'); // 'file' or 'url'
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(typeof selectedImage === 'string' ? selectedImage : null);
  const [urlInput, setUrlInput] = useState('');
  const [urlLoading, setUrlLoading] = useState(false);
  const [urlError, setUrlError] = useState(null);
  const inputRef = useRef(null);

  React.useEffect(() => {
    if (!selectedImage) {
      setPreviewUrl(null);
    } else if (typeof selectedImage === 'string') {
      setPreviewUrl(selectedImage);
    }
  }, [selectedImage]);

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
      setUrlError(null);
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

  const handleLoadUrl = (urlToLoad, cropMeta = null) => {
    const targetUrl = (urlToLoad || urlInput).trim();
    if (!targetUrl) {
      setUrlError('Please enter a valid image URL.');
      return;
    }

    setUrlLoading(true);
    setUrlError(null);

    // Test image loading in browser
    const img = new Image();
    img.onload = () => {
      setUrlLoading(false);
      setPreviewUrl(targetUrl);
      onImageSelect(targetUrl, cropMeta);
    };
    img.onerror = () => {
      setUrlLoading(false);
      setUrlError('Could not load image from this URL. Please verify the link is a direct image (JPG/PNG/WEBP) and allows public access.');
    };
    img.src = targetUrl;
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setUrlInput('');
    setUrlError(null);
    onClearImage();
    if (inputRef.current) inputRef.current.value = '';
  };

  const isUrlSource = typeof selectedImage === 'string' || (previewUrl && previewUrl.startsWith('http'));

  return (
    <div className="space-y-4">
      {/* Header with Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <label className="block text-sm font-semibold text-slate-200">
            Crop Leaf Image <span className="text-emerald-400">*</span>
          </label>
          <span className="text-xs text-slate-400">JPG, PNG, WEBP (Max 10MB) or Direct Image URL</span>
        </div>

        {!previewUrl && !selectedImage && (
          <div className="inline-flex p-1 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => { setActiveTab('file'); setUrlError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'file'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Upload File</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('url'); setUrlError(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'url'
                  ? 'bg-emerald-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LinkIcon className="w-3.5 h-3.5" />
              <span>Image Link / URL</span>
            </button>
          </div>
        )}
      </div>

      {/* Upload Zone or URL Input */}
      {!previewUrl && !selectedImage ? (
        activeTab === 'file' ? (
          /* File Drag-and-Drop */
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
          /* URL Input Box */
          <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
            <div className="space-y-2 text-left">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-emerald-400" />
                <span>Enter Public Image Web Address</span>
              </label>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="url"
                    placeholder="https://images.example.com/plant-leaves/potato-leaf.jpg"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleLoadUrl(); } }}
                    className="w-full glass-input rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:border-emerald-400"
                  />
                </div>

                <button
                  type="button"
                  disabled={urlLoading || !urlInput.trim()}
                  onClick={() => handleLoadUrl()}
                  className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  {urlLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Load Image</span>
                    </>
                  )}
                </button>
              </div>

              {urlError && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs mt-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span>{urlError}</span>
                </div>
              )}
            </div>

            {/* Quick Sample Presets */}
            <div className="pt-2 border-t border-slate-800 text-left">
              <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block mb-2">
                Quick Sample Images (1-Click Test):
              </span>
              <div className="flex flex-wrap gap-2">
                {SAMPLE_URLS.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setUrlInput(sample.url);
                      handleLoadUrl(sample.url, sample.crop);
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white border border-slate-700 text-xs flex items-center gap-1.5 transition-colors cursor-pointer hover:border-emerald-500/50"
                  >
                    <span>🌱</span>
                    <span>{sample.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      ) : (
        /* Image Preview Card */
        <div className="relative glass-card rounded-2xl p-4 border border-emerald-500/30">
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="relative w-36 h-36 rounded-xl overflow-hidden border border-slate-700 bg-slate-950 flex-shrink-0">
              <img
                src={previewUrl || (typeof selectedImage === 'string' ? selectedImage : '')}
                alt="Selected crop leaf preview"
                className="w-full h-full object-cover"
                onError={() => {
                  setUrlError("Failed to render image preview from this source.");
                  handleClear();
                }}
              />
            </div>

            <div className="flex-1 space-y-2 text-left w-full">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isUrlSource ? 'Online Image URL' : 'File Upload'} Ready</span>
                </span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {isUrlSource && (
                <p className="text-slate-400 text-[11px] truncate max-w-md font-mono bg-slate-900/60 px-2 py-1 rounded border border-slate-800">
                  {typeof selectedImage === 'string' ? selectedImage : previewUrl}
                </p>
              )}

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
                  Ready for deep learning leaf pathogen classification and Grad-CAM explainability heatmap overlay.
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
