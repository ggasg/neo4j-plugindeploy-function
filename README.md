# neo4j-plugindeploy-function
GCP Function for relaying Storage Trigger Data to Cloud Run Web Service and execute a Neo4j Extension deployment process, as described in this article.
## Prerequisites
roles/cloudfunctions.developer is required to deploy and manage this Function. But in order to see a successful end to end execution, additional roles and pre-requisites are required and described here. 
## Running the Function Locally
First of all, update assets/appConfig.json to point to the Cloud Run Web Service URL. This is required for authentication purposes and will be specific to your project.
```json
{
    "deployWebServiceEndpoint": "<YOUR_WEB_SERVICE_ENDPOINT_URI>"
}
```
Next, run the following to install dependencies and then start the function locally.
```bash
npm install
npm run funcStart
```
This will start the function with nodemon. To start without it, simply type npm start and it will run only with the GCP functions framework.
You can then issue a POST Request on http://localhost:8080 with the json payload:
```json
{
  "bucket": "gg-neo-plugin-deploy",
  "contentType": "text/plain",
  "crc32c": "rTVTeQ==",
  "etag": "CNHZkbuF/ugCEAE=",
  "metageneration": "1",
  "name": "plugin.jar",
  "selfLink": "https://www.googleapis.com/storage/v1/b/sample-bucket/o/folder/Test.cs",
  "size": "352",
  "storageClass": "MULTI_REGIONAL",
  "timeCreated": "2020-04-23T07:38:57.230Z",
  "timeStorageClassUpdated": "2020-04-23T07:38:57.230Z",
  "updated": "2020-04-23T07:38:57.230Z"
}
```
## Deploying and Testing on GCP
Before deploying to GCP you must authenticate your GCP CLI. To double-check your entire configuration run
```bash
gcloud auth list
gcloud config list
```
Next, run
```bash
gcloud functions deploy <YOUR_FUNCTION_NAME> \
--trigger-bucket=<BUCKET_NAME> --runtime=nodejs12 --region=<REGION_NAME> --service-account=<SERVICE_ACCOUNT_EMAIL>
```
Where:
- YOUR_FUNCTION_NAME is your preferred name for the Function. This is not used anywhere else in the execution pipeline so there are no specifics about it.
- BUCKET_NAME is the name of the GCS Bucket used to deposit the Neo4j Extension (.jar artifact) ready to be deployed.
- REGION_NAME is your refion name. If your preference is to stay within the GCP Free tier, review the documentation.
- SERVICE_ACCOUNT_EMAIL is the e-mail of the Service Account that you created to run the deployment pipeline as described here.

To test this function on GCP you can simply issue a GCS command to upload a file:
```bash
cp ~/<YOUR_JAR_FILE>.jar gs://<BUCKET_NAME>
```
If the Cloud Run Web Service is not yet set up, the execution will fail but at least you should be able to see it running in the Function Logs.
