// interface EnvironmentVariables {
//   HTTP_PORT: number;
//   SONGS_PATH: string;
// }

type ManagedEnvVars = {
  songs: {
    server: string;
  };
};

class EnvironmentService {
  private envVars!: ManagedEnvVars;

  constructor() {
    this.readEnv();
  }

  /**
   * DO NOT USE ! (internal method exposed for unit testing this component).
   * @return {void}.
   */
  readEnv(): void {
    // const env = process.env as any as EnvironmentVariables;
    this.envVars = {
      songs: {
        server: "http://192.168.1.15:48666",
      },
    };
  }

  get<K extends keyof ManagedEnvVars>(prop: K): ManagedEnvVars[K] {
    return this.envVars[prop];
  }
}

export const envService = new EnvironmentService();
