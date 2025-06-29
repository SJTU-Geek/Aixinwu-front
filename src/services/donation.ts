import { RenderCertificateDocument, RenderCertificateMutation } from "@/graphql/hooks";
import { CertificateInfo } from "@/models/donation";
import { ApolloClient } from "@apollo/client";

//渲染证书
export async function renderCertificate(client: ApolloClient<object>, donationId: string) {
  try {
    const resp = await client.mutate<RenderCertificateMutation>({
        mutation: RenderCertificateDocument,
        variables: {
          donationId: donationId
        }
    }); 
    if (!resp.data || 
        !resp.data.certificateRender) {
      throw "生成证书失败";
    }
    var data = {
      png: resp.data?.certificateRender.certificatePng,
      pdf: resp.data?.certificateRender.certificatePdf
    };
    return data;
  } catch (error) {
    var errmessage = `请求失败：${error}`
    console.error(errmessage);
    throw errmessage;
  }
};