const smart = require("fhirclient");
const express = require("express");

const app = express();

const _storage = new Map();

const storage = {
  set: (key, value) =>
    new Promise((res) => {
      _storage.set(key, value);
      res(value);
    }),
  get: (key) =>
    new Promise((res) => {
      const value = _storage.get(key);
      res(value);
    }),
  unset: (key) =>
    new Promise((res) => {
      const result = _storage.delete(key);
      res(result);
    }),
  getAll: () => _storage.values(),
};

const smartSettings = {
  clientId: "my-client-id",
  redirectUri: "/app",
  scope: "launch/patient patient/*.read openid fhirUser launch/encounter",
  iss: "https://launch.smarthealthit.org/v/r2",
};

app.get("/launch", (req, res, next) => {
  smart(req, res, storage).authorize(smartSettings).catch(next);
});

app.get("/app", (req, res) => {
  smart(req, res, storage)
    .ready()
    .then(async (client) => {
      res.type("json").send(client.getAuthorizationHeader());
    })
    .catch((e) => {
      console.log(e);
    });
});

app.listen(8080);
