import {sanitize} from "./utils.mjs";

/**
 * Manages folder data retrieved from the Grafana instance.
 */
export class GrafanaFolders {
  /**
   * Creates an instance of GrafanaFolders.
   * @param {GrafanaFolder[]} foldersData - The list of folders retrieved from Grafana.
   */
  constructor(foldersData) {
    this.foldersData = foldersData;
  }

  /**
   * Finds and returns the sanitized folder name based on its UID.
   * @param {string} folderUid - The UID of the folder.
   * @returns {string} - The sanitized folder name, defaults to 'General' if not found.
   */
  findFolderName(folderUid) {
    if (!folderUid || folderUid === 'null') {
      return 'General';
    }
    const folder = this.foldersData.find(f => f.uid === folderUid);


    return sanitize(folder?.title || 'General');
  }
}
