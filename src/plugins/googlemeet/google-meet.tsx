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
    currentConfig?.url ?? "https://meet.google.com"
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
          placeholder="https://meet.google.com"
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

const GooglemeetPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  const redirect2 = () => {
    window.open(config.url, "_blank");
  };

  return (
    <div className="PictureWidget">
      <button id="gmeet" onClick={redirect2}>
        <img
          src="https://w7.pngwing.com/pngs/383/337/png-transparent-google-meet-icon-2020-hd-logo-thumbnail.png"
          alt="gmeet"
          width="80%"
        />
      </button>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("google-meet.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: GooglemeetPlugin,
  mock: () => {
    return (
      <GooglemeetPlugin
        instanceId="mock"
        config={{
          url: "https://meet.google.com",
        }}
      />
    );
  },
  appearance: {
    withoutPadding: true,
    size: {
      width: 1,
      height: 1,
    },
    resizable: true,
  },
} as const satisfies WidgetDescriptor<any>;

export const googlemeetPlugin = {
  id: "google-meet",
  get name() {
    return translate("google-meet");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
