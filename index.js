const fetch = require('node-fetch');
const { config } = require('./assets/appConfig.json');

async function run(funcPayload) {
    let targetAudience = config.deployWebServiceEndpoint;
    let authUrl = `http://metadata.google.internal/computeMetadata/v1/instance/service-accounts/default/identity?audience=${targetAudience}`; // URL to send the request to
    const authRes = await fetch(authUrl, {
        method: 'get',
        headers: {"Metadata-Flavor": "Google"},
    });

    let authToken = Buffer.from(authRes.body.read()).toString();
    let serviceUrl = targetAudience; // URL to send the request to
    return await fetch(serviceUrl, {
        method: 'post',
        headers: {'Authorization': `Bearer ${authToken}`,
            'ce-subject': 'sample',
            'ce-type': 'ggoogle.cloud.storage.object.v1.finalized',
            'content-type': 'application/json'
        },
        body: JSON.stringify(funcPayload)
    });
}

exports.pluginDeploy = (file, context) => {
    run(file).then((requestResult) => {
        console.log(Buffer.from(requestResult.body.read()).toString());
    }).catch(console.error); 
  };