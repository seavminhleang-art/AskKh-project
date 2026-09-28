import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { baseApi } from '../../store/api/baseApi';
import { FORUM_API_BASE_URL } from '../../config/forumApi';
import { playNotificationSound, armNotificationSound } from './notificationSound';
import { lostFoundApi } from '../lostFound/lostFoundApi';

function getWebSocketUrl(token) {
  let base = FORUM_API_BASE_URL;
  if (base.startsWith('/')) {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    base = `${proto}//${window.location.host}${base}`;
  } else if (base.startsWith('https:')) {
    base = base.replace('https:', 'wss:');
  } else if (base.startsWith('http:')) {
    base = base.replace('http:', 'ws:');
  }
  return `${base.replace(/\/+$/, '')}/notifications/ws?token=${encodeURIComponent(token)}`;
}

function getSseUrl(token) {
  const clean = FORUM_API_BASE_URL.replace(/\/+$/, '');
  return `${clean}/notifications/stream?token=${encodeURIComponent(token)}`;
}

export function useRealtimeNotifications() {
  const dispatch = useDispatch();
  const { accessToken, isAuthenticated } = useSelector((state) => state.auth);
  const [approveClaimMutation] = lostFoundApi.useApproveClaimMutation();
  const [rejectClaimMutation] = lostFoundApi.useRejectClaimMutation();

  const activeWsRef = useRef(null);
  const activeSseRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);

  useEffect(() => {
    // Arm notification sound on first user gesture
    const handleUserGesture = () => {
      armNotificationSound();
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
    window.addEventListener('click', handleUserGesture, { once: true });
    window.addEventListener('keydown', handleUserGesture, { once: true });

    return () => {
      window.removeEventListener('click', handleUserGesture);
      window.removeEventListener('keydown', handleUserGesture);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !accessToken) {
      if (activeWsRef.current) {
        activeWsRef.current.close();
        activeWsRef.current = null;
      }
      if (activeSseRef.current) {
        activeSseRef.current.close();
        activeSseRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      return;
    }

    let isDisposed = false;

    function handleNotificationPayload(rawPayload) {
      let data = rawPayload;
      if (typeof rawPayload === 'string') {
        try {
          data = JSON.parse(rawPayload);
        } catch {
          data = { message: rawPayload };
        }
      }

      if (!data) return;

      // Invalidate queries so lists and badge counts update instantly
      dispatch(baseApi.util.invalidateTags(['Notification', 'Claim', 'LostFound', 'Match']));

      // Play audio notification
      playNotificationSound();

      const type = String(data.type || data.eventType || '').toUpperCase();
      const title = data.title || data.subject || (type.includes('CLAIM') ? 'Claim Notification' : 'New Notification');
      const message = data.body || data.message || data.description || 'You have a new update.';
      const claimId = data.claimId || data.claim?.id || (type.includes('CLAIM') ? data.id : null);

      // Owner receives a new claim → show actionable Approve / Reject toast
      const isClaimRequest =
        type.includes('CLAIM_CREATED') ||
        type.includes('CLAIM_RECEIVED') ||
        type.includes('NEW_CLAIM') ||
        type.includes('CLAIM_SUBMITTED') ||
        (type.includes('CLAIM') && !type.includes('APPROVED') && !type.includes('REJECTED'));

      // Claimant receives the decision → show result toast
      const isClaimApproved = type.includes('CLAIM_APPROVED') || type.includes('CLAIM_ACCEPTED');
      const isClaimRejected = type.includes('CLAIM_REJECTED') || type.includes('CLAIM_DENIED');

      if (isClaimApproved) {
        // ✅ Claimant: claim was approved
        toast.success(
          <div className="space-y-1">
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>✅</span>
              <span>{title || 'Claim Approved'}</span>
            </div>
            <p className="text-xs leading-snug opacity-90">{message}</p>
          </div>,
          {
            autoClose: 8000,
            toastId: `claim-approved-${claimId || Date.now()}`,
          }
        );
      } else if (isClaimRejected) {
        // ❌ Claimant: claim was rejected
        toast.error(
          <div className="space-y-1">
            <div className="font-bold text-sm flex items-center gap-1.5">
              <span>❌</span>
              <span>{title || 'Claim Rejected'}</span>
            </div>
            <p className="text-xs leading-snug opacity-90">{message}</p>
          </div>,
          {
            autoClose: 8000,
            toastId: `claim-rejected-${claimId || Date.now()}`,
          }
        );
      } else if (isClaimRequest && claimId) {
        // 🔔 Owner: new claim received — show Approve / Reject action buttons
        toast.info(
          ({ closeToast }) => (
            <div className="space-y-2">
              <div className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
                <span>🔔</span>
                <span>{title}</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-snug">
                {message}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-emerald-600 hover:bg-emerald-700 text-white transition-colors cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    closeToast();
                    try {
                      await approveClaimMutation(claimId).unwrap();
                      toast.success(`Claim #${claimId} approved!`);
                    } catch (err) {
                      toast.error(err?.data?.message || 'Failed to approve claim');
                    }
                  }}
                >
                  Approve
                </button>
                <button
                  type="button"
                  className="px-2.5 py-1 text-xs font-semibold rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors cursor-pointer"
                  onClick={async (e) => {
                    e.stopPropagation();
                    closeToast();
                    try {
                      await rejectClaimMutation(claimId).unwrap();
                      toast.info(`Claim #${claimId} rejected`);
                    } catch (err) {
                      toast.error(err?.data?.message || 'Failed to reject claim');
                    }
                  }}
                >
                  Reject
                </button>
              </div>
            </div>
          ),
          {
            autoClose: 10000,
            toastId: `claim-notif-${claimId || Date.now()}`,
          }
        );
      } else {
        // Generic notification toast
        toast.info(
          <div>
            <div className="font-semibold text-sm">{title}</div>
            <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">{message}</div>
          </div>,
          {
            autoClose: 5000,
            toastId: `notif-${data.id || Date.now()}`,
          }
        );
      }
    }

    // Try WebSocket connection first

    function startWebSocket() {
      if (isDisposed) return;
      try {
        const wsUrl = getWebSocketUrl(accessToken);
        const ws = new WebSocket(wsUrl);
        activeWsRef.current = ws;

        ws.onmessage = (event) => {
          handleNotificationPayload(event.data);
        };

        ws.onerror = () => {
          // If WS fails, fallback to SSE
          if (!isDisposed && !activeSseRef.current) {
            startSse();
          }
        };

        ws.onclose = () => {
          if (!isDisposed && !activeSseRef.current) {
            reconnectTimeoutRef.current = setTimeout(startWebSocket, 10000);
          }
        };
      } catch {
        startSse();
      }
    }

    // Fallback Server-Sent Events (SSE)
    function startSse() {
      if (isDisposed || activeSseRef.current) return;
      try {
        const sseUrl = getSseUrl(accessToken);
        const es = new EventSource(sseUrl);
        activeSseRef.current = es;

        es.onmessage = (event) => {
          handleNotificationPayload(event.data);
        };

        es.addEventListener('notification', (event) => {
          handleNotificationPayload(event.data);
        });

        es.addEventListener('claim', (event) => {
          handleNotificationPayload(event.data);
        });

        es.onerror = () => {
          // EventSource will auto-reconnect natively
        };
      } catch {
        // Fallback polling already exists in RTK queries
      }
    }

    startWebSocket();

    return () => {
      isDisposed = true;
      if (activeWsRef.current) {
        activeWsRef.current.close();
        activeWsRef.current = null;
      }
      if (activeSseRef.current) {
        activeSseRef.current.close();
        activeSseRef.current = null;
      }
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
    };
  }, [accessToken, isAuthenticated, dispatch, approveClaimMutation, rejectClaimMutation]);
}

export default useRealtimeNotifications;
