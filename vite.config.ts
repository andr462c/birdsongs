import { defineConfig, loadEnv, Plugin } from "vite";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const xcProxy: Plugin = {
    name: "xeno-canto-proxy",
    configureServer(server) {
      server.middlewares.use("/api/xc", async (req, res) => {
        try {
          const reqUrl = new URL(req.url || "/", "http://localhost");
          const xcUrl = new URL(
            `https://xeno-canto.org/api/3${reqUrl.pathname}`
          );

          for (const [key, value] of reqUrl.searchParams) {
            xcUrl.searchParams.set(key, value);
          }
          xcUrl.searchParams.set("key", env.KEY || process.env.KEY || "");

          const response = await fetch(xcUrl.toString());
          const data = await response.text();

          res.setHeader("Content-Type", "application/json");
          res.statusCode = response.status;
          res.end(data);
        } catch (error) {
          console.error("XC proxy error:", error);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: "Failed to fetch from xeno-canto" }));
        }
      });
    },
  };

  return {
    plugins: [xcProxy],
    server: {
      allowedHosts: env.ALLOWED_HOSTS
        ? env.ALLOWED_HOSTS.split(",").map((h: string) => h.trim())
        : [],
    },
  };
});
