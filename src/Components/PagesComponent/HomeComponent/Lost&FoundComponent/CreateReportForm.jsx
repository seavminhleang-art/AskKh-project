import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  UploadCloud,
  Send,
  Bold,
  Italic,
  Underline,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link2,
  Image as ImageIcon,
  Code,
  Music,
  RotateCcw,
  RotateCw,
  Calendar,
  ChevronRight,
  ShieldCheck,
  Eye,
  MapPin,
  Tag,
  Clock
} from 'lucide-react';

export default function CreateReportForm({ onCancel, darkMode }) {
  const { t } = useTranslation();
  const [reportType, setReportType] = useState('LOST'); // 'LOST' | 'FOUND'
  const isLost = reportType === 'LOST';

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    date: '',
    location: '',
    fullName: 'Sovanrith Chhun',
    phoneNumber: '+855 12 345 678',
    email: 'sovanrith@istad.edu.kh',
    contactMethod: 'Email',
    brandModel: '',
    color: '',
    uniqueFeatures: '',
    visibility: 'Public (Everyone can see)'
  });

  const cardClass = `backdrop-blur-md rounded-3xl shadow-sm transition-colors duration-300 ${
    darkMode
      ? 'bg-zinc-900/90 border border-zinc-800 text-slate-100'
      : 'bg-white/95 border border-gray-100 text-gray-800'
  }`;

  const inputClass = `w-full rounded-2xl px-3.5 py-2.5 text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-[var(--color-brand-primary,#3b82f6)]/40 ${
    darkMode
      ? 'bg-zinc-950/60 border border-zinc-800 text-slate-100 placeholder-zinc-500'
      : 'bg-gray-50 border border-gray-100 text-gray-800 placeholder-gray-400'
  }`;

  const labelClass = `block text-xs font-bold mb-1.5 ${darkMode ? 'text-slate-300' : 'text-gray-700'}`;
  const optionClass = darkMode ? 'bg-zinc-900 text-slate-100' : 'bg-white text-gray-800';

  return (
    <main className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full flex-1 transition-colors duration-300 font-[family-name:var(--font-brand)] ${
      darkMode ? 'text-slate-100' : 'text-gray-900'
    }`}>
      {/* TOGGLE REPORT TYPE */}
      <div className="mb-6 flex justify-center">
        <div className={`backdrop-blur-md p-1 rounded-2xl inline-flex gap-1 shadow-sm transition-colors duration-300 ${
          darkMode ? 'bg-zinc-900/90 border border-zinc-800' : 'bg-white/95 border border-gray-100'
        }`}>
          <button
            type="button"
            onClick={() => setReportType('LOST')}
            className={`px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              isLost
                ? 'bg-red-500 text-white shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('reportFormToggleLost')}
          </button>
          <button
            type="button"
            onClick={() => setReportType('FOUND')}
            className={`px-6 py-2 rounded-xl text-xs font-extrabold transition-all duration-200 ${
              !isLost
                ? 'bg-amber-500 text-white shadow-sm'
                : darkMode
                ? 'text-slate-400 hover:text-slate-100'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {t('reportFormToggleFound')}
          </button>
        </div>
      </div>

      {/* BREADCRUMB & HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className={`text-2xl md:text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            {isLost ? t('reportFormTitleLost') : t('reportFormTitleFound')}
          </h1>
          <p className={`text-xs md:text-sm mt-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
            {isLost ? t('reportFormSubtitleLost') : t('reportFormSubtitleFound')}
          </p>
        </div>

        <div className={`flex items-center gap-1.5 text-xs ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>
          <button
            type="button"
            onClick={onCancel}
            className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-[var(--color-brand-primary,#3b82f6)]'}`}
          >
            {t('home')}
          </button>
          <ChevronRight size={12} />
          <button
            type="button"
            onClick={onCancel}
            className={`transition-colors ${darkMode ? 'hover:text-blue-400' : 'hover:text-[var(--color-brand-primary,#3b82f6)]'}`}
          >
            {t('reportFormBreadcrumbLostFound')}
          </button>
          <ChevronRight size={12} />
          <span className={`font-medium ${darkMode ? 'text-blue-400' : 'text-[var(--color-brand-primary,#3b82f6)]'}`}>
            {isLost ? t('reportFormTitleLost') : t('reportFormTitleFound')}
          </span>
        </div>
      </div>

      {/* MAIN FORM GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT / CENTER COLUMN */}
        <div className="lg:col-span-2 space-y-6">

          {/* ITEM INFORMATION SECTION */}
          <div className={`${cardClass} p-6 space-y-5`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-[var(--color-brand-primary,#3b82f6)]'}`}>
              <Tag size={16} /> {t('reportFormItemDetails')}
            </h3>
            
            <div>
              <label className={labelClass}>
                {t('reportFormItemNameLabel')} <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder={isLost ? t('reportFormItemNamePlaceholderLost') : t('reportFormItemNamePlaceholderFound')}
                className={inputClass}
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  {t('reportCategoryLabel')} <span className="text-red-500">*</span>
                </label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="" className={optionClass}>{t('reportFormCategorySelectPlaceholder')}</option>
                  <option value="Electronics" className={optionClass}>{t('reportFormCategoryElectronics')}</option>
                  <option value="Bags & Backpacks" className={optionClass}>{t('reportFormCategoryBags')}</option>
                  <option value="Clothing" className={optionClass}>{t('reportFormCategoryClothing')}</option>
                  <option value="Accessories" className={optionClass}>{t('reportFormCategoryAccessories')}</option>
                  <option value="Keys" className={optionClass}>{t('reportFormCategoryKeys')}</option>
                  <option value="Books & Documents" className={optionClass}>{t('reportFormCategoryBooks')}</option>
                  <option value="Others" className={optionClass}>{t('reportFormCategoryOthers')}</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>{t('reportFormBrandLabel')}</label>
                <input
                  type="text"
                  placeholder={t('reportFormBrandPlaceholder')}
                  className={inputClass}
                  value={formData.brandModel}
                  onChange={(e) => setFormData({...formData, brandModel: e.target.value})}
                />
              </div>
            </div>

            {/* DESCRIPTION WITH RICH TEXT TOOLBAR */}
            <div>
              <label className={labelClass}>
                {t('reportDescriptionLabel')} <span className="text-red-500">*</span>
              </label>
              
              <div className={`rounded-2xl overflow-hidden transition-colors focus-within:ring-2 focus-within:ring-[var(--color-brand-primary,#3b82f6)]/40 ${
                darkMode ? 'bg-zinc-950/60 border border-zinc-800' : 'bg-gray-50 border border-gray-100'
              }`}>
                {/* Rich Text Toolbar */}
                <div className={`flex flex-wrap items-center gap-1 p-2 border-b transition-colors ${
                  darkMode ? 'bg-zinc-900/80 border-zinc-800 text-slate-300' : 'bg-gray-100 border-gray-200 text-gray-600'
                }`}>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarBold')}><Bold size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarItalic')}><Italic size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarUnderline')}><Underline size={14} /></button>
                  <span className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`}></span>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarH1')}><Heading1 size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarH2')}><Heading2 size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarH3')}><Heading3 size={14} /></button>
                  <span className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`}></span>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarBulletList')}><List size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarNumberedList')}><ListOrdered size={14} /></button>
                  <span className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`}></span>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarLink')}><Link2 size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarImage')}><ImageIcon size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarCode')}><Code size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarAudio')}><Music size={14} /></button>
                  <span className={`w-px h-4 mx-1 ${darkMode ? 'bg-zinc-800' : 'bg-gray-300'}`}></span>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarUndo')}><RotateCcw size={14} /></button>
                  <button type="button" className={`p-1.5 rounded transition ${darkMode ? 'hover:bg-zinc-800' : 'hover:bg-gray-200'}`} title={t('reportFormToolbarRedo')}><RotateCw size={14} /></button>
                </div>

                <textarea
                  rows={4}
                  placeholder={t('reportDescriptionPlaceholder')}
                  className={`w-full p-3.5 text-xs bg-transparent focus:outline-none resize-y ${
                    darkMode ? 'text-slate-100 placeholder-zinc-500' : 'text-gray-800 placeholder-gray-400'
                  }`}
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                />
              </div>
            </div>

            {/* COLOR & UNIQUE FEATURES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('reportFormColorLabel')}</label>
                <input
                  type="text"
                  placeholder={t('reportFormColorPlaceholder')}
                  className={inputClass}
                  value={formData.color}
                  onChange={(e) => setFormData({...formData, color: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>{t('reportFormUniqueFeaturesLabel')}</label>
                <input
                  type="text"
                  placeholder={t('reportFormUniqueFeaturesPlaceholder')}
                  className={inputClass}
                  value={formData.uniqueFeatures}
                  onChange={(e) => setFormData({...formData, uniqueFeatures: e.target.value})}
                />
              </div>
            </div>

            {/* TIME AND LOCATION */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <Clock size={13} /> {isLost ? t('reportFormDateLabelLost') : t('reportFormDateLabelFound')} <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={t('reportFormDatePlaceholder')}
                    className={`${inputClass} pr-9`}
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                  />
                  <Calendar size={14} className={`absolute right-3 top-3 ${darkMode ? 'text-zinc-500' : 'text-gray-400'}`} />
                </div>
              </div>

              <div>
                <label className={`${labelClass} flex items-center gap-1`}>
                  <MapPin size={13} /> {isLost ? t('reportFormLocationLabelLost') : t('reportFormLocationLabelFound')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder={t('reportLocationPlaceholder')}
                  className={inputClass}
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* CONTACT DETAILS SECTION */}
          <div className={`${cardClass} p-6 space-y-4`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-blue-400' : 'text-[var(--color-brand-primary,#3b82f6)]'}`}>
              <ShieldCheck size={16} /> {t('reportFormContactSectionTitle')}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>{t('reportFormFullNameLabel')}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>{t('reportFormPhoneLabel')}</label>
                <input
                  type="text"
                  className={inputClass}
                  value={formData.phoneNumber}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>{t('reportFormEmailLabel')}</label>
                <input
                  type="email"
                  className={inputClass}
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div>
                <label className={labelClass}>{t('reportFormContactMethodLabel')}</label>
                <select
                  className={`${inputClass} cursor-pointer`}
                  value={formData.contactMethod}
                  onChange={(e) => setFormData({...formData, contactMethod: e.target.value})}
                >
                  <option value="Email" className={optionClass}>{t('reportFormContactEmail')}</option>
                  <option value="Phone" className={optionClass}>{t('reportFormContactPhone')}</option>
                  <option value="Telegram" className={optionClass}>{t('reportFormContactTelegram')}</option>
                  <option value="Campus Office" className={optionClass}>{t('reportFormContactOffice')}</option>
                </select>
              </div>
            </div>
          </div>

          {/* FORM ACTIONS */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={onCancel}
              className={`text-white font-semibold text-xs px-6 py-3 rounded-2xl shadow-sm transition-all duration-200 flex items-center gap-2 cursor-pointer ${
                isLost
                  ? 'bg-[var(--color-brand-primary,#3b82f6)] hover:opacity-90'
                  : 'bg-amber-500 hover:bg-amber-600'
              }`}
            >
              <Send size={14} /> {isLost ? t('reportFormSubmitLost') : t('reportFormSubmitFound')}
            </button>
            <button
              onClick={onCancel}
              className={`font-semibold text-xs px-6 py-3 rounded-2xl transition cursor-pointer backdrop-blur-md ${
                darkMode
                  ? 'bg-zinc-900/90 border border-zinc-800 text-slate-300 hover:bg-zinc-800'
                  : 'bg-white/95 border border-gray-100 text-gray-700 hover:bg-gray-100'
              }`}
            >
              {t('reportCancelBtn')}
            </button>
          </div>

        </div>

        {/* RIGHT COLUMN */}
        <div className="space-y-6">

          {/* IMAGE UPLOAD SECTION */}
          <div className={`${cardClass} p-5`}>
            <h3 className={`text-sm font-bold mb-3 ${darkMode ? 'text-white' : 'text-gray-900'}`}>{t('reportFormUploadTitle')}</h3>
            <div className={`border-2 border-dashed rounded-2xl p-6 text-center transition cursor-pointer ${
              darkMode
                ? 'border-zinc-800 hover:border-blue-500 bg-zinc-950/60'
                : 'border-gray-200 hover:border-[var(--color-brand-primary,#3b82f6)] bg-gray-50'
            }`}>
              <UploadCloud size={32} className={`mx-auto mb-2 ${darkMode ? 'text-blue-400' : 'text-[var(--color-brand-primary,#3b82f6)]'}`} />
              <p className={`text-xs font-semibold ${darkMode ? 'text-slate-300' : 'text-gray-700'}`}>{t('reportFormUploadHint')}</p>
              <p className={`text-[10px] mt-1 ${darkMode ? 'text-slate-500' : 'text-gray-400'}`}>{t('reportFormUploadFormats')}</p>
            </div>
          </div>

          {/* PRIVACY & VISIBILITY SETTINGS */}
          <div className={`${cardClass} p-5 space-y-4`}>
            <h3 className={`text-sm font-bold flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              <Eye size={15} /> {t('reportFormVisibilityTitle')}
            </h3>
            
            <div className="space-y-3">
              <label className={`flex items-start gap-2.5 text-xs cursor-pointer ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.visibility.includes('Public')}
                  onChange={() => setFormData({...formData, visibility: 'Public (Everyone can see)'})}
                  className={`mt-0.5 text-[var(--color-brand-primary,#3b82f6)] focus:ring-[var(--color-brand-primary,#3b82f6)] ${
                    darkMode ? 'bg-zinc-950 border-zinc-800' : ''
                  }`}
                />
                <div>
                  <span className={`font-semibold block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{t('reportFormVisibilityPublicLabel')}</span>
                  <span className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>{t('reportFormVisibilityPublicDesc')}</span>
                </div>
              </label>

              <label className={`flex items-start gap-2.5 text-xs cursor-pointer ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
                <input
                  type="radio"
                  name="visibility"
                  checked={formData.visibility.includes('Security Only')}
                  onChange={() => setFormData({...formData, visibility: 'Campus Security Only'})}
                  className={`mt-0.5 text-[var(--color-brand-primary,#3b82f6)] focus:ring-[var(--color-brand-primary,#3b82f6)] ${
                    darkMode ? 'bg-zinc-950 border-zinc-800' : ''
                  }`}
                />
                <div>
                  <span className={`font-semibold block ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{t('reportFormVisibilitySecurityLabel')}</span>
                  <span className={`text-[11px] ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>{t('reportFormVisibilitySecurityDesc')}</span>
                </div>
              </label>
            </div>
          </div>

        </div>

      </div>
    </main>
  );
}