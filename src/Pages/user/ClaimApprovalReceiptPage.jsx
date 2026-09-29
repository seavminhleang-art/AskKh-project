import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useWorkspaceTranslation } from "@/locales/workspace/useWorkspaceTranslation";
import { useWorkspaceDataQuery } from "../../features/workspace/workspaceApi";
import { dateLabel, rows } from "../../features/workspace/workspaceModel";
import { Badge, Empty, QueryState } from "./WorkspaceUI";

export default function ClaimApprovalReceiptPage() {
  const { w, locale } = useWorkspaceTranslation();
  const [params] = useSearchParams();
  const reportId = params.get("reportId");
  const claimId = params.get("claimId");
  const query = useWorkspaceDataQuery({ resource: "claims", id: reportId }, { skip: !reportId || !claimId });
  const claim = useMemo(() => rows(query.data).find((item) => String(item.id) === String(claimId)), [query.data, claimId]);

  if (!reportId || !claimId) return <Empty>{w("Approval receipt details are missing.")}</Empty>;
  return (
    <section className="uw-page uw-receipt-page">
      <div className="uw-receipt-toolbar">
        <Link className="uw-button secondary" to="/dashboard/claims">{w("Back to claims")}</Link>
        <button className="uw-button" type="button" onClick={() => window.print()}>{w("Print receipt")}</button>
      </div>
      <QueryState query={query}>
        {!claim ? <Empty>{w("Approved claim not found.")}</Empty> : (
          <article className="uw-approval-receipt">
            <header>
              <p className="uw-receipt-brand">NEXA · LOST &amp; FOUND</p>
              <h1>{w("Item recovery approval")}</h1>
              <p>{w("This record confirms that the finder approved the ownership claim for the item below.")}</p>
            </header>
            <div className="uw-receipt-status"><span>{w("Approval status")}</span><Badge>{w("Approved by finder")}</Badge></div>
            <dl>
              <div><dt>{w("Receipt reference")}</dt><dd>LF-{reportId}-{claimId}</dd></div>
              <div><dt>{w("Item")}</dt><dd>{claim.itemTitle || claim.reportTitle || claim.itemName || claim.title || w("Found item")}</dd></div>
              <div><dt>{w("Found item report")}</dt><dd>#{claim.reportId ?? claim.itemReportId ?? reportId}</dd></div>
              <div><dt>{w("Claimant")}</dt><dd>{claim.claimantDisplayName || claim.claimantName || (claim.claimantUserId != null ? `#${claim.claimantUserId}` : w("Not provided"))}</dd></div>
              <div><dt>{w("Approved")}</dt><dd>{dateLabel(claim.updatedAt || claim.approvedAt || claim.createdAt, locale)}</dd></div>
              <div><dt>{w("Finder")}</dt><dd>{claim.finderDisplayName || claim.reporterDisplayName || claim.ownerDisplayName || w("Verified finder account")}</dd></div>
              <div className="uw-receipt-detail"><dt>{w("Ownership detail provided")}</dt><dd>{claim.describedHiddenDetail || claim.proofDescription || claim.claimDescription || claim.details || w("No detail provided")}</dd></div>
            </dl>
            <footer>{w("Keep this receipt with you when arranging the item handover. The approval is recorded in NEXA Lost & Found under claim #{{value0}}.", { value0: claim.id })}</footer>
          </article>
        )}
      </QueryState>
    </section>
  );
}
