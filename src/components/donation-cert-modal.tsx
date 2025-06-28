import AuthContext from "@/contexts/auth";
import { MessageContext } from "@/contexts/message";
import useErrorMessage from "@/hooks/useErrorMessage";
import { Flex, Modal, Progress, Typography } from "antd";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useContext } from "react";
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

  const [process, setProcess] = React.useState<number>(0);
  const [processStatus, setProcessStatus] = React.useState<"exception" | undefined>(undefined);
  const [processInfo, setProcessInfo] = React.useState<string>("");
  
  

  return (
      <Modal
          open={props.isopen}
          title="正在生成证书"
          footer={null}
          keyboard={false}
          maskClosable={false}
          onCancel={props.onClose}
          width={240}
      >
          <Flex align="center" justify="center" vertical={true} style={{
              marginTop: "24px"
          }}>
              <Progress type="circle" percent={process} status={processStatus}/>
              <Text style={{
                  marginTop: "12px"
              }}>{processInfo}</Text>
          </Flex>
      </Modal>
  );
}