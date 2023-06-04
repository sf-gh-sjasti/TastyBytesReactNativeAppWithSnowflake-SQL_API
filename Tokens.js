import forge from "node-forge";
import { PRIVATE_KEY, SNOWFLAKE_ACCOUNT, PUBLIC_KEY_FINGERPRINT } from '@env';

export default function getBearerToken() {
  const removeB64Padding = base64 => base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  function encodeB64(str) {
      const encodedB64 = forge.util.encode64(str);
      return removeB64Padding(encodedB64);
  }

  //privateKey is the private key that you read from the private key file when you generated the public key fingerprint.
  const privateKey = forge.pki.privateKeyFromPem(PRIVATE_KEY);
  const md = forge.md.sha256.create();
  const header = {
      "typ": "JWT",
      "alg": "RS256"
  };
  //Use uppercase for the account identifier and user name.
  var qualified_username = SNOWFLAKE_ACCOUNT + ".DATA_APP_DEMO";
  var publicKeyFingerprint = PUBLIC_KEY_FINGERPRINT
  var payload = {
      //Set the issuer to the fully qualified username concatenated with the public key fingerprint (calculated in the  previous step).
      iss: qualified_username+ '.' + publicKeyFingerprint,
      //Set the subject to the fully qualified username.
      sub: qualified_username,
      //Set the issue time to current time.
      iat: Math.round(new Date().getTime()/1000),
      //Set the expiration time to 1 hour.
      exp: Math.round(new Date().getTime()/1000) + 3600
  };
  const strHeader = JSON.stringify(header);
  const strPayload = JSON.stringify(payload);
  const headerB64 = encodeB64(strHeader); 
  const payloadB64 = encodeB64(strPayload);
  const preHash = headerB64 + '.' + payloadB64;
  md.update(preHash, 'utf8');
  const signature = privateKey.sign(md);
  const signature64 = encodeB64(signature);
  return headerB64 + '.' + payloadB64 + '.' + signature64;
};