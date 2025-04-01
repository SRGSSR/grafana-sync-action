# Grafana Dashboard Backup Action

A GitHub Action that automates the process of backing up Grafana dashboards.

## Quick Guide

**Prerequisites and Requirements**

- A **Grafana instance** with API access enabled
- A **GitHub repository** to store dashboard backups
- **GitHub Actions** enabled in your repository
- _(Optional)_ A **GitHub Personal Access Token (PAT)** if you want to automate pull request
  creation.

**Setup**

1. **Create a GitHub repository** to store your Grafana dashboard backups.
2. **Add the required secrets** to your repository:

- `GRAFANA_URL`: The URL of your Grafana instance.
- `GRAFANA_API_KEY`: The API key for Grafana authentication.
- _(Optional)_ `GH_PAT`: A GitHub Personal Access Token with `repo` permissions, needed only if
  automating PR creation.

3. **Create a workflow file** in `.github/workflows/grafana-backup.yml` with the following content:

  ```yaml
  name: Grafana Dashboard Backup

  on:
     schedule:
       - cron: '0 2 * * *'  # Runs every day at 2 AM UTC
     workflow_dispatch:  # Allows manual triggering

  jobs:
     backup:
       runs-on: ubuntu-latest

       steps:
         - name: Checkout repository
           uses: actions/checkout@v4

         - name: Run Grafana Sync
           uses: srgssr/grafana-sync-action@v1
           with:
              grafana-url: ${{ secrets.GRAFANA_URL }}
              api-key: ${{ secrets.GRAFANA_API_KEY }}
              output-dir: dashboards

         - name: Commit and Push Changes
           run: |
             git config --global user.name "github-actions[bot]"
             git config --global user.email "github-actions[bot]@users.noreply.github.com"
             git add dashboards
             git commit -m "Automated backup of Grafana dashboards" || echo "No changes to commit"
             git push

         # (Optional) Create a Pull request using peter-evans/create-pull-request
         - name: Create Pull Request
           uses: peter-evans/create-pull-request@v7
           with:
             token: ${{ secrets.GH_PAT }}
             commit-message: "chore: automated Grafana dashboard backup"
             title: "chore: automated backup of Grafana dashboards"
             body: "This PR contains the latest Grafana dashboard updates."
             branch: "backup/grafana-dashboards"
             delete-branch: true
  ```

**Running the Action**

- The action will **automatically run daily at 2 AM UTC** to check for changes.
- You can also **manually trigger** the workflow from the GitHub Actions tab.
- If changes are detected, it will create a **pull request** containing the updated dashboards.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow the project's code style and
linting rules.

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
format to ensure compatibility with our automated release system. A pre-commit hook is available to
validate commit messages.

You can set up hook to automate these checks before commiting and pushing your changes, to do so
update the Git hooks path:

```bash
git config core.hooksPath .githooks/
```

Refer to our [Contribution Guide](docs/CONTRIBUTING.md) for more detailed information.

## License

This project is licensed under the [MIT License](LICENSE).
