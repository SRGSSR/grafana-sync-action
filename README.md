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

3. **Create a workflow file** in `.github/workflows/grafana-backup.yml` with the following content:

  ```yaml
  name: Grafana Dashboard Backup

  on:
    schedule:
      - cron: '0 2 * * *'
    workflow_dispatch:

  jobs:
    backup:
      runs-on: ubuntu-latest

      permissions:
        contents: write
        pull-requests: write

      steps:
        - name: Checkout repository
          uses: actions/checkout@v4
          with:
            fetch-depth: 0

        - name: Run Grafana Sync
          uses: srgssr/grafana-sync-action@v1.2.0
          with:
            grafana-url: ${{ secrets.GRAFANA_URL }}
            api-key: ${{ secrets.GRAFANA_API_KEY }}
            clear: true
            dir: 'dashboards'

        - name: Create Pull Request
          uses: peter-evans/create-pull-request@v7
          with:
            token: ${{ secrets.GITHUB_TOKEN }}
            add-paths: dashboards
            commit-message: "chore: automated grafana dashboard backup"
            committer: "github-actions[bot] <41898282+github-actions[bot]@users.noreply.github.com>"
            author: "${{ github.actor }} <${{ github.actor_id }}+${{ github.actor }}@users.noreply.github.com>"
            signoff: false
            draft: false
            delete-branch: true
            branch: "chore/update-grafana-dashboards"
            title: "chore: automated backup of grafana dashboards"
            body: "This pull request contains the latest backup of our Grafana dashboards"
  ```

**Running the Action**

- The action will **automatically run daily at 2 AM** to check for changes.
- You can also **manually trigger** the workflow from the GitHub Actions tab.
- If changes are detected, it will create a **pull request** containing the updated dashboards.

## Contributing

Contributions are welcome! If you'd like to contribute, please follow the project's code style and
linting rules. Here are some commands to help you get started:

Check your JavaScript code:

```shell
npm run eslint
```

All commits must follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
format to ensure compatibility with our automated release system. A pre-commit hook is available to
validate commit messages.

You can set up hook to automate these checks before commiting and pushing your changes. Enable this
hook by running the `prepare` script:

```shell
npm run prepare
```

Refer to our [Contribution Guide](docs/CONTRIBUTING.md) for more detailed information.

## License

This project is licensed under the [MIT License](LICENSE).
