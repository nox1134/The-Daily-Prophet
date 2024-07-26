import { Button } from "@components/Button";
import {
  NoxPlugin,
  WidgetConfigurationScreenProps,
  WidgetRenderProps,
  WidgetDescriptor,
} from "@utils/user-data/types";
import "./styles.scss";
import { translate } from "@translations/index";
import { useTranslation } from "react-i18next";
import { Input } from "@components/Input";
import { useState } from "react";

type PicturePluginWidgetConfigType = {
  url: string;
};

const PictureConfigScreen = ({
  saveConfiguration,
  currentConfig,
}: WidgetConfigurationScreenProps<PicturePluginWidgetConfigType>) => {
  const { t } = useTranslation();
  const [url, setUrl] = useState(
    currentConfig?.url ??
      "https://docs.google.com/forms/d/e/1FAIpQLSfAUDVkGbgyS8ea97nf5Pubx1AdoYYeBDbsz91C8qdigwp6gg/viewform?embedded=true"
  );

  const onConfirm = () => {
    saveConfiguration({
      url: url,
    });
  };

  return (
    <div className="PictureWidget-config">
      <div className="field">
        <label>{t("url")}:</label>
        <Input
          placeholder="https://docs.google.com/forms/d/e/1FAIpQLSfAUDVkGbgyS8ea97nf5Pubx1AdoYYeBDbsz91C8qdigwp6gg/viewform?embedded=true"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
      </div>

      <Button className="save-config" onClick={onConfirm}>
        {t("save")}
      </Button>
    </div>
  );
};

const GoogleformPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  return (
    <div className="PictureWidget">
      <iframe
        className="GoogleSlide"
        src={config.url}
        width="100%"
        height="100%"
        frameBorder="0"
        allowFullScreen
      ></iframe>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("google-form.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: GoogleformPlugin,
  mock: () => {
    return (
      <GoogleformPlugin
        instanceId="mock"
        config={{
          url: "https://docs.google.com/forms/d/e/1FAIpQLSfAUDVkGbgyS8ea97nf5Pubx1AdoYYeBDbsz91C8qdigwp6gg/viewform?embedded=true",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 3,
      height: 4,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const googleformPlugin = {
  id: "google-form",
  get name() {
    return translate("google-form");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
