# Running Playwright Tests on Mac OS Safari

This project supports running Playwright tests on both the local test server and the production server using Safari on macOS.

## Test Server (Local)

To run Playwright tests against your local development server ([http://localhost:3000/](http://localhost:3000/)), use:

```sh
npm run playwright:dev -- --project=safari
```

or

```sh
npx playwright test --project=safari
```

## Production Server

To run Playwright tests against the production deployment ([https://pdf-splitter-eta.vercel.app/](https://pdf-splitter-eta.vercel.app/)), set the `USE_PRODUCTION` environment variable to `true`:

```sh
USE_PRODUCTION=true npx playwright test --project=safari
```

---

**Note:**

- Make sure you have Playwright and its dependencies installed.
- Safari support requires macOS.
- You can customize the test project or add additional Playwright CLI flags as needed.
