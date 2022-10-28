# Test using [SMART App Launcher](http://launch.smarthealthit.org/?auth_error=&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3A%2F%2Flocalhost%3A8080%2Flaunch&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sde=&sim_ehr=1&token_lifetime=15&user_pt=)

1. Run `npm install` command
2. Run `npm run dev` command
3. Go to [SMART App Launcher](http://launch.smarthealthit.org/?auth_error=&fhir_version_2=r4&iss=&launch_ehr=1&launch_url=http%3A%2F%2Flocalhost%3A8080%2Flaunch&patient=&prov_skip_auth=1&provider=&pt_skip_auth=1&public_key=&sde=&sim_ehr=1&token_lifetime=15&user_pt=)
4. Set `http://localhost:8080/launch` in *App Launch URL* field
5. Click *Launch App*
6. Click *Login* (random credentials are accepted)
7. Select a patient
8. After successful authentication flow, token response should be displayed inside the EHR.
