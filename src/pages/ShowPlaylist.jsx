import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Trash2, Edit, MoreVertical } from "lucide-react";

export default function ShowPlaylist() {
  const url = import.meta.env.VITE_API_URL;
  const { id } = useParams();
  const navigate = useNavigate();

  const [playlist, setPlaylist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [openMenu, setOpenMenu] = useState(null); 
  const [message, setmessage] = useState("")

  const shortText = (s = "", n = 60) =>
    s.length > n ? s.slice(0, n - 1) + "…" : s

  const fetchPlaylist = async () => {
    try {
      setLoading(true);
      const data = await fetch(
        `${url}/api/playlist/get-playlist-byId/${id}`,
        {
          credentials: "include",
        }
      );
      const res = await data.json();
      const pl = Array.isArray(res.data) ? res.data[0] : res.data;

      // ✅ add isOptionsVisible = false to every video
      if (pl && Array.isArray(pl.videos)) {
        pl.videos = pl.videos.map((v) => ({ ...v, isOptionsVisible: false }))
      }

      setPlaylist(pl || null);
    } catch (err) {
      console.error(err);
      setError("Failed to load playlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaylist();
  }, [id, url]);

  const handleDeletePlaylist = async () => {
    if (!playlist) return;
    const ok = confirm("Delete this playlist? This cannot be undone.");
    if (!ok) return;

    try {
      const resp = await fetch(`${url}/api/playlist/delete-playlist/${playlist._id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const json = await resp.json();
      if (resp.ok) {
        navigate(-1);
      } else {
        alert(json.message || "Could not delete playlist");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting playlist");
    }
  };

  const handleEdit = () => {
    if (!playlist) return;
    setEditing(true);
    setEditName(playlist.name);
    setEditDescription(playlist.description);
  };

  const handleSave = async () => {
    try {
      setmessage("Saving...")
      const resp = await fetch(`${url}/api/playlist/update-playlist/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: editName,
          description: editDescription,
        }),
      });
      // await resp.json();
      setmessage("")
      setEditing(false);
      fetchPlaylist();
    } catch (err) {
      console.error(err);
      alert("Error updating playlist");
    }
  };

  const handleDeleteVideo = async (videoId) => {
    const ok = confirm("Remove this video from playlist?");
    if (!ok) return;
    try {
      const data = await fetch(`${url}/api/playlist/remove/${id}/${videoId}`, {
        method: "GET",
        credentials: "include",
      });
      const res = await data.json()
      console.log(res)
      fetchPlaylist();
    } catch (err) {
      console.error(err);
      alert("Error removing video");
    }
  };

  const toggleOptions = (videoId) => {
    setPlaylist((prev) => ({
      ...prev,
      videos: prev.videos.map((v) =>
        v._id === videoId ? { ...v, isOptionsVisible: !v.isOptionsVisible } : v
      ),
    }));
  };

  if (loading) return <div className="p-6">Loading playlist…</div>;
  if (error) return <div className="p-6 text-red-500">{error}</div>;
  if (!playlist) return <div className="p-6">Playlist not found</div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          {editing ? (
            <>
              <input
                className="border px-2 py-1 rounded w-full mb-2"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
              />
              <textarea
                className="border px-2 py-1 rounded w-full h-[250px]"
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
              />
              <button
                onClick={handleSave}
                className="mt-2 px-4 py-2 rounded bg-green-500 text-white"
              >
                Save Changes
              </button>

              <div className="text-2xl font-bold">{message}</div>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-extrabold mb-2">
                {playlist.name}
              </h1>
              <p className="text-gray-600 max-w-2xl">{playlist.description}</p>
            </>
          )}
        </div>

        {!editing && (
          <div className="flex items-center gap-3">
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border hover:shadow-md transition bg-white"
              aria-label="Edit playlist"
            >
              <Edit className="w-4 h-4" />
              <span className="hidden sm:inline">Edit</span>
            </button>

            <button
              onClick={handleDeletePlaylist}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-red-50 text-red-600 hover:bg-red-100 transition"
              aria-label="Delete playlist"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Videos grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(playlist.videos) && playlist.videos[0]._id  ? (
          playlist.videos.map((v) => (
            <div key={v._id} className="flex flex-col gap-3 relative">
              <div
                className="nail cursor-pointer rounded-3xl overflow-hidden"
                onClick={() => navigate(`/video/${v._id}`)}
              >
                <img
                  src={v.thumbnail}
                  alt={v.title}
                  className="w-full h-48 object-cover rounded-2xl shadow-xl"
                />
              </div>

              <div className="user flex flex-col items-start gap-3">
                <div className="flex items-start gap-3 w-full relative">
                  <div
                  onClick={() => {navigate(`/profile/${v.onwer?._id}`)}}
                  className="cursor-pointer user-logo rounded-full w-[40px] h-[40px] overflow-hidden bg-slate-200 flex-shrink-0">
                    <img
                      src={v.owner?.profilePic}
                      alt={v.owner?.username || "user"}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-sm md:text-base">
                      {shortText(v.title, 60)}
                    </h2>
                    <div className="text-xs text-gray-500 mt-1">
                      <div>{v.owner?.username}</div>
                      <div className="flex gap-4 mt-1 text-xs text-gray-400">
                        <div>{v.views ?? 0} views</div>
                        <div>{new Date(v.createdAt).toDateString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="ml-auto relative">
                    <button
                      onClick={() => toggleOptions(v._id)}
                      className="p-1 rounded hover:bg-gray-100"
                    >
                      <MoreVertical className="w-5 h-5 text-gray-600" />
                    </button>
                    {v.isOptionsVisible && (
                      <div className="absolute right-0 mt-2 bg-white shadow-lg rounded p-2 z-10">
                        <button
                          onClick={() => handleDeleteVideo(v._id)}
                          className="flex items-center gap-2 text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No videos in this playlist.</div>
        )}
      </div>
    </div>
  );
}
