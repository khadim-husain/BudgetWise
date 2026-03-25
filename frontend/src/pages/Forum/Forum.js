import React, { useState, useEffect } from 'react';
import './Forum.css';

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ title: '', content: '' });
  const [showPostForm, setShowPostForm] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    // Mock data - replace with actual API call
    const mockPosts = [
      {
        id: 1,
        title: 'Best budgeting tips for beginners?',
        content: 'I\'m new to budgeting and would love to hear your best tips for getting started. What has worked for you?',
        author: 'Sarah K.',
        date: '2026-02-12',
        likes: 24,
        comments: [
          { id: 1, author: 'Mike D.', content: 'Start with the 50/30/20 rule! Works great for beginners.', date: '2026-02-12' },
          { id: 2, author: 'Lisa M.', content: 'Track every single expense for a month first to understand your patterns.', date: '2026-02-13' },
        ],
        category: 'Budgeting',
      },
      {
        id: 2,
        title: 'How to save for emergency fund?',
        content: 'What\'s the best strategy to build an emergency fund? How much should I aim for?',
        author: 'John R.',
        date: '2026-02-11',
        likes: 18,
        comments: [
          { id: 1, author: 'Emma W.', content: 'Aim for 6 months of expenses. Start with small automatic transfers.', date: '2026-02-11' },
        ],
        category: 'Savings',
      },
      {
        id: 3,
        title: 'Cutting down grocery expenses',
        content: 'My grocery bills are getting out of hand. Any tips to reduce expenses without compromising on quality?',
        author: 'Amy L.',
        date: '2026-02-10',
        likes: 32,
        comments: [
          { id: 1, author: 'Tom H.', content: 'Meal planning and bulk buying have saved me 30% on groceries!', date: '2026-02-10' },
          { id: 2, author: 'Rachel P.', content: 'Shop with a list and never go hungry. That\'s when you overspend!', date: '2026-02-11' },
          { id: 3, author: 'David S.', content: 'Check for sales and use coupons. Also, consider store brands.', date: '2026-02-11' },
        ],
        category: 'Expenses',
      },
      {
        id: 4,
        title: 'Investment options for beginners',
        content: 'I want to start investing but don\'t know where to begin. What are good options for someone just starting out?',
        author: 'Chris B.',
        date: '2026-02-09',
        likes: 45,
        comments: [
          { id: 1, author: 'Jennifer K.', content: 'Start with index funds - low risk and good long-term returns.', date: '2026-02-09' },
          { id: 2, author: 'Mark T.', content: 'Max out your employer 401k match first if you have one.', date: '2026-02-10' },
        ],
        category: 'Investing',
      },
    ];
    setPosts(mockPosts);
  };

  const handleCreatePost = (e) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content) return;

    const post = {
      id: Date.now(),
      title: newPost.title,
      content: newPost.content,
      author: 'You',
      date: new Date().toISOString().split('T')[0],
      likes: 0,
      comments: [],
      category: 'General',
    };

    setPosts([post, ...posts]);
    setNewPost({ title: '', content: '' });
    setShowPostForm(false);
  };

  const handleLikePost = (postId) => {
    setPosts(posts.map(p => 
      p.id === postId ? { ...p, likes: p.likes + 1 } : p
    ));
  };

  const handleAddComment = (postId) => {
    if (!newComment.trim()) return;

    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [
            ...p.comments,
            {
              id: Date.now(),
              author: 'You',
              content: newComment,
              date: new Date().toISOString().split('T')[0],
            },
          ],
        };
      }
      return p;
    }));

    setNewComment('');
  };

  return (
    <div className="forum fade-in">
      <div className="page-header">
        <div>
          <h1>👥 Community Forum</h1>
          <p>Share tips and learn from the community</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => setShowPostForm(!showPostForm)}
        >
          {showPostForm ? '❌ Cancel' : '✍️ New Post'}
        </button>
      </div>

      {/* New Post Form */}
      {showPostForm && (
        <div className="card new-post-form">
          <div className="card-header">Create New Post</div>
          <form onSubmit={handleCreatePost}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                placeholder="Enter post title..."
                required
              />
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                className="form-control"
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                placeholder="Share your thoughts, questions, or tips..."
                rows="5"
                required
              ></textarea>
            </div>
            <button type="submit" className="btn btn-primary">
              📝 Post
            </button>
          </form>
        </div>
      )}

      {/* Posts List */}
      <div className="posts-container">
        {posts.map((post) => (
          <div key={post.id} className="card post-card">
            <div className="post-header">
              <div className="post-meta">
                <span className="badge badge-info">{post.category}</span>
                <span className="post-author">{post.author}</span>
                <span className="post-date">{post.date}</span>
              </div>
            </div>

            <h3 className="post-title">{post.title}</h3>
            <p className="post-content">{post.content}</p>

            <div className="post-actions">
              <button
                className="action-btn"
                onClick={() => handleLikePost(post.id)}
              >
                👍 {post.likes} Likes
              </button>
              <button
                className="action-btn"
                onClick={() => setSelectedPost(selectedPost === post.id ? null : post.id)}
              >
                💬 {post.comments.length} Comments
              </button>
              <button className="action-btn">
                🔗 Share
              </button>
            </div>

            {/* Comments Section */}
            {selectedPost === post.id && (
              <div className="comments-section">
                <div className="comments-list">
                  {post.comments.map((comment) => (
                    <div key={comment.id} className="comment-item">
                      <div className="comment-header">
                        <strong>{comment.author}</strong>
                        <span className="comment-date">{comment.date}</span>
                      </div>
                      <p className="comment-content">{comment.content}</p>
                    </div>
                  ))}
                </div>

                <div className="add-comment">
                  <input
                    type="text"
                    className="form-control"
                    value={selectedPost === post.id ? newComment : ''}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Add a comment..."
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddComment(post.id);
                      }
                    }}
                  />
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleAddComment(post.id)}
                  >
                    Send
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Forum Guidelines */}
      <div className="card guidelines-card">
        <div className="card-header">📋 Community Guidelines</div>
        <ul className="guidelines-list">
          <li>Be respectful and supportive of all community members</li>
          <li>Share factual financial information and personal experiences</li>
          <li>No spam, promotional content, or financial solicitation</li>
          <li>Protect your privacy - don't share sensitive financial details</li>
          <li>Report inappropriate content to moderators</li>
        </ul>
      </div>
    </div>
  );
};

export default Forum;
