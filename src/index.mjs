import {GrafanaClient} from "./grafana-client.mjs";
import {BackupStorage} from "./backup-storage.mjs";
import {getInput} from "./utils.mjs";

try {
  const grafanaUrl = getInput('grafana-url');
  const apiToken = getInput('api-key');
  const outputDir = getInput('dir', 'dashboards');
  const clear = getInput('clear', 'false') === 'true';

  console.log('Starting Grafana Export...');
  console.log(`Grafana URL: ${grafanaUrl}`);
  console.log(`Output Directory: ${outputDir}`);

  const client = new GrafanaClient(grafanaUrl, apiToken);
  const storage = new BackupStorage(outputDir);

  if (clear) storage.clear();

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
