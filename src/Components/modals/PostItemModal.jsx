import React, { useState } from 'react';
import { X, Upload, MapPin, Calendar, Tag, AlertCircle, Sparkles, Image as ImageIcon, Loader2 } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import { ITEM_CATEGORIES, CAMPUS_LOCATIONS } from '../../constants';
import {
  useCreateReportMutation,
  useGetCategoriesQuery,
  useGetLocationsQuery,
  useUploadSingleMutation,
} from '../../store/api/apiSlice';
import { toast } from 'sonner';

export default function PostItemModal({ isOpen, onClose, initialType = 'LOST' }) {
  const [type, setType] = useState(initialType.toUpperCase());
  const [name, setName] = useState('');
  const [categoryId, setCategoryId] = useState(1);
  const [locationId, setLocationId] = useState(1);
  const [freeTextLocation, setFreeTextLocation] = useState(CAMPUS_LOCATIONS[0]);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [time, setTime] = useState('14:00');
  const [description, setDescription] = useState('');
  const [hiddenDetail, setHiddenDetail] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [errors, setErrors] = useState({});

  const { data: serverCategories = [] } = useGetCategoriesQuery();
  const { data: serverLocations = [] } = useGetLocationsQuery();
  const [createReport, { isLoading }] = useCreateReportMutation();
  const [uploadFile, { isLoading: isUploading }] = useUploadSingleMutation();

  if (!isOpen) return null;

  const categories =
    serverCategories.length > 0
      ? serverCategories
      : ITEM_CATEGORIES.map((c, i) => ({ id: i + 1, name: c.label || c.id }));

  const locations =
    serverLocations.length > 0
      ? serverLocations
      : CAMPUS_LOCATIONS.map((l, i) => ({ id: i + 1, label: l }));

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await uploadFile(formData).unwrap();
      const uploadedUri = res?.uri || res?.url || URL.createObjectURL(file);
      setPhotoUrl(uploadedUri);
      toast.success('Image uploaded successfully!');
    } catch {
      // Offline fallback: use local object url
      const localUrl = URL.createObjectURL(file);
      setPhotoUrl(localUrl);
      toast.info('Local image preview loaded.');
    }
  };

  const validate = () => {
    const errs = {};
    if (!name.trim()) errs.name = 'Item title is required';
    if (!description.trim() || description.trim().length < 15) {
      errs.description = 'Please describe the item clearly (min 15 characters)';
    }
    if (!contactInfo.trim()) errs.contactInfo = 'Contact details (Telegram/Phone) are required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await createReport({
        itemType: type,
        title: name,
        categoryId: Number(categoryId),
        description: `${description} | Contact: ${contactInfo}`,
        itemDate: date,
        scope: 'CAMPUS',
        locationId: Number(locationId),
        freeTextLocation: freeTextLocation,
        photoUrl: photoUrl || undefined,
        hiddenDetail: hiddenDetail || undefined,
        // Legacy compatibility properties
        name,
        type,
        location: freeTextLocation,
        date,
        time,
        contactInfo,
        images: photoUrl ? [photoUrl] : [],
      }).unwrap();

      toast.success(
        type === 'LOST'
          ? 'Lost item report published! Our Smart Match algorithm will notify you of potential matches.'
          : 'Found item report published! Thank you for supporting the campus community.'
      );
      onClose();
    } catch {
      toast.error('Failed to submit report. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 my-8">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Report Campus Belongings
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Provide accurate details to facilitate instant verification and smart matching.
          </p>
        </div>

        {/* Type Toggle */}
        <div className="grid grid-cols-2 gap-3 p-1.5 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => setType('LOST')}
            className={`py-2.5 rounded-xl font-bold text-sm transition-all select-none cursor-pointer ${
              type === 'LOST'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            I Lost Something
          </button>
          <button
            type="button"
            onClick={() => setType('FOUND')}
            className={`py-2.5 rounded-xl font-bold text-sm transition-all select-none cursor-pointer ${
              type === 'FOUND'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            I Found Something
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Item Title *
            </label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. MacBook Air M2 13-inch (Midnight Blue) with stickers"
              error={errors.name}
            />
            {errors.name && <p className="text-xs text-rose-500 mt-1">{errors.name}</p>}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Category *
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name || c.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Campus Location *
              </label>
              <select
                value={locationId}
                onChange={(e) => {
                  setLocationId(e.target.value);
                  const selectedLoc = locations.find((l) => String(l.id) === String(e.target.value));
                  if (selectedLoc) setFreeTextLocation(selectedLoc.label || selectedLoc.name);
                }}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.label || loc.building || `Building ${loc.id}`}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <Input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Approximate Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Detailed Description & Distinguishing Marks *
            </label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Color, stickers, scratches, case brand, unique identifiers..."
              rows={3}
              error={errors.description}
            />
            {errors.description && (
              <p className="text-xs text-rose-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Confidential Hidden Detail (For Ownership Verification)
            </label>
            <Input
              value={hiddenDetail}
              onChange={(e) => setHiddenDetail(e.target.value)}
              placeholder="e.g. Serial number, desktop wallpaper, student ID number inside..."
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Kept hidden. Claimants must describe this detail to verify legitimate ownership.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Contact Info / Desk *
              </label>
              <Input
                value={contactInfo}
                onChange={(e) => setContactInfo(e.target.value)}
                placeholder="Telegram @username or Phone 012 345 678"
                error={errors.contactInfo}
              />
              {errors.contactInfo && (
                <p className="text-xs text-rose-500 mt-1">{errors.contactInfo}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Upload Photo (API Upload)
              </label>
              <label className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 bg-slate-50 dark:bg-slate-800/60 cursor-pointer text-xs text-slate-600 dark:text-slate-300">
                {isUploading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                ) : (
                  <Upload className="w-4 h-4 text-slate-400" />
                )}
                <span className="truncate">{photoUrl ? 'Photo Uploaded ✓' : 'Select image file'}</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant={type === 'LOST' ? 'coral' : 'success'}
              isLoading={isLoading}
              className="rounded-xl px-6"
            >
              Publish {type === 'LOST' ? 'Lost Item' : 'Found Item'} Report
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
