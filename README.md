# home-camera

## Configuration
1. Set following environment variables:

    * (mandatory)
        * USER_EMAIL
        * USER_PASSWORD
        * DB_USER
        * DB_PASSWORD
        * DB_HOST
        * DB_PORT
        * DB_DATABASE
        * JWT_EXPIRES
        * JWT_ISSUER
        * JWT_AUDIENCE
        * JWT_CERTS_DIR (JWT certificates directory)
        * JWT_PRIVATE (JWT private key file path)
        * JWT_CERT (JWT public key file path)
  
    * (optional)
        * JWT_ALGORITHM
        * PORT

2. Create `JWT` certificates into `JWT_CERTS_DIR` directory

3. Comment code into `opencv4nodejs` source module:
        ```
            //if (!self->self.isOpened()) {
                //  return tryCatch.throwError("failed to open capture");
            //}
        ```
