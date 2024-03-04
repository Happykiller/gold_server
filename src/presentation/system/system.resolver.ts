import { Query, Resolver } from '@nestjs/graphql';

import { version } from '../../../package.json'
import { SystemInfoResolverModel } from '@presentation/system/model/info.system.resolver.model';

@Resolver('SystemResolver')
export class SystemResolver {

  @Query(
    /* istanbul ignore next */
    () => SystemInfoResolverModel
  )
  async systemInfo(): Promise<SystemInfoResolverModel> {
    return {
      version
    };
  }
}