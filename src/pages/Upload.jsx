import React, { useState } from "react";
import { Upload, Image, FileText, Type } from "lucide-react";
import { Navigate,useNavigate } from "react-router-dom";

export default function UploadPage() {
    const navigate = useNavigate()
    const [loading, setloading] = useState(false)
    const url = import.meta.env.VITE_API_URL
  const [form, setForm] = useState({
    videoFile: null,
    thumbnail: null,
    title: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    setloading(true)
    e.preventDefault();
    const data = new FormData();
    data.append("videoFile", form.videoFile);
    data.append("thumbnail", form.thumbnail);
    data.append("title", form.title);
    data.append("description", form.description);

    // fetch("/api/upload", { method: "POST", body: data });
    // console.log("FormData :", [...data.entries()]);
    const upload = await fetch(`${url}/api/video/upload-video`, { credentials:"include",method: "POST", body: data });
    setloading(false)
    // const res = await upload.json()
    // console.log(res)
    navigate("/my-videos")
  };
  if(loading){
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Upload New Video
        </h2>

        {/* Video File */}
        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-blue-500 transition">
          <Upload className="w-8 h-8 text-gray-500" />
          <span className="text-gray-600 text-sm">
            {form.videoFile ? form.videoFile.name : "Choose Video File"}
          </span>
          <input
            type="file"
            name="videoFile"
            accept="video/*"
            onChange={handleChange}
            className="hidden"
            required
          />
        </label>

        {/* Thumbnail */}
        <label className="flex flex-col items-center gap-2 border-2 border-dashed border-gray-300 rounded-xl p-6 cursor-pointer hover:border-green-500 transition">
          <Image className="w-8 h-8 text-gray-500" />
          <span className="text-gray-600 text-sm">
            {form.thumbnail ? form.thumbnail.name : "Upload Thumbnail"}
          </span>
          <input
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>

        {/* Title */}
        <div className="flex items-center gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <Type className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="Video Title"
            className="w-full outline-none text-gray-700"
            required
          />
        </div>

        {/* Description */}
        <div className="flex items-start gap-2 border rounded-xl px-3 py-2 focus-within:ring-2 focus-within:ring-blue-500">
          <FileText className="w-5 h-5 text-gray-400 mt-1" />
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Video Description"
            rows="4"
            className="w-full outline-none text-gray-700 resize-none"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium shadow-md hover:shadow-lg hover:opacity-90 active:scale-95 transition-all"
        >
          Upload Video
        </button>
      </form>
    </div>
  );
}
