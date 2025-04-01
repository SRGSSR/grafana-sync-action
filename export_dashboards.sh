#!/bin/sh -e

echo "Starting Grafana Export..."
echo "Grafana URL: ${GRAFANA_URL}"
echo "Output Directory: ${OUTPUT_DIR}"

# Check if required variables are set
if [ -z "$GRAFANA_URL" ] || [ -z "$API_TOKEN" ]; then
    echo "Error: GRAFANA_URL and API_TOKEN must be set!"
    exit 1
fi

# Create output directory
echo "Creating output directory at ${OUTPUT_DIR}..."
mkdir -p "$OUTPUT_DIR"

# Fetch all folders
echo "Fetching folders from ${GRAFANA_URL}/api/folders..."
FOLDERS_JSON=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$GRAFANA_URL/api/folders")
echo "Fetched folders."

# Function to get a folder's name given its UID
get_folder_name() {
    uid="$1"
    # If uid is empty or null, default to "General"
    if [ -z "$uid" ] || [ "$uid" = "null" ]; then
        echo "General"
        return
    fi
    name=$(echo "$FOLDERS_JSON" | jq -r --arg uid "$uid" 'map(select(.uid == $uid)) | .[0].title // "General"')
    # Sanitize folder name to remove problematic characters
    echo "$name" | sed 's/[\/\\?%*:|"<>]//g'
}

# Fetch all dashboards
echo "Fetching dashboards from ${GRAFANA_URL}/api/search?type=dash-db..."
DASHBOARDS_JSON=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$GRAFANA_URL/api/search?type=dash-db")
echo "Fetched dashboards."

# Loop through each dashboard
echo "$DASHBOARDS_JSON" | jq -c '.[]' | while read -r dashboard; do
    UID=$(echo "$dashboard" | jq -r '.uid')
    TITLE=$(echo "$dashboard" | jq -r '.title' | sed 's/[\/\\?%*:|"<>]//g')
    FOLDER_UID=$(echo "$dashboard" | jq -r '.folderUid')

    FOLDER_NAME=$(get_folder_name "$FOLDER_UID")
    FOLDER_PATH="$OUTPUT_DIR/$FOLDER_NAME"

    echo "Processing dashboard: '$TITLE' (UID: $UID) in folder: '$FOLDER_NAME'"
    mkdir -p "$FOLDER_PATH"

    # Fetch dashboard JSON
    echo "Fetching dashboard details for UID: $UID..."
    DASHBOARD_JSON=$(curl -s -H "Authorization: Bearer $API_TOKEN" "$GRAFANA_URL/api/dashboards/uid/$UID")

    # Save dashboard JSON to file
    echo "$DASHBOARD_JSON" | jq '.dashboard' > "$FOLDER_PATH/$TITLE.json"
    echo "Saved dashboard to: $FOLDER_PATH/$TITLE.json"
done

echo "Grafana Export completed successfully."
exit 0
