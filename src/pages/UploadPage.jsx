import React, { useState } from "react";
import { axiosInstance } from "../axios/axiosInstance";
import { ErrorToast, SuccessToast } from "../utils/toastHelper";
import { useNavigate } from "react-router-dom";

export const UploadPage = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audio, setAudio] = useState(null);

  const handleUpload = async () => {
    if (!title || !artist || !audio) {
      ErrorToast("Please fill all fields and select an audio file.");
      return;
    }

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
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-semibold text-neutral-300 mb-1">Audio File</label>
          <input
            type="file"
            accept="audio/*"
            onChange={(e) => setAudio(e.target.files[0])}
            className="w-full px-2 py-2 bg-black border border-neutral-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-1/2 bg-neutral-700 hover:bg-neutral-600 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Back
          </button>

          <button
            onClick={handleUpload}
            className="w-1/2 bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition"
          >
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};
