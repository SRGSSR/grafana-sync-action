import {GrafanaClient} from "./grafana-client.mjs";
import {BackupStorage} from "./backup-storage.mjs";
import {getInput} from "./utils.mjs";

try {
  const GRAFANA_URL = getInput('grafana-url');
  const API_TOKEN = getInput('api-key');
  const OUTPUT_DIR = getInput('dir', 'dashboards');

  console.log('Starting Grafana Export...');
  console.log(`Grafana URL: ${GRAFANA_URL}`);
  console.log(`Output Directory: ${OUTPUT_DIR}`);

  const client = new GrafanaClient(GRAFANA_URL, API_TOKEN);
  const storage = new BackupStorage(OUTPUT_DIR);

  const folders = await client.getFolders();
  const dashboardsData = await client.getDashboards();

  for (const {uid, folderUid} of dashboardsData) {
    const folderName = folders.findFolderName(folderUid);
    const {dashboard} = await client.getDashboardByUid(uid);

    console.log(`Processing dashboard: '${dashboard.title}' (UID: ${uid}) in folder: '${folderName}'`);

    console.log(`Fetching dashboard details for UID: ${uid}...`);
    storage.saveDashboard(folderName, dashboard);
  }

  console.log('Grafana Export completed successfully.');
  process.exit(0);
} catch (error) {
  console.error('Error during export:', error);
  process.exit(1);
}
