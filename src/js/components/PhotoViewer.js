import React from 'react';

function PhotoViewer({ photos, currentIndex, onClose, onNavigate }) {
  if (!photos || photos.length === 0) return null;

  const currentPhoto = photos[currentIndex];
  const hasPrevious = currentIndex > 0;
  const hasNext = currentIndex < photos.length - 1;

  const handlePrevious = () => {
    if (hasPrevious) {
      onNavigate(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onNavigate(currentIndex + 1);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft' && hasPrevious) {
      handlePrevious();
    } else if (e.key === 'ArrowRight' && hasNext) {
      handleNext();
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
      <div className="relative max-w-4xl max-h-full p-4">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-red-500 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-red-600 transition-colors"
        >
          <i className="fas fa-times"></i>
        </button>

        {/* Navigation buttons */}
        {hasPrevious && (
          <button
            onClick={handlePrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
          >
            <i className="fas fa-chevron-left"></i>
          </button>
        )}

        {hasNext && (
          <button
            onClick={handleNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white rounded-full w-12 h-12 flex items-center justify-center hover:bg-opacity-75 transition-colors"
          >
            <i className="fas fa-chevron-right"></i>
          </button>
        )}

        {/* Main image */}
        <div className="flex items-center justify-center">
          <img
            src={`file://${currentPhoto.photo_path}`}
            alt={`Photo ${currentPhoto.photo_order}`}
            className="max-w-full max-h-full object-contain rounded-lg"
            style={{ maxHeight: '80vh' }}
          />
        </div>

        {/* Photo info and counter */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
          <p className="text-sm">
            Photo {currentPhoto.photo_order} of {photos.length}
          </p>
          {currentPhoto.original_filename && (
            <p className="text-xs text-gray-300">{currentPhoto.original_filename}</p>
          )}
        </div>

        {/* Thumbnail navigation */}
        {photos.length > 1 && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id}
                onClick={() => onNavigate(index)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex ? 'border-blue-500' : 'border-gray-300'
                }`}
              >
                <img
                  src={`file://${photo.photo_path}`}
                  alt={`Thumbnail ${photo.photo_order}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default PhotoViewer;
