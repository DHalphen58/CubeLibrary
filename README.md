# CubeLibrary

A free resource library for WCA and unofficial cubing events, with a transparent foundation for WCA statistics.

## Publish it with GitHub Pages

1. Open **Settings → Pages** in this repository.
2. Under **Build and deployment**, select **Deploy from a branch**.
3. Select the `main` branch and `/(root)`, then save.

GitHub will publish the site at `https://dhalphen58.github.io/CubeLibrary/`.

## WCA statistics architecture

The website reads the public WCA export metadata directly to show whether a new results export is available. It deliberately does **not** download the full SQL export in the browser: the official file is hundreds of MB.

To turn the Stats Lab into actual live leaderboards:

1. Run a scheduled job that checks `https://www.worldcubeassociation.org/api/v0/export/public`.
2. When `export_date` changes, download and import the supplied SQL/TSV URL into PostgreSQL.
3. Calculate regular ranks, Sum of Ranks, Kinch, and Elo in materialized tables.
4. Expose read-only JSON endpoints (for example through Cloudflare Workers, Supabase, or a GitHub Actions-generated JSON file).
5. Point `app.js` at those endpoints.

The queries shown in the website are starting points and document intended calculations. Elo must be specified and calculated sequentially in an ETL job; it cannot be a simple SQL sort.

## Contributing resources

Open a GitHub issue with the event, link, type (tutorial/video/algorithm), and why it is a high-quality free resource. Please respect creator attribution and WCA data terms.

## Data attribution

WCA results are public data maintained by the World Cube Association. CubeLibrary is an independent community project and is not affiliated with the WCA.
