export default interface PasskeyDbModel {
  id: string;
  label: string;
  user_id: string;
  hostname: string;
  user_code: string;
  challenge: string;
  registration: {
    username: string;
    credential: {
      id: string;
      publicKey: string;
      algorithm: string;
    };
    authenticatorData: string;
    clientData: string;
    attestationData: string;
  };
  active: boolean;
}
