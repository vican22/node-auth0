const express = require("express");
const app = express();

const keys = require("./keys");

const jwt = require("express-jwt");
const jwtAuthz = require("express-jwt-authz");
const jwksRsa = require("jwks-rsa");

const port = process.env.PORT || 8080;
// Authentication middleware. When used, the
// Access Token must exist and be verified against
// the Auth0 JSON Web Key Set
const checkJwt = jwt({
  // Dynamically provide a signing key
  // based on the kid in the header and
  // the signing keys provided by the JWKS endpoint.

  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: "https://dev-xtm96ik1.eu.auth0.com/.well-known/jwks.json"
  }),

  // Validate the audience and the issuer
  audience: keys.AUDIENCE,
  issuer: keys.ISSUER,
  algorithms: ["RS256"]
});

app.use(checkJwt);

app.get("/authorized", function(req, res) {
  res.send("Secured Resource");
});

app.listen(port);
