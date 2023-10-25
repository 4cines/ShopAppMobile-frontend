import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.myAPp.app",
  appName: "myApp",
  webDir: "dist",
  server: {
    androidScheme: "http",
  },
};

export default config;
