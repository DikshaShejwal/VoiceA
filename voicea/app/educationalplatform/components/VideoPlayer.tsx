interface VideoPlayerProps {
  videoUrl: string;
  onClose: () => void;
  onEnded?: () => void;
}

const VideoPlayer = ({ videoUrl, onClose, onEnded }: VideoPlayerProps) => {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative w-full max-w-3xl">
        <video
          src={videoUrl}
          controls
          autoPlay
          className="w-full rounded-lg"
          onEnded={onEnded}
        />
        <button
          onClick={onClose}
          className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded"
        >
          ✖ Close
        </button>
      </div>
    </div>
  );
};

export default VideoPlayer;
