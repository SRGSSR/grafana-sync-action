import {GrafanaFolders} from "./grafana-folders.mjs";

/**
 * Handles communication with the Grafana API.
 */
export class GrafanaClient {
  /**
   * Creates an instance of GrafanaClient.
   * @param {string} baseUrl - The base URL of the Grafana instance.
   * @param {string} apiToken - The API token for authentication.
   */
  constructor(baseUrl, apiToken) {
    if (!baseUrl || !apiToken) {
      throw new Error('baseUrl and apiToken must be set!');
    }

    this.baseUrl = baseUrl;
    this.headers = {Authorization: `Bearer ${apiToken}`};
  }

  /**
   * Fetches JSON data from the Grafana API.
   * @param {string} endpoint - The API endpoint to fetch data from.
   * @returns {Promise<any>} - The JSON response from the API.
   * @throws {Error} - If the request fails.
   * @private
   */
  async #fetchJson(endpoint) {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {headers: this.headers});

    if (!response.ok) {
      throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Retrieves all folders from the Grafana instance.
   * @returns {Promise<GrafanaFolders>} - A list of folders.
   * @throws {Error} - If the request fails.
   */
  async getFolders() {
    console.log(`Fetching folders from ${this.baseUrl}/api/folders...`);

    return new GrafanaFolders(await this.#fetchJson('/api/folders'));
  }

  /**
   * Retrieves all dashboards from the Grafana instance.
   * @returns {Promise<{uid: string, folderUid: string}[]>} - A list of dashboards.
   * @throws {Error} - If the request fails.
   */
  async getDashboards() {
    console.log(`Fetching dashboards from ${this.baseUrl}/api/search?type=dash-db...`);

    return this.#fetchJson('/api/search?type=dash-db');
  }

  /**
   * Retrieves a specific dashboard by its UID.
   * @param {string} uid - The UID of the dashboard.
   * @returns {Promise<{dashboard:GrafanaDashboard}>} - The dashboard data.
   * @throws {Error} - If the request fails.
   */
  async getDashboardByUid(uid) {
    return this.#fetchJson(`/api/dashboards/uid/${uid}`);
  }
}

/**
 * @typedef {Object} GrafanaFolder
 * @property {string} uid - The unique identifier of the folder.
 * @property {string} title - The sanitized title of the folder.
 */

/**
 * @typedef {Object} GrafanaDashboard
 * @property {string} title - The sanitized title of the folder.
 */

