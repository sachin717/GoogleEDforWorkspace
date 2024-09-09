import BulkUpload from "../../SelectSource/BulkUpload";
import { gapi } from "gapi-script";
import { BlobServiceClient } from "@azure/storage-blob";
var containerClient: any;
async function blobToString(blob: any) {
    const fileReader = new FileReader();
    return new Promise((resolve, reject) => {
      fileReader.onloadend = (ev) => {
        resolve((ev.target as any).result);
      };
      fileReader.onerror = reject;
      fileReader.readAsArrayBuffer(blob);
    });
  }

export async function getData(){
    var domain = gapi.auth2
    .getAuthInstance()
    .currentUser.le.wt.cu.split("@")[1];
  //console.log(domain);
  var _domain = domain.replace(/\./g, "_");
  var storagedetails =
    '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
    _domain +
    '.json"}]';
  var mappedcustomcol = JSON.parse(storagedetails);
  const sasToken =
    "sv=2022-11-02&ss=b&srt=sco&sp=rwdlaciytfx&se=2028-02-28T12:24:45Z&st=2024-02-29T04:24:45Z&spr=https&sig=FrbdvHpW929m3xVikmm5HiBL6Q00lHjk0a5CPuw1H2U%3D";
  const blobStorageClient = new BlobServiceClient(
    // this is the blob endpoint of your storage acccount. Available from the portal
    // they follow this format: <accountname>.blob.core.windows.net for Azure global
    // the endpoints may be slightly different from national clouds like US Gov or Azure China
    "https://" +
      mappedcustomcol[0].storageaccount +
      ".blob.core.windows.net?" +
      sasToken
    //   ,
    // null
    //new InteractiveBrowserCredential(signInOptions)
  );
  containerClient = blobStorageClient.getContainerClient(
    mappedcustomcol[0].containername
  );
  const blobClient = containerClient.getBlobClient(
    mappedcustomcol[0].blobfilename
  );
  const exists = await blobClient.exists();

  if (exists) {
    const downloadBlockBlobResponse = await blobClient.download();
    const downloaded: any = await blobToString(
      await downloadBlockBlobResponse.blobBody
    );
   
    const decoder = new TextDecoder();
    const str = decoder.decode(downloaded);
    
    return JSON.parse(str);

}
}
export async function updateData(uparsedData){
    var _parsedData = JSON.stringify(uparsedData);
    var domain = gapi.auth2
    .getAuthInstance()
    .currentUser?.le?.wt?.cu?.split("@")[1];
  //console.log(domain);
  var _domain = domain?.replace(/\./g, "_");
  var storagedetails =
    '[{"storageaccount":"mystorageaccountparj","containername":"parjinder1","blobfilename":"' +
    _domain +
    '.json"}]';
  var mappedcustomcol = JSON.parse(storagedetails);
  // console.log(mappedcustomcol,'mapped')
  await containerClient?.getBlockBlobClient(mappedcustomcol[0].blobfilename)
    .upload(_parsedData, Buffer.byteLength(_parsedData))
    .then(() => {

     return true;
    }).catch((error) => {
        console.error("Error uploading data:", error); 
        return false;
      });
}