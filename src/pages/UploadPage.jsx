import React, { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useNavigate } from "react-router-dom";

export const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async () => {
    if (!title || !artist || !audio) {
      ErrorToast("Please fill all fields and select an audio file.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("title", title);
    formData.append("artist", artist);
    formData.append("audio", audio);

    try {
      const res = await axiosInstance.post("/songs/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      SuccessToast("Upload successful!");
      setTitle("");
      setArtist("");
      setAudio(null);
      navigate("/"); // Redirect to home page
    } catch (err) {
      ErrorToast(err.response?.data?.error || "Upload failed!");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-[#181818] p-8 rounded-xl border border-neutral-800 w-full max-w-md text-white">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Song</h2>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-300 mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Song Title"
            disabled={isUploading}
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-semibold text-neutral-300 mb-1">Artist</label>
          <input
            type="text"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="w-full px-4 py-2 bg-black border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Artist Name"
            disabled={isUploading}
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-300 mb-1">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            className="w-full px-2 py-2 bg-black border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            disabled={isUploading}
          />
        </div>

        {/* Loading Screen */}
        {isUploading && (
          <div className="mb-6 p-4 bg-neutral-800 rounded-lg border border-neutral-700">
            <div className="flex items-center justify-center gap-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-500"></div>
              <span className="text-green-400 font-medium">Uploading your song...</span>
            </div>
            <p className="text-sm text-neutral-400 text-center mt-2">Please wait, this may take a few moments</p>
          </div>
        )}

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isUploading}
          >
            Back
          </button>

          <button
            onClick={handleUpload}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Uploading...
              </>
            ) : (
              "Upload"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
