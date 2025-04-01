import * as fs from "node:fs";
import path from "node:path";
import {sanitize} from "./utils.mjs";

/**
 * Handles local file storage for backing up Grafana dashboards.
 */
export class BackupStorage {
  /**
   * Creates an instance of BackupStorage.
   * @param {string} baseDir - The base directory where dashboards will be saved.
   */
  constructor(baseDir) {
    this.baseDir = baseDir;
    fs.mkdirSync(this.baseDir, {recursive: true});
  }

  /**
   * Ensures the existence of a folder inside the base directory.
   * @param {string} folderName - The name of the folder to create.
   * @returns {string} - The full path of the created folder.
   */
  createFolder(folderName) {
    const folderPath = path.join(this.baseDir, folderName);

    fs.mkdirSync(folderPath, {recursive: true});

    return folderPath;
  }

  /**
   * Saves a Grafana dashboard JSON file in the appropriate folder.
   * @param {string} folderName - The name of the folder where the dashboard will be stored.
   * @param {GrafanaDashboard} dashboard - The dashboard data to be saved.
   */
  saveDashboard(folderName, dashboard) {
    const folderPath = this.createFolder(folderName);
    const title = sanitize(dashboard.title);
    const outputFilePath = path.join(folderPath, `${title}.json`);

    fs.writeFileSync(outputFilePath, JSON.stringify(dashboard, null, 2));
    console.log(`Saved dashboard to: ${outputFilePath}`);
  }
}
