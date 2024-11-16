import { useTranslation } from "next-i18next";

import Container from "components/services/widget/container";
import Block from "components/services/widget/block";
import useWidgetAPI from "utils/proxy/use-widget-api";

export default function Component({ service }) {
  const { t } = useTranslation(); // Re-enable translation

  const { widget } = service;

  const { data: netdataData, error: netdataError } = useWidgetAPI(widget, "info");

  if (netdataError) {
    return <Container service={service} error={netdataError} />;
  }

  if (!netdataData) {
    return (
      <Container service={service}>
        <Block label={t("netdata.warnings")} />
        <Block label={t("netdata.criticals")} />
      </Container>
    );
  }

  // Extract required data with camelCase naming
  const {
    agents: [
      {
        nm: agentName,
        application: {
          os: { kernel, kernel_version: kernelVersion },
          hw: { cpu_architecture: cpuArchitecture, cpu_cores: cpuCores },
        },
      },
    ],
  } = netdataData;

  return (
    <Container service={service}>
      <Block label={t("netdata.agentName")} value={agentName} />
      <Block label={t("netdata.kernel")} value={kernel} />
      <Block label={t("netdata.kernelVersion")} value={kernelVersion} />
      <Block label={t("netdata.cpuArchitecture")} value={cpuArchitecture} />
      <Block label={t("netdata.cpuCores")} value={cpuCores} />
    </Container>
  );
}
