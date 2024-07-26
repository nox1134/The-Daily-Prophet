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
    currentConfig?.url ?? "https://open.spotify.com/"
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
          placeholder="https://open.spotify.com/"
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

const SpotifyPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  const redirect3 = () => {
    window.open(config.url, "_blank");
  };

  return (
    <div className="PictureWidget">
      <button id="spotify" onClick={redirect3}>
        <img
          src="https://developer.spotify.com/images/guidelines/design/icon3@2x.png"
          alt="spotify"
          width="80%"
        />
      </button>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("spotify.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: SpotifyPlugin,
  mock: () => {
    return (
      <SpotifyPlugin
        instanceId="mock"
        config={{
          url: "https://open.spotify.com/",
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

export const spotifyPlugin = {
  id: "spotify",
  get name() {
    return translate("spotify");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
