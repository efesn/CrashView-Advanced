import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DiscussPage() {
  const { id } = useParams();
  const [discussion, setDiscussion] = useState(null);
  const [comments, setComments] = useState([]);
  const [poll, setPoll] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDiscussionData = async () => {
      try {
        const discussionResponse = await axios.get(`https://localhost:7237/api/Discussions/${id}`);
        const discussionData = discussionResponse.data;
        
        console.log('Discussion Data:', discussionData); // Debug log
        console.log('Crash Data:', discussionData.crash); // Debug crash data
        console.log('Video URL:', discussionData.crash?.videoUrl); // Debug video URL
        console.log('Description:', discussionData.crash?.description); // Debug description

        // Extract comments from the discussion data
        const commentsArray = discussionData.comments?.$values || discussionData.comments || [];
        
        setDiscussion(discussionData);
        setComments(commentsArray);
        setPoll(discussionData.poll);

        setLoading(false);
      } catch (err) {
        setError('Failed to load discussion data');
        setLoading(false);
        console.error('Error fetching discussion data:', err);
      }
    };

    fetchDiscussionData();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      const username = localStorage.getItem('username');
      if (!username) {
        alert('Please log in to comment');
        return;
      }

      const commentData = {
        DiscussionId: parseInt(id),
        Author: username,
        CommentText: newComment
      };

      console.log('Sending comment data:', commentData); // Debug log

      const response = await axios.post('https://localhost:7237/api/Comments', commentData);
      console.log('Comment response:', response.data); // Debug log

      // Add the new comment to the list with consistent property casing
      const newCommentObj = {
        id: response.data.id,
        author: response.data.author,
        commentText: response.data.commentText,
        createdAt: response.data.createdAt,
        discussionId: response.data.discussionId
      };

      // Update the comments state with the new comment at the beginning
      setComments(prevComments => {
        const updatedComments = Array.isArray(prevComments) ? [newCommentObj, ...prevComments] : [newCommentObj];
        return updatedComments;
      });
      
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
      if (error.response?.data) {
        console.error('Server error details:', error.response.data);
      }
      alert('Failed to post comment. Please try again.');
    }
  };

  const handleVote = async (pollId, voteOption) => {
    try {
      const username = localStorage.getItem('username');
      await axios.post(`https://localhost:7237/api/Polls/${pollId}/vote`, {
        voter: username,
        voteOption: voteOption
      });

      // Refresh the entire discussion to get updated poll data
      const discussionResponse = await axios.get(`https://localhost:7237/api/Discussions/${id}`);
      setDiscussion(discussionResponse.data);
      setPoll(discussionResponse.data.poll);
    } catch (error) {
      console.error('Error submitting vote:', error);
    }
  };

  const getYouTubeVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!discussion) return <div>Discussion not found</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>{discussion.title}</h1>

        {/* Video Player */}
        <div style={{ 
          maxWidth: '800px', // Reduced from 1200px
          margin: '0 auto',
          marginBottom: '20px'
        }}>
          <div style={{
            width: '100%',
            aspectRatio: '16/9',
            backgroundColor: '#000',
            borderRadius: '8px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            {discussion.crash?.videoUrl ? (
              discussion.crash.videoUrl.includes('youtube.com') || discussion.crash.videoUrl.includes('youtu.be') ? (
                <iframe
                  title="crash-video"
                  src={`https://www.youtube.com/embed/${getYouTubeVideoId(discussion.crash.videoUrl)}`}
                  style={{ width: '100%', height: '100%', border: 'none' }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen={true}
                />
              ) : (
                <video
                  controls
                  style={{ width: '100%', height: '100%' }}
                  onError={(e) => {
                    console.error('Video loading error:', e);
                    e.target.parentElement.innerHTML = 'Error loading video';
                  }}
                >
                  <source src={discussion.crash.videoUrl} type="video/mp4" />
                  <source src={discussion.crash.videoUrl} type="video/webm" />
                  <source src={discussion.crash.videoUrl} type="video/ogg" />
                  Your browser does not support the video tag.
                </video>
              )
            ) : (
              <div style={{ 
                width: '100%', 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                color: 'white',
                padding: '20px',
                textAlign: 'center'
              }}>
                No video available for this crash
              </div>
            )}
          </div>
        </div>

        {/* Incident Description */}
        <div style={{ 
          maxWidth: '760px', 
          margin: '0 auto',
          marginBottom: '30px',
          backgroundColor: '#f8f8f8',
          padding: '20px',
          borderRadius: '8px'
        }}>
          <p style={{ 
            fontSize: '1.1rem', 
            lineHeight: '1.6',
            margin: 0,
            color: '#333'
          }}>
            {discussion.crash?.description || 'No description available for this crash'}
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '40px' }}>
        {/* Polls Section */}
        {poll && (
          <div>
            <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '2px solid #C40500', paddingBottom: '10px' }}>
              Poll
            </h2>

            <div style={{
              backgroundColor: '#C40500',
              padding: '20px',
              borderRadius: '8px',
              color: 'white'
            }}>
              <h3 style={{ marginBottom: '15px' }}>{poll.question}</h3>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => handleVote(poll.id, 'Verstappen')}
                  style={{
                    background: 'white',
                    color: '#C40500',
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Verstappen
                </button>
                <button
                  onClick={() => handleVote(poll.id, 'Alonso')}
                  style={{
                    background: 'white',
                    color: '#C40500',
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Alonso
                </button>
                <button
                  onClick={() => handleVote(poll.id, 'Racing Incident')}
                  style={{
                    background: 'white',
                    color: '#C40500',
                    padding: '10px',
                    borderRadius: '4px',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                >
                  Racing Incident
                </button>
              </div>

              {/* Show vote counts */}
              {poll.votes && (
                <div style={{ marginTop: '20px' }}>
                  <h4>Current Votes:</h4>
                  {Object.entries(
                    (Array.isArray(poll.votes) ? poll.votes : []).reduce((acc, vote) => {
                      acc[vote.voteOption] = (acc[vote.voteOption] || 0) + 1;
                      return acc;
                    }, {})
                  ).map(([option, count]) => (
                    <div key={option} style={{ display: 'flex', justifyContent: 'space-between', margin: '5px 0' }}>
                      <span>{option}:</span>
                      <span>{count} votes</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Discussion Section */}
        <div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '20px', borderBottom: '2px solid #C40500', paddingBottom: '10px' }}>
            Discussion
          </h2>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} style={{ marginBottom: '20px' }}>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                marginBottom: '10px',
                minHeight: '100px',
                resize: 'vertical'
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#C40500',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Post Comment
            </button>
          </form>

          {/* Comments List */}
          <div>
            {!comments || comments.length === 0 ? (
              <p style={{ color: '#666', textAlign: 'center' }}>
                Be the first to comment on this crash!
              </p>
            ) : (
              comments.map(comment => (
                <div
                  key={comment.id}
                  style={{
                    padding: '20px',
                    marginBottom: '20px',
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #eee'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '10px',
                    padding: '0 0 8px 0',
                    borderBottom: '1px solid #eee'
                  }}>
                    <strong style={{ color: '#C40500' }}>{comment.author}</strong>
                    <small style={{ color: '#777', marginLeft: 'auto' }}>
                      {new Date(comment.createdAt).toLocaleString()}
                    </small>
                  </div>
                  <p style={{ 
                    margin: '0',
                    fontSize: '1rem',
                    lineHeight: '1.5',
                    color: '#333'
                  }}>
                    {comment.commentText}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiscussPage;