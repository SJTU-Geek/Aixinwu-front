import AuthContext from "@/contexts/auth";
import { MessageContext } from "@/contexts/message";
import useErrorMessage from "@/hooks/useErrorMessage";
import { CertificateInfo } from "@/models/donation";
import { renderCertificate } from "@/services/donation";
import { Button, Flex, Image, Modal, Progress, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { FileImageOutlined, FilePdfOutlined } from '@ant-design/icons'
const { Text, Link } = Typography;

interface DonationCertModalProps {
  donationId: string;
  isopen: boolean;
  onClose: () => void;
}
export const DonationCertModal: React.FC<DonationCertModalProps> = (props) => {
  const authCtx = useContext(AuthContext);
  const client = authCtx.client;
  const message = useContext(MessageContext);
  const router = useRouter();
  const { et } = useErrorMessage();

  const [process, setProcess] = useState<number>(0);
  const [processStatus, setProcessStatus] = useState<"exception" | undefined>(undefined);
  const [processInfo, setProcessInfo] = useState<string>("");

  const [certInfo, setCertInfo] = useState<CertificateInfo | undefined>(undefined);

  useEffect(()=>{
    if (props.isopen)
    {
      renderCertificate(client!, props.donationId)
        .then((data) => { 
          if (data.pdf && data.png)
            setCertInfo({
              pdf: data.pdf,
              png: data.png
            });
          else
          {
            setProcess(100);
            setProcessStatus("exception");
            setProcessInfo("此捐赠无证书");
          }
        })
        .catch((err) => { message.error(err); });
    }
  }, [props.isopen]);

  return (
      <Modal
          open={props.isopen}
          title={certInfo ? "捐赠证书" : "正在生成证书"}
          footer={null}
          keyboard={false}
          maskClosable={certInfo ? true : false}
          onCancel={props.onClose}
          width={certInfo ? undefined : 240}
      >
        {
          certInfo ? (
            <Flex 
              align="center" 
              wrap="wrap" 
              gap={16} 
              style={{padding: '0px 5%'}}
            >
              <Image 
                src={certInfo.png} 
                preview={false} 
                wrapperStyle={{flexBasis: '100%'}}
              />
              <Button 
                style={{flex: "1 1 0px"}} 
                icon={<FileImageOutlined />}
                onClick={() => { window.open(certInfo.png, "_blank") }}
              >
                下载 PNG
              </Button>
              <Button 
                style={{flex: "1 1 0px"}} 
                icon={<FilePdfOutlined />}
                onClick={() => { window.open(certInfo.pdf, "_blank") }}
              >
                下载 PDF
              </Button>
            </Flex>
          ) : (
            <Flex align="center" justify="center" vertical={true} style={{
                marginTop: "24px"
            }}>
                <Progress type="circle" percent={process} status={processStatus}/>
                <Text style={{
                    marginTop: "12px"
                }}>{processInfo}</Text>
            </Flex>
          )
        }
      </Modal>
  );
}