import express, { type Express } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (_req, res) => {
  res.type("html").send(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AI Insight Engine API</title>
    <style>
      body {
        margin: 0;
        font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
        background: #0b1220;
        color: #e5eefc;
        display: grid;
        place-items: center;
        min-height: 100vh;
      }
      main {
        width: min(720px, calc(100vw - 32px));
        background: rgba(15, 23, 42, 0.92);
        border: 1px solid rgba(148, 163, 184, 0.22);
        border-radius: 18px;
        padding: 28px;
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.35);
      }
      h1 {
        margin: 0 0 12px;
        font-size: 1.6rem;
      }
      p {
        margin: 0 0 16px;
        color: #bfd0f2;
        line-height: 1.6;
      }
      ul {
        margin: 0;
        padding-left: 18px;
      }
      li {
        margin: 8px 0;
      }
      a {
        color: #7dd3fc;
      }
      code {
        color: #f8fafc;
      }
    </style>
  </head>
  <body>
    <main>
      <h1>AI Insight Engine API is running</h1>
      <p>This port serves the backend API. Use one of the links below:</p>
      <ul>
        <li><a href="/api/healthz"><code>/api/healthz</code></a> for a health check</li>
        <li><a href="/api/stats"><code>/api/stats</code></a> for detection statistics</li>
        <li><a href="http://127.0.0.1:22772/">frontend app on port <code>22772</code></a></li>
      </ul>
    </main>
  </body>
</html>`);
});

app.use("/api", router);

export default app;
