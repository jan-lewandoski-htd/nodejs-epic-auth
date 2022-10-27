import express from "express";
import fetch from "node-fetch";

const app = express();

let tokenEndpoint = "";

// App entry point
app.get("/launch", async (req, res) => {
  const { launch, iss } = req.query;

  const smartConfigRes = await fetch(`${iss}/.well-known/smart-configuration`, {
    headers: { Accept: "application/fhir+json" },
  });

  const { authorization_endpoint, token_endpoint } =
    await smartConfigRes.json();

  tokenEndpoint = token_endpoint;

  const { url } = await fetch(
    `${authorization_endpoint}?` +
      new URLSearchParams({
        response_type: "code",
        client_id: "web application's client ID issued by Epic",
        redirect_uri: "http://localhost:8080/app",
        scope: "launch/patient patient/*.read openid fhirUser launch/encounter",
        launch: launch,
        aud: iss,
      }),
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  res.redirect(url);
});

app.get("/app", async (req, res) => {
  const { code } = req.query;

  const tokenRes = await fetch(tokenEndpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: encodeURI("http://localhost:8080/app"),
      client_id: "web application's client ID issued by Epic",
    }),
  });

  const tokenJson = await tokenRes.json();

  res.type("json").send(JSON.stringify(tokenJson, null, 2));
});

app.listen(8080);
