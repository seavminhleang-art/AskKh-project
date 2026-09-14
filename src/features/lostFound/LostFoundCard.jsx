import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Sparkles, ShieldCheck, ArrowRight } from 'lucide-react';
import Card from '../../components/ui/Card';
import StatusBadge from '../../components/ui/StatusBadge';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Avatar from '../../components/ui/Avatar';
import ClaimModal from '../../components/modals/ClaimModal';

export default function LostFoundCard({ item, onSelectDetails }) {
  const [isClaimModalOpen, setIsClaimModalOpen] = useState(false);

  const title = item.title || item.name || 'Campus Item';
  const itemType = item.itemType || item.type || 'LOST';
  const categoryName = item.categoryName || item.category || 'General';
  const locationText = item.locationLabel || item.freeTextLocation || item.location || 'ISTAD Main Campus';
  const dateText = item.itemDate || item.date || (item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent');
  const mainImage =
    item.photoUrl ||
    (item.images && item.images.length > 0 ? item.images[0] : null) ||
    (itemType === 'LOST'
      ? 'https://images.unsplash.com/photo-1584438784894-089d6a62b8fa?w=800&auto=format&fit=crop&q=80'
      : 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80');

  const reporterName = item.reporter?.name || item.userDisplayName || 'Campus Member';
  const reporterAvatar = item.reporter?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(reporterName)}`;

  return (
    <>
      <Card className="overflow-hidden flex flex-col h-full transition-all group" hover>
        {/* Card Image Header */}
        <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
          <img
            src={mainImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <StatusBadge status={item.status || itemType} />
          </div>

          {(item.potentialMatchesCount > 0 || item.matchScore) && (
            <div className="absolute top-3 right-3 bg-blue-600/90 text-white text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-xs flex items-center gap-1 shadow-md">
              <Sparkles className="w-3 h-3 text-amber-300" />
              <span>Smart Match Ready</span>
            </div>
          )}
        </div>

        {/* Card Content Body */}
        <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="capitalize">
                {categoryName}
              </Badge>
              {item.verified && (
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              )}
            </div>

            <Link to={`/community/lost-found/${item.id}`} className="block">
              <h3 className="text-base font-bold text-slate-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {title}
              </h3>
            </Link>

            <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
              {item.description}
            </p>
          </div>

          {/* Metadata Section */}
          <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1.5 truncate">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
              <span className="truncate">{locationText}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                <span>{dateText}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Avatar src={reporterAvatar} name={reporterName} size="xs" />
                <span className="truncate max-w-[90px]">{reporterName}</span>
              </div>
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-3 flex items-center gap-2">
            <Link to={`/community/lost-found/${item.id}`} className="flex-1">
              <Button variant="outline" size="sm" className="w-full text-xs rounded-xl">
                View Details
              </Button>
            </Link>

            {itemType === 'FOUND' && item.status !== 'RECOVERED' && item.status !== 'CLAIMED' && (
              <Button
                variant="default"
                size="sm"
                onClick={() => setIsClaimModalOpen(true)}
                className="text-xs rounded-xl gap-1"
              >
                Claim Item
                <ArrowRight className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Claim Modal */}
      {isClaimModalOpen && (
        <ClaimModal item={item} isOpen={isClaimModalOpen} onClose={() => setIsClaimModalOpen(false)} />
      )}
    </>
  );
}
