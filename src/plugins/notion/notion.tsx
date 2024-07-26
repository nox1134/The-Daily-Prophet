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
    currentConfig?.url ?? "https://www.notion.so/"
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
          placeholder="https://www.notion.so/"
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

const NotionPlugin = ({
  config,
  instanceId,
}: WidgetRenderProps<PicturePluginWidgetConfigType>) => {
  const redirect3 = () => {
    window.open(config.url, "_blank");
  };

  return (
    <div className="PictureWidget">
      <button id="notion" onClick={redirect3}>
        <img
          src="https://static-00.iconduck.com/assets.00/notion-icon-256x256-g1arps9e.png"
          alt="notion"
          width="80%"
        />
      </button>
    </div>
  );
};

const widgetDescriptor = {
  id: "widget",
  get name() {
    return translate("notion.widgetName");
  },
  configurationScreen: PictureConfigScreen,
  mainScreen: NotionPlugin,
  mock: () => {
    return (
      <NotionPlugin
        instanceId="mock"
        config={{
          url: "https://www.notion.so/",
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

export const notionPlugin = {
  id: "notion",
  get name() {
    return translate("notion");
  },
  widgets: [widgetDescriptor],
  configurationScreen: null,
} satisfies NoxPlugin;
