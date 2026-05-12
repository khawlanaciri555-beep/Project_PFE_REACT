import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowLeft, FaPaperPlane, FaUserCircle } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';
import api from '../api/axios';
import { AuthContext } from '../context/AuthContext';
import Layout from '../Components/Layout';

const Comments = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [place, setPlace] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (id === 'general') {
        const commentsRes = await api.get('/places/general/comments');
        setComments(commentsRes.data.data);
      } else {
        const [placeRes, commentsRes] = await Promise.all([
          api.get(`/places/${id}`),
          api.get(`/places/${id}/comments`)
        ]);
        setPlace(placeRes.data.data ? placeRes.data.data : placeRes.data);
        setComments(commentsRes.data.data);
      }
    } catch (err) {
      console.error('Error fetching comments data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login', { state: { from: id === 'general' ? '/comments/general' : `/place/${id}/comments` } });
      return;
    }
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const payload = {
        content: newComment
      };
      if (id !== 'general') {
        payload.place_id = id;
      }

      const response = await api.post('/comments', payload);
      setComments([response.data.data, ...comments]);
      setNewComment('');
    } catch (err) {
      console.error('Error posting comment', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <Layout>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="loader">{t('common.loading')}</div>
      </div>
    </Layout>
  );

  return (
    <Layout>
      <div style={{ padding: '6rem 5% 4rem', maxWidth: '800px', margin: '0 auto' }}>
        <button 
          onClick={() => navigate(-1)} 
          style={{ 
            background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem', 
            color: 'var(--primary)', fontWeight: '600', cursor: 'pointer', marginBottom: '2rem' 
          }}
        >
          <FaArrowLeft /> {t('common.back')}
        </button>

        {id === 'general' ? (
          <div style={{ marginBottom: '3rem', background: 'linear-gradient(135deg, var(--primary) 0%, #db6a51 100%)', padding: '3rem', borderRadius: '30px', boxShadow: '0 20px 50px rgba(188, 73, 49, 0.2)', color: 'white', textAlign: 'center' }}>
            <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem', fontFamily: "'Playfair Display', serif" }}>{t('comments.generalDiscussion')}</h1>
            <p style={{ opacity: 0.9, fontSize: '1.1rem' }}>{t('comments.generalDiscussionDesc')}</p>
          </div>
        ) : place && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '3rem', background: 'white', padding: '1.5rem', borderRadius: '20px', boxShadow: '0 10px 30px rgba(0,0,0,0.05)' }}>
            <img src={place.image} alt={place.title} style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '15px' }} />
            <div>
              <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{t('comments.title')} : {place.title}</h1>
              <p style={{ color: '#888', fontSize: '0.9rem' }}>{place.category}</p>
            </div>
          </div>
        )}

        <div style={{ background: 'white', borderRadius: '25px', padding: '2rem', boxShadow: '0 20px 50px rgba(0,0,0,0.05)' }}>
          <form onSubmit={handleSubmit} style={{ marginBottom: '3rem' }}>
            <h3 style={{ marginBottom: '1.2rem', fontSize: '1.1rem' }}>{t('comments.shareYourOpinion')}</h3>
            <div style={{ position: 'relative' }}>
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={user ? t('comments.placeholder') : t('comments.loginToComment')}
                style={{ 
                  width: '100%', padding: '1.2rem', borderRadius: '15px', border: '1px solid #eee', 
                  minHeight: '120px', fontFamily: 'inherit', resize: 'none', background: '#f9f9f9'
                }}
                disabled={!user}
              />
              <button 
                type="submit" 
                disabled={submitting || !newComment.trim() || !user}
                style={{ 
                  position: 'absolute', bottom: '15px', right: '15px', background: 'var(--primary)', 
                  color: 'white', border: 'none', width: '45px', height: '45px', borderRadius: '12px', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                  opacity: (submitting || !newComment.trim()) ? 0.6 : 1, transition: '0.3s'
                }}
              >
                <FaPaperPlane />
              </button>
            </div>
            {!user && (
               <p style={{ fontSize: '0.85rem', color: '#888', marginTop: '0.8rem' }}>
                 {t('comments.mustBeLoggedIn').replace('{{link}}', '')}
                 <span onClick={() => navigate('/login')} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: '600' }}>{t('comments.loggedInLink')}</span>
                 {t('comments.mustBeLoggedIn').split('{{link}}')[1]}
               </p>
            )}
          </form>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <h3 style={{ fontSize: '1.1rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
              {t('comments.conversations')} ({comments.length})
            </h3>
            <AnimatePresence>
              {comments.map((comment) => (
                <motion.div 
                  key={comment.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', gap: '1.2rem' }}
                >
                  <FaUserCircle size={40} color="#ddd" />
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>{comment.user?.name}</span>
                      <span style={{ fontSize: '0.75rem', color: '#999' }}>
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p style={{ color: '#555', lineHeight: '1.6', fontSize: '0.95rem' }}>{comment.content}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {comments.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#ccc' }}>
                <p>{t('comments.noComments')}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Comments;
