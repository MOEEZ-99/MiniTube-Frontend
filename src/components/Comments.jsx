import React, { useEffect, useState } from 'react'
import likedVideo from "../assets/likedVideos.svg"

export const Comments = ({ videoId }) => {
    const url = import.meta.env.VITE_API_URL
    const [comments, setcomments] = useState([])
    const [user, setuser] = useState(null)
    const [loading, setloading] = useState(true)
    const [showCommentBtn, setshowCommentBtn] = useState(false)
    const [commentvalue, setcommentvalue] = useState("")
    const [editValue, seteditValue] = useState("")
    const getAllComments = async () => {
        const data = await fetch(`${url}/api/comment/get-comments/${videoId}`, {
            credentials: "include"
        })
        const user = await fetch(`${url}/api/user`, {
            credentials: "include"
        })
        const comments = await data.json()
        const userData = await user.json()
        setcomments(comments.data.comments.map(c => ({ ...c, isEditing: false })));
        setuser(userData.data)
        // console.log(comments)
        setloading(false)
    }

    const postComment = async () => {
        const postComment = await fetch(`${url}/api/comment/add-comment/${videoId}`,
            {
                credentials: "include",
                method: "POST",
                body: JSON.stringify({
                    content: commentvalue,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            }
        )
        const comment = await postComment.json()
        // console.log(comment)
        setcommentvalue("")
        getAllComments()
    }

    const likeComment = async (commentId) => {
        const data = await fetch(`${url}/api/like/toogle-comment-like/${commentId}`, { credentials: "include" })
        const res = await data.json()
        console.log(res)
        getAllComments()
    }

    const deleteComment = async (commentId) => {
        const c = confirm("Are you sure you want to delete this comment?")
        if (c) {
            const data = await fetch(`${url}/api/comment/delete-comment/${commentId}`, { credentials: "include", method: "DELETE" })
            const res = await data.json()
            getAllComments()
        }
    }

    const toggleEdit = (commentId) => {
        setcomments(comments.map(p =>
            p._id === commentId
                ? { ...p, isEditing: !p.isEditing }
                : p
        ));
        const commentvalue = comments.find(c => c._id === commentId).content
        seteditValue(commentvalue)
    }

    const editComment = async (commentId) => { 
        const data = await fetch(`${url}/api/comment/update-comment/${commentId}`, { credentials: "include", method: "POST", body: JSON.stringify({ content: editValue }), headers: { "Content-Type": "application/json" } })
        const res = await data.json()
        console.log(res)
        seteditValue("")
        setcomments(comments.map((p) => {
            if (p._id === commentId) {
                return { ...p, isEditing: false }
            }
            return p
        }))
        getAllComments()
    }
    useEffect(() => {
        getAllComments()
    }, [])

    if (loading) return <p>Loading comments...</p>
    return (
        <div className='px-7 py-3 flex flex-col gap-4'>
            <h1 className='font-bold text-2xl'>All comments ({comments.length}) </h1>

            {/* Write a comment */}
            <div className='flex gap-2'>
                <div className="w-[42px] flex gap-2 rounded-full"><img src={user.profilePic} alt="User-Profile" className='rounded-full' /></div>
                <div className='w-full' onClick={() => { setshowCommentBtn(true) }}><input className='outline-0 px-2 py-2 border-b-2 w-full' type="text" name="content" id="" placeholder='Add a comment' onChange={(e) => { setcommentvalue(e.target.value) }} value={commentvalue} /></div>
            </div>
            <div className={`btns ${showCommentBtn ? "flex" : "hidden"} justify-end gap-3`}>
                <button className='bg-green-400 px-8 py-2 rounded-3xl cursor-pointer hover:bg-green-500 text-white' onClick={postComment}>Comment</button>
                <button className='bg-[#ff2020] px-8 py-2 rounded-3xl cursor-pointer hover:bg-red-500 text-white' onClick={() => {
                    setshowCommentBtn(false)
                    setcommentvalue("")
                }}>Cancel</button>
            </div>
            {/* Write a comment ends here */}



            {/* Showing all comments */}

            <div className='mt-2 flex flex-col gap-10'>
                {comments.map((comment) => {
                    return (
                        // <div key={comment._id} className='border-2 border-gray-700 py-2 break-words'>{comment.content}</div>

                        <div key={comment._id} className='flex flex-col gap-5'>
                            <div className='flex justify-between'>
                                <div className="info flex gap-2 text-gray-500 w-full">
                                    <div className='w-[32px] h-[24px] rounded-full cursor-pointer'><img src={comment.owner[0].profilePic} alt="Comment_User_profile" className='w-[32px] h-[32px] rounded-full' /></div>
                                    {comment.isEditing ? <input placeholder='Edit this comment' className='outline-0 border-b border-blue-500 p-2 w-full text-black' onChange={(e) => { seteditValue(e.target.value) }} value={editValue} /> : (
                                        <>
                                            <p className='font-medium'>@{comment.owner[0].username}</p>
                                            <p>{new Date(comment.createdAt).toLocaleDateString()}</p>
                                        </>
                                    )}
                                </div>

                                {comment.isEditing ? null : (
                                    comment.isUserComment && (
                                        <div className="edit flex items-center gap-3">
                                            <button
                                                onClick={() => toggleEdit(comment._id)}
                                                className="cursor-pointer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="24" color="#000000" fill="none">
                                                    <path d="M3.78181 16.3092L3 21L7.69086 20.2182C8.50544 20.0825 9.25725 19.6956 9.84119 19.1116L20.4198 8.53288C21.1934 7.75922 21.1934 6.5049 20.4197 5.73126L18.2687 3.58024C17.495 2.80658 16.2406 2.80659 15.4669 3.58027L4.88841 14.159C4.30447 14.7429 3.91757 15.4947 3.78181 16.3092Z" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    <path d="M14 6L18 10" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                </svg>
                                            </button>

                                            <button
                                                onClick={() => deleteComment(comment._id)}
                                                className="cursor-pointer"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="24" color="#000000" fill="none">
                                                    <path d="M19.5 5.5L18.8803 15.5251C18.7219 18.0864 18.6428 19.3671 18.0008 20.2879C17.6833 20.7431 17.2747 21.1273 16.8007 21.416C15.8421 22 14.559 22 11.9927 22C9.42312 22 8.1383 22 7.17905 21.4149C6.7048 21.1257 6.296 20.7408 5.97868 20.2848C5.33688 19.3626 5.25945 18.0801 5.10461 15.5152L4.5 5.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M3 5.5H21M16.0557 5.5L15.3731 4.09173C14.9196 3.15626 14.6928 2.68852 14.3017 2.39681C14.215 2.3321 14.1231 2.27454 14.027 2.2247C13.5939 2 13.0741 2 12.0345 2C10.9688 2 10.436 2 9.99568 2.23412C9.8981 2.28601 9.80498 2.3459 9.71729 2.41317C9.32164 2.7167 9.10063 3.20155 8.65861 4.17126L8.05292 5.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M9.5 16.5L9.5 10.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                                                    <path d="M14.5 16.5L14.5 10.5" stroke="#141B34" strokeWidth="1.5" strokeLinecap="round" />
                                                </svg>
                                            </button>
                                        </div>
                                    )
                                )}

                            </div>

                            {comment.isEditing ? null : (
                                <>
                                    <div className="content">
                                        <p className='break-words'>{comment.content}</p>
                                    </div>

                                    <div className={`like cursor-pointer flex gap-2 p-4 hover:bg-slate-400 rounded-full w-[60px] ${comment.isLiked ? "bg-slate-400" : ""}`} onClick={() => likeComment(comment._id)}>
                                        <img src={likedVideo} alt="Like_Svg" className='w-[15px]' />
                                        {comment.totalLikes}
                                    </div>
                                </>
                            )}

                          {comment.isEditing &&   <div className="edit-controls flex gap-3 mt-3 justify-end">
                                <button onClick={() => {editComment(comment._id)}} className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                                    Edit
                                </button>

                                <button onClick={() => {toggleEdit(comment._id)}} className="px-4 py-2 rounded-xl text-sm font-medium bg-gray-200 text-gray-800 hover:bg-gray-300 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer">
                                    Cancel
                                </button>

                            </div>}
                        </div>
                    )
                })}
            </div>

            {/* Showing all comments ends here */}
        </div>
    )
}
