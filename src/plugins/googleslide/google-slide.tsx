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
      "https://docs.google.com/presentation/d/e/2PACX-1vS4ockj5ilR0GTbCgF1j6D8nyNVWSHi_x9xpqZ8hRx8VyJEFfVkNPBOsum92SZjJZHxYJoQ_skWeHtT/embed?start=true&loop=true&delayms=3000"
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
          placeholder="https://docs.google.com/presentation/d/e/2PACX-1vS4ockj5ilR0GTbCgF1j6D8nyNVWSHi_x9xpqZ8hRx8VyJEFfVkNPBOsum92SZjJZHxYJoQ_skWeHtT/embed?start=true&loop=true&delayms=3000"
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

const GoogleslidePlugin = ({
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
    return translate("google-slide.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: GoogleslidePlugin,
  mock: () => {
    return (
      <GoogleslidePlugin
        instanceId="mock"
        config={{
          url: "https://docs.google.com/presentation/d/e/2PACX-1vS4ockj5ilR0GTbCgF1j6D8nyNVWSHi_x9xpqZ8hRx8VyJEFfVkNPBOsum92SZjJZHxYJoQ_skWeHtT/embed?start=true&loop=true&delayms=3000",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 3,
      height: 2,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const googleslidePlugin = {
  id: "google-slide",
  get name() {
    return translate("google-slide");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
