import { useState } from 'react';
import { useAdminResourceQuery } from './liveApi';
import { QueryNotice } from './Dashboard';
import ReportRelated from './ReportRelated';

export default function ClaimLog() {
  const reports = useAdminResourceQuery('lost-found');
  const [reportId, setReportId] = useState('');
  return <>
    <div className="al-heading"><div><h1>Claim Log</h1><p>Select a report to review its claims and matches.</p></div></div>
    <QueryNotice query={reports} label="reports"/>
    {reports.data && !reports.isError && <section className="al-card">
      <label className="al-report-select">Report<select value={reportId} onChange={event => setReportId(event.target.value)}><option value="">Select a report</option>{reports.data.rows.map(report => <option key={report.id} value={report.id}>{report.title || `Report #${report.id}`}</option>)}</select></label>
      {!reports.data.rows.length && <p className="al-empty">No reports available.</p>}
      {reportId && <ReportRelated key={reportId} id={reportId}/>}
    </section>}
  </>;
}
