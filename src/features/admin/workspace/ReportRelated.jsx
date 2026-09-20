import { useState } from 'react';
import { useAdminManageMutation, useAdminReportRelatedQuery } from './liveApi';
import { QueryNotice } from './Dashboard';

export default function ReportRelated({ id }) {
  const claims = useAdminReportRelatedQuery({ id, kind: 'claims' });
  const matches = useAdminReportRelatedQuery({ id, kind: 'matches' });
  const [manage, state] = useAdminManageMutation();
  const [pending, setPending] = useState(null);
  async function confirm() {
    const response = await manage({ ...pending });
    if (!response.error) setPending(null);
  }
  return <div className="al-report-related">
    <h2>Claims</h2><QueryNotice query={claims} label="claims"/>
    {!claims.isError && claims.data?.rows.map(claim => <div className="al-post" key={claim.id}><div><strong>Claim #{claim.id}</strong><small>Claimant #{claim.claimantUserId} · {claim.status}</small></div>{claim.status?.toUpperCase() === 'PENDING' && <div className="al-actions"><button className="al-button" disabled={state.isLoading} onClick={() => { state.reset(); setPending({ resource: 'claims', id: claim.id, action: 'approve' }); }}>Approve</button><button className="al-button" disabled={state.isLoading} onClick={() => { state.reset(); setPending({ resource: 'claims', id: claim.id, action: 'reject' }); }}>Reject</button></div>}</div>)}
    {!claims.isError && claims.data?.rows.length === 0 && <p>No claims for this report.</p>}
    {pending && <div className="al-alert"><p>{pending.action === 'approve' ? 'Approve' : pending.action === 'confirm' ? 'Confirm' : 'Reject'} {pending.resource === 'claims' ? 'claim' : 'match'} #{pending.id}?</p><div className="al-actions"><button className="al-button" disabled={state.isLoading} onClick={confirm}>Confirm</button><button className="al-button" disabled={state.isLoading} onClick={() => setPending(null)}>Cancel</button></div></div>}
    {state.isError && <p role="alert" className="al-alert">The record could not be updated. Your account may not have permission.</p>}
    <h2>Matches</h2><QueryNotice query={matches} label="matches"/>
    {!matches.isError && matches.data?.rows.map(match => <div className="al-post" key={match.id}><div><strong>Match #{match.id}</strong><small>Lost item #{match.lostItemId} · Found item #{match.foundItemId}</small></div><span>{match.status} · Score: {match.totalScore}</span>{!['CONFIRMED', 'REJECTED'].includes(match.status) && <div className="al-actions"><button className="al-button" disabled={state.isLoading} onClick={() => { state.reset(); setPending({ resource: 'matches', id: match.id, action: 'confirm' }); }}>Confirm match</button><button className="al-button" disabled={state.isLoading} onClick={() => { state.reset(); setPending({ resource: 'matches', id: match.id, action: 'reject' }); }}>Reject match</button></div>}</div>)}
    {!matches.isError && matches.data?.rows.length === 0 && <p>No matches for this report.</p>}
  </div>;
}
