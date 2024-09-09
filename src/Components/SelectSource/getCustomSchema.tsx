import * as React from "react";
import { gapi } from "gapi-script";
export default async function getschemasfields() {
    let attributeNames;
    let finalcustom: { fieldName: any; displayname: any; }[] =[];
    const response =
        await gapi.client.directory.schemas.list({
            // userKey: userEmail,
            customerId: 'my_customer', // Use 'my_customer' to refer to the current Google Workspace domain
            // schemaKey: 'OtherFields', // 'custom' represents custom schema
            // maxResults: 100,
            //pageToken: pageToken,
        })
    //.then((response:any)=>{
    const schema = response.result.schemas||[];
    schema?.map((item: any) => {
       item?.fields?.map((field: any) => {
            let finalarray = {
                fieldName: field.fieldName||'',
                displayname: field.displayName||'',
            }
            finalcustom.push(finalarray)
        })
        //field.fieldName) : [];
    })
    //  attributeNames = schema ? schema.fields.map((field: { fieldName: any; }) => field.fieldName) : [];
    console.log(finalcustom, "finalcustom")

    /// })
    // const schema:any = response.data.schema;
    // const attributeNames = schema ? schema.fields.map((field: { fieldName: any; }) => field.fieldName) : [];

    //console.log(finalcustom, "attributeNames")


    return finalcustom
}