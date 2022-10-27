import smart from "fhirclient";
import express from "express";
import fetch from "node-fetch";
import axios from "axios";

const app = express();

const api = axios.create();

let tokenEndpoint = "";

app.get("/launch", async (req, res, next) => {
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

  const { data } = await api.post(
    tokenEndpoint,
    {
      grant_type: "authorization_code",
      code,
      redirect_uri: encodeURI("http://localhost:8080/app"),
      client_id: "web application's client ID issued by Epic",
    },
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );

  res.type("json").send(JSON.stringify(data, null, 2));
});

app.listen(8080);
