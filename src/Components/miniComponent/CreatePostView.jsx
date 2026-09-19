import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { useOutletContext } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const CreatePostView = ({ onAddPost, onCancel, darkMode: propDarkMode }) => {
  const { t } = useTranslation();
  const context = useOutletContext();
  const darkMode = propDarkMode ?? context?.darkMode ?? false;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState(['react', 'javascript']);
  const [tagInput, setTagInput] = useState('');
  const [coverImage, setCoverImage] = useState(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };

  const addTag = () => {
    const formattedTag = tagInput.trim().replace(/^#/, '').toLowerCase();
    if (formattedTag && !tags.includes(formattedTag)) {
      setTags([...tags, formattedTag]);
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newPost = {
      id: Date.now(),
      title,
      content,
      isOwnPost: true,
      tags: tags.length > 0 ? tags : ['general'],
      author: {
        name: 'Mom Lisa',
        avatar: '../../src/assets/Website/Lisa.jpg',
        time: 'Just now'
      },
      views: '0',
      likes: '0',
      comments: 0,
      image: coverImage || 'https://picsum.photos/300/200?random=' + Math.floor(Math.random() * 100)
    };

    onAddPost(newPost);
  };

  return (
    <div className={`min-w-0 flex-1 min-h-screen transition-colors duration-300 p-4 sm:p-6 space-y-6 ${
      darkMode ? "bg-zinc-950 text-slate-100" : "bg-gray-50 text-gray-900"
    }`}>
      <h1 className={`text-2xl font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
        {t('create.title')}
      </h1>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Details Section */}
          <div className={`rounded-2xl p-6 space-y-4 transition-colors ${
            darkMode ? "bg-zinc-900 text-slate-100" : "bg-white text-gray-800"
          }`}>
            <h3 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
              {t('create.blogDetails')}
            </h3>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                {t('create.blogTitleLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={t('create.blogTitleLabel')}
                className={`w-full rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode 
                    ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500" 
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
                required
              />
            </div>

            <div>
              <label className={`block text-xs font-semibold mb-1 ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                {t('create.contentLabel')}
              </label>
              <div className={`border rounded-xl overflow-hidden ${darkMode ? "border-zinc-700" : "border-gray-200"}`}>
                <textarea
                  rows="6"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t('create.placeholderContent')}
                  className={`w-full p-3 text-xs focus:outline-none transition-colors ${
                    darkMode ? "bg-zinc-900 text-slate-100 placeholder-zinc-500" : "bg-white text-gray-900 placeholder-gray-400"
                  }`}
                ></textarea>
              </div>
            </div>
          </div>

          {/* Cover Image */}
          <div className={`rounded-2xl p-6 space-y-4 transition-colors ${
            darkMode ? "bg-zinc-900" : "bg-white"
          }`}>
            <h3 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
              {t('create.coverImage')}
            </h3>
            <label className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${
              darkMode ? "border-zinc-700 hover:bg-zinc-800/50" : "border-gray-200 hover:bg-gray-50"
            }`}>
              {coverImage ? (
                <img src={coverImage} alt="Cover Preview" className="max-h-40 rounded-xl object-cover" />
              ) : (
                <>
                  <Upload className={`w-8 h-8 mb-2 ${darkMode ? "text-zinc-500" : "text-gray-400"}`} />
                  <span className={`text-xs font-semibold ${darkMode ? "text-slate-300" : "text-gray-700"}`}>
                    {t('create.uploadFile')}
                  </span>
                </>
              )}
              <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center space-x-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-xl text-xs transition-colors"
            >
              {t('create.addBlog')}
            </button>
            <button
              type="button"
              onClick={onCancel}
              className={`font-medium px-6 py-2 rounded-xl text-xs transition-colors border ${
                darkMode 
                  ? "bg-red-950/40 text-red-400 hover:bg-red-900/50 border-red-900/30" 
                  : "bg-red-50 text-red-500 hover:bg-red-100 border-transparent"
              }`}
            >
              {t('create.cancel')}
            </button>
          </div>
        </div>

        {/* Dynamic Tag Input Sidebar */}
        <div className="space-y-6">
          <div className={`rounded-2xl p-6 space-y-4 transition-colors ${
            darkMode ? "bg-zinc-900" : "bg-white"
          }`}>
            <h3 className={`font-bold text-sm ${darkMode ? "text-slate-200" : "text-gray-800"}`}>
              {t('create.tags')}
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={t('create.tagsPlaceholder')}
                className={`min-w-0 flex-1 rounded-xl px-3 py-2 text-xs border focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors ${
                  darkMode 
                    ? "bg-zinc-800/80 border-zinc-700 text-slate-100 placeholder-zinc-500" 
                    : "bg-white border-gray-200 text-gray-900 placeholder-gray-400"
                }`}
              />
              <button
                type="button"
                onClick={addTag}
                className="bg-blue-600 text-white text-xs px-3 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium shrink-0"
              >
                {t('create.tags')}
              </button>
            </div>

            {/* Render Tag Chips */}
            <div className="flex flex-wrap gap-2 pt-2">
              {tags.map((tagItem, idx) => (
                <span
                  key={idx}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${
                    darkMode 
                      ? "bg-blue-950/50 text-blue-400 border-blue-900/50" 
                      : "bg-blue-50 text-blue-600 border-blue-100"
                  }`}
                >
                  #{tagItem}
                  <button
                    type="button"
                    onClick={() => removeTag(tagItem)}
                    className={`transition-colors ${darkMode ? "hover:text-blue-200" : "hover:text-blue-800"}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePostView;