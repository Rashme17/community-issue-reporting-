import React from 'react';

export default function CommentBox({ comments = [], onAddComment }) {
  const handleSubmit = e => {
    e.preventDefault();
    const text = e.target.elements.comment.value;
    onAddComment(text);
    e.target.reset();
  };

  return (
    <div className="mt-6">
      <form onSubmit={handleSubmit} className="flex">
        <input name="comment" type="text" placeholder="Add a comment" className="flex-grow p-2 border" />
        <button type="submit" className="bg-green-500 text-white px-4">Post</button>
      </form>
      <ul className="mt-4">
        {comments.map((c, i) => <li key={i} className="text-sm border-b py-1">{c}</li>)}
      </ul>
    </div>
  );
}