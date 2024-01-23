export class Configuration {
  public version?: string;

  public env?: {
    mode?: string;
    port?: number;
  };

  public graphQL?: {
    schemaFileName: boolean | string;
    playground: boolean;
    introspection: boolean;
    installSubscriptionHandlers: boolean;
  };

  public client?: {
    token?: string;
  }

  public bdd?: {
    host?: string;
    user?: string;
    password?: string;
    database?: string;
  }

  public jwt?: {
    refreshTokenName?: string,
    secret?: string,
    signOptions?: {
      expiresIn?: string
    }
  };
  
  /**
   * request limitation per second
   * DOC https://docs.nestjs.com/security/rate-limiting
   */
  public ratelimit?: {
    /**
     * ttl the number of seconds that each request will last in storage
     */
    ttl: number,
    /**
     * limit the maximum number of requests within the TTL limit
     */
    limit: number
  };
}