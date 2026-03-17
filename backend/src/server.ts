import app from "./app";
import { config } from "./config";
import { startCronJobs } from "./jobs/cron";

const start = async () => {
  try {
    app.listen(config.port, () => {
      console.log(`[CastTrack API] Running on port ${config.port} (${config.nodeEnv})`);
      startCronJobs();
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
