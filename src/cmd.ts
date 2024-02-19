/* istanbul ignore file */
import { config } from '@src/config';
import inversify from '@src/inversify/investify';

async function bootstrap() {
  console.log(`Environnement selected: ${config.env.mode} on port ${config.env.port ?? 3000}`);
    // env NODE_ENV=dev node dist/src/cmd.js --password password
    // Checks for --password and if it has a value
    const passwordIndex = process.argv.indexOf('--password');
    // Retrieve the value after --password
    const customValue = process.argv[passwordIndex + 1];
    
    if (passwordIndex > -1 && customValue) {
        const cryptedPassword = inversify.cryptService.crypt({
            message: customValue
        });
        
        console.log('Password Command');
        console.log('Value:', `${customValue}`);
        console.log('Crypted password:', `${cryptedPassword}`);
    }
}
bootstrap();