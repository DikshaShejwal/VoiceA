import { useState, useEffect } from "react";
import axios from "axios";
import VideoPlayer from "../../components/VideoPlayer";

const API_URL = "https://voicea-ny1b.onrender.com/api/videos";

interface Props {
  userRole: string;
  userEmail: string;
}

const StudentViewVideos = ({ userRole, userEmail }: Props) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [playingIndex, setPlayingIndex] = useState<number>(0);

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const res = await axios.get(API_URL);
      const sortedVideos = res.data.sort(
        (a: any, b: any) =>
          new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      );
      setVideos(sortedVideos);
      if (sortedVideos.length > 0) {
        setPlayingIndex(0);
      }
    } catch (error) {
      console.error("Error fetching videos:", error);
    }
  };

  const handleVideoEnd = () => {
    if (playingIndex < videos.length - 1) {
      setPlayingIndex(playingIndex + 1);
    }
  };

  const handleDelete = async (videoId: string) => {
    try {
      await axios.delete(`${API_URL}/${videoId}`);
      setVideos(videos.filter((vid) => vid._id !== videoId));
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-purple-600 text-center mb-4">
        {userRole === "teacher" ? "Teacher: Manage Uploaded Videos" : "Student: View Uploaded Videos"}
      </h2>

      {videos.length === 0 ? (
        <p className="text-center text-gray-600">No videos available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {videos.map((vid, index) => (
            <div key={vid._id} className="bg-white p-4 rounded-lg shadow">
              <p className="font-semibold">{vid.title}</p>
              <p className="text-sm text-gray-600">{vid.description}</p>

              <div className="flex justify-between mt-2">
                <button
                  onClick={() => setPlayingIndex(index)}
                  className="text-blue-600"
                >
                  ▶ Play
                </button>
                {userRole === "teacher" && (
                  <button
                    onClick={() => handleDelete(vid._id)}
                    className="text-red-600"
                  >
                    🗑 Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {videos.length > 0 && playingIndex < videos.length && (
        <VideoPlayer
          videoUrl={videos[playingIndex].videoUrl}
          onEnded={handleVideoEnd}
          onClose={() => setPlayingIndex(videos.length)}
        />
      )}
    </div>
  );
};

export default StudentViewVideos;
