/**
 * Lost & Found Service
 *
 * Architectural Boundary:
 * API (future backend)
 *   ↓
 * lostFoundService
 *   ↓
 * Dashboard Data Hooks (useDashboardData)
 *   ↓
 * Dashboard UI Components (LostFoundOverview, StatCards)
 *
 * Current Backend Status:
 * The ISTAD Forum API currently does NOT have /lost-found/* endpoints deployed.
 *
 * CRITICAL RULES:
 * 1. DO NOT make network requests to nonexistent endpoints.
 * 2. DO NOT invent fake endpoints.
 * 3. DO NOT simulate a fake matching algorithm.
 * 4. Return structured, typed fallback states so components remain 100% prepared
 *    for when the backend goes live, requiring ZERO dashboard UI redesign.
 */

export const lostFoundService = {
  /**
   * Service availability flag.
   * Toggle to true once backend endpoints are deployed and confirmed in OpenAPI spec.
   */
  isServiceAvailable: false,

  /**
   * Status description for UI presentation.
   */
  statusMessage: 'Lost & Found services are coming soon.',

  /**
   * Get overall summary of lost & found activities.
   * Prepared for: GET /lost-found/summary or GET /lost-found/reports
   */
  async getSummary() {
    if (!this.isServiceAvailable) {
      return {
        available: false,
        message: this.statusMessage,
        summary: {
          activeLost: 0,
          activeFound: 0,
          possibleMatches: 0,
          resolved: 0,
          total: 0,
        },
      };
    }

    // Future implementation when API is deployed:
    // const response = await baseApi.endpoints.getLostFoundSummary.initiate()();
    // return { available: true, summary: response.data };
    return { available: false, summary: null };
  },

  /**
   * Get recent lost and found items.
   * Prepared for: GET /lost-found/reports?limit=5
   */
  async getRecentItems(_limit = 5) {
    if (!this.isServiceAvailable) {
      return {
        available: false,
        message: this.statusMessage,
        items: [],
      };
    }

    return { available: false, items: [] };
  },

  /**
   * Get a single report by ID.
   * Prepared for: GET /lost-found/reports/:id
   */
  async getReportById(_id) {
    if (!this.isServiceAvailable) {
      return {
        available: false,
        message: this.statusMessage,
        item: null,
      };
    }

    return { available: false, item: null };
  },

  /**
   * Submit a new lost or found report.
   * Prepared for: POST /lost-found/reports
   */
  async createReport(_reportData) {
    if (!this.isServiceAvailable) {
      throw new Error(
        'Lost & Found submission is currently unavailable. Backend service is coming soon.'
      );
    }

    // Future implementation:
    // return await baseApi.endpoints.createLostFoundReport.initiate(reportData)();
  },
};

export default lostFoundService;
