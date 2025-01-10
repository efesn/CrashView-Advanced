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

        // Ensure comments is always an array
        const commentsArray = Array.isArray(discussionData.comments) 
          ? discussionData.comments 
          : [];

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
      const response = await axios.post('https://localhost:7237/api/Comments', {
        discussionId: parseInt(id),
        author: username,
        commentText: newComment,
        createdAt: new Date().toISOString()
      });

      // Add the new comment to the list
      setComments(prevComments => [{
        id: response.data.id,
        author: username,
        commentText: newComment,
        createdAt: new Date().toISOString(),
        discussionId: parseInt(id)
      }, ...prevComments]);
      
      setNewComment('');
    } catch (error) {
      console.error('Error submitting comment:', error);
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

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (!discussion) return <div>Discussion not found</div>;

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '20px' }}>
      <div style={{ marginBottom: '40px' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '20px' }}>{discussion.title}</h1>

        {/* Video Player */}
        <div style={{
          width: '100%',
          aspectRatio: '16/9',
          backgroundColor: '#000',
          marginBottom: '20px',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          {discussion.crash?.videoUrl ? (
            <video
              controls
              style={{ width: '100%', height: '100%' }}
            >
              <source src={discussion.crash.videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            <div style={{ 
              width: '100%', 
              height: '100%', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              color: 'white' 
            }}>
              No video available
            </div>
          )}
        </div>

        {/* Incident Description */}
        <p style={{ fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '30px' }}>
          {discussion.crash?.description || 'No description available'}
        </p>
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
                    poll.votes.reduce((acc, vote) => {
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
    Array.isArray(comments) && comments.map(comment => (
      <div
        key={comment.id}
        style={{
          padding: '15px',
          borderBottom: '1px solid #eee',
          marginBottom: '15px'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '8px'
        }}>
          <strong>{comment.author}</strong>
        </div>
        <p>{comment.commentText}</p>
        <small style={{ color: '#777' }}>
          {new Date(comment.createdAt).toLocaleString()}
        </small>
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